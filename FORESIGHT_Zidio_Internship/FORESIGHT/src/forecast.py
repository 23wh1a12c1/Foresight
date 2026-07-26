import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import pickle
import warnings

# Suppress warnings to avoid log clutter and speed up execution
warnings.filterwarnings("ignore")

def train_and_evaluate_forecast(processed_dir="data/processed"):
    print("Starting demand forecasting and backtesting engine (batch optimized)...")
    
    # ----------------------------------------------------
    # 1. Load Data
    # ----------------------------------------------------
    weekly_path = os.path.join(processed_dir, "sales_weekly.csv")
    if not os.path.exists(weekly_path):
        raise FileNotFoundError("Processed sales data missing. Run src/pipeline.py first.")
        
    df_weekly = pd.read_csv(weekly_path)
    df_weekly["week_start"] = pd.to_datetime(df_weekly["week_start"])
    
    # Sort data chronologically per SKU
    df_weekly = df_weekly.sort_values(["sku_id", "week_start"]).reset_index(drop=True)
    
    # Find the latest Monday week_start in the history (which ends 2026-06-21)
    history_end = df_weekly[df_weekly["week_start"] <= pd.to_datetime("2026-06-21")]["week_start"].max()
    df_hist = df_weekly[df_weekly["week_start"] <= history_end].copy()
    
    sku_ids = df_hist["sku_id"].unique()
    all_weeks = sorted(df_hist["week_start"].unique())
    num_weeks = len(all_weeks)
    
    print(f"History contains {num_weeks} weeks of sales for {len(sku_ids)} SKUs.")
    
    # Pre-build dictionary indexed by (sku_id, week_start) for fast O(1) lookups
    hist_dict = df_hist.set_index(["sku_id", "week_start"]).to_dict(orient="index")
    
    # ----------------------------------------------------
    # 2. Define Features & Helper functions
    # ----------------------------------------------------
    feature_cols = [
        "units_sold_lag_1", "units_sold_lag_2", "units_sold_lag_3", "units_sold_lag_4",
        "units_sold_lag_52",
        "units_sold_roll_mean_4", "units_sold_roll_std_4",
        "month", "week_of_year", "holiday_days", "promo_active"
    ]
    
    def get_seasonal_naive_pred(sku_id, week_start, current_sim_dict=None):
        target_week = week_start - pd.to_timedelta(52 * 7, unit="D")
        
        # Check in history dictionary
        hist_match = hist_dict.get((sku_id, target_week))
        if hist_match is not None:
            return float(hist_match["units_sold"])
            
        # Fallback to rolling average of past 4 weeks
        recent_vals = []
        for lag in [1, 2, 3, 4]:
            lag_week = week_start - pd.to_timedelta(lag * 7, unit="D")
            # First check simulation dictionary (for future predictions)
            if current_sim_dict and (sku_id, lag_week) in current_sim_dict:
                recent_vals.append(current_sim_dict[(sku_id, lag_week)])
            else:
                m = hist_dict.get((sku_id, lag_week))
                if m is not None:
                    recent_vals.append(float(m["units_sold"]))
        if recent_vals:
            return float(np.mean(recent_vals))
        return 0.0

    # ----------------------------------------------------
    # 3. Rolling-Origin Backtesting
    # ----------------------------------------------------
    horizon = 8
    origins = [
        history_end - pd.to_timedelta(24 * 7, unit="D"),
        history_end - pd.to_timedelta(16 * 7, unit="D"),
        history_end - pd.to_timedelta(8 * 7, unit="D")
    ]
    
    print("Running rolling-origin cross-validation (backtesting)...")
    
    backtest_results = []
    
    # We maintain a simulation dictionary for backtest predictions to query quickly
    bt_preds_dict = {} # Key: (fold, sku_id, week_start) -> pred_val
    
    for fold, origin in enumerate(origins):
        print(f"  Fold {fold+1}/{len(origins)}: Training up to {origin.strftime('%Y-%m-%d')}, predicting next {horizon} weeks...")
        
        # Split train/test for this fold
        df_train = df_hist[df_hist["week_start"] <= origin].copy()
        
        X_train = df_train[feature_cols]
        y_train = df_train["units_sold"]
        
        model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)
        
        # Forecast step by step (batch prediction per step)
        for step in range(1, horizon + 1):
            target_week = origin + pd.to_timedelta(step * 7, unit="D")
            step_records = []
            
            # Build the feature matrix for all SKUs at this step
            for sku_id in sku_ids:
                # Get actual values for comparison (must exist in hist_dict)
                actual_match = hist_dict.get((sku_id, target_week))
                if actual_match is None:
                    continue
                actual_sales = float(actual_match["units_sold"])
                
                # Baseline
                baseline_pred = get_seasonal_naive_pred(sku_id, target_week)
                
                # Fetch Lags
                lag_vals = []
                for lag in [1, 2, 3, 4]:
                    lag_week = target_week - pd.to_timedelta(lag * 7, unit="D")
                    if lag_week > origin:
                        # Use previous prediction in this fold
                        prev_pred = bt_preds_dict.get((fold, sku_id, lag_week), 0.0)
                        lag_vals.append(prev_pred)
                    else:
                        # Use actual
                        act_match = hist_dict.get((sku_id, lag_week))
                        lag_vals.append(float(act_match["units_sold"]) if act_match else 0.0)
                        
                roll_mean = np.mean(lag_vals[:4])
                roll_std = np.std(lag_vals[:4])
                
                # Fetch lag 52
                lag_52_week = target_week - pd.to_timedelta(52 * 7, unit="D")
                lag_52_match = hist_dict.get((sku_id, lag_52_week))
                lag_52_val = float(lag_52_match["units_sold"]) if lag_52_match else 0.0
                
                # Fetch calendar features for this week
                target_match = hist_dict.get((sku_id, target_week), {})
                month_val = int(target_week.month)
                week_of_year_val = int(target_week.isocalendar()[1])
                holiday_days_val = float(target_match.get("holiday_days", 0.0))
                promo_active_val = float(target_match.get("promo_active", 0.0))
                
                step_records.append({
                    "sku_id": sku_id,
                    "target_week": target_week,
                    "actual": actual_sales,
                    "baseline": baseline_pred,
                    # Features
                    "units_sold_lag_1": lag_vals[0],
                    "units_sold_lag_2": lag_vals[1],
                    "units_sold_lag_3": lag_vals[2],
                    "units_sold_lag_4": lag_vals[3],
                    "units_sold_lag_52": lag_52_val,
                    "units_sold_roll_mean_4": roll_mean,
                    "units_sold_roll_std_4": roll_std,
                    "month": month_val,
                    "week_of_year": week_of_year_val,
                    "holiday_days": holiday_days_val,
                    "promo_active": promo_active_val
                })
                
            if not step_records:
                continue
                
            # Create batch DataFrame
            df_step = pd.DataFrame(step_records)
            
            # Predict for all SKUs in a single call
            preds = model.predict(df_step[feature_cols])
            preds = np.clip(preds, 0.0, None)
            df_step["pred"] = preds
            
            # Save predictions and results
            for _, row in df_step.iterrows():
                bt_preds_dict[(fold, row["sku_id"], row["target_week"])] = float(row["pred"])
                
                backtest_results.append({
                    "fold": fold,
                    "sku_id": row["sku_id"],
                    "week_start": row["target_week"],
                    "step": step,
                    "actual": row["actual"],
                    "pred": row["pred"],
                    "baseline": row["baseline"]
                })
                
    df_bt = pd.DataFrame(backtest_results)
    
    # ----------------------------------------------------
    # 4. Evaluate Metrics
    # ----------------------------------------------------
    total_actual = df_bt["actual"].sum()
    ml_wape = np.sum(np.abs(df_bt["actual"] - df_bt["pred"])) / total_actual
    baseline_wape = np.sum(np.abs(df_bt["actual"] - df_bt["baseline"])) / total_actual
    
    ml_bias = np.mean(df_bt["pred"] - df_bt["actual"])
    baseline_bias = np.mean(df_bt["baseline"] - df_bt["actual"])
    
    print("\nBacktest Performance Summary:")
    print(f"  ML Model (Random Forest) WAPE: {ml_wape:.4f} (Bias: {ml_bias:.2f})")
    print(f"  Seasonal-Naive Baseline WAPE: {baseline_wape:.4f} (Bias: {baseline_bias:.2f})")
    
    improvement = (baseline_wape - ml_wape) / baseline_wape * 100
    print(f"  WAPE Improvement over Baseline: {improvement:.2f}%")
    
    # Calculate forecast uncertainty standard errors per step
    step_errors = {}
    for step in range(1, horizon + 1):
        df_step = df_bt[df_bt["step"] == step]
        rmse = np.sqrt(np.mean((df_step["actual"] - df_step["pred"])**2))
        step_errors[step] = max(0.5, rmse)
        
    metrics = {
        "ml_wape": float(ml_wape),
        "baseline_wape": float(baseline_wape),
        "ml_bias": float(ml_bias),
        "baseline_bias": float(baseline_bias),
        "improvement_pct": float(improvement),
        "step_errors": step_errors
    }
    with open(os.path.join(processed_dir, "backtest_metrics.pkl"), "wb") as f:
        pickle.dump(metrics, f)
        
    # ----------------------------------------------------
    # 5. Final Forecast Generation
    # ----------------------------------------------------
    print("\nTraining final model on full sales history...")
    X_full = df_hist[feature_cols]
    y_full = df_hist["units_sold"]
    
    final_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    final_model.fit(X_full, y_full)
    
    with open(os.path.join(processed_dir, "final_model.pkl"), "wb") as f:
        pickle.dump(final_model, f)
        
    print("Generating demand forecast for 8-week horizon (2026-06-22 to 2026-08-16)...")
    
    df_calendar_weekly = df_weekly.groupby("week_start").agg(
        holiday_days=("holiday_days", "first"),
        promo_active=("promo_active", "first")
    ).reset_index()
    calendar_weekly_dict = df_calendar_weekly.set_index("week_start").to_dict(orient="index")
    
    future_weeks = [history_end + pd.to_timedelta(i * 7, unit="D") for i in range(1, horizon + 1)]
    
    forecast_rows = []
    sim_sales_dict = {} # Key: (sku_id, week_start) -> units_sold
    
    for step, target_week in enumerate(future_weeks, start=1):
        step_records = []
        for sku_id in sku_ids:
            baseline_pred = get_seasonal_naive_pred(sku_id, target_week, sim_sales_dict)
            
            # Fetch Lags
            lag_vals = []
            for lag in [1, 2, 3, 4]:
                lag_week = target_week - pd.to_timedelta(lag * 7, unit="D")
                if (sku_id, lag_week) in sim_sales_dict:
                    lag_vals.append(sim_sales_dict[(sku_id, lag_week)])
                else:
                    m = hist_dict.get((sku_id, lag_week))
                    lag_vals.append(float(m["units_sold"]) if m else 0.0)
                    
            roll_mean = np.mean(lag_vals[:4])
            roll_std = np.std(lag_vals[:4])
            
            # Fetch lag 52
            lag_52_week = target_week - pd.to_timedelta(52 * 7, unit="D")
            lag_52_match = hist_dict.get((sku_id, lag_52_week))
            lag_52_val = float(lag_52_match["units_sold"]) if lag_52_match else 0.0
            
            cal_match = calendar_weekly_dict.get(target_week, {})
            holiday_days_val = float(cal_match.get("holiday_days", 0.0))
            promo_active_val = float(cal_match.get("promo_active", 0.0))
            
            step_records.append({
                "sku_id": sku_id,
                "target_week": target_week,
                "baseline": baseline_pred,
                # Features
                "units_sold_lag_1": lag_vals[0],
                "units_sold_lag_2": lag_vals[1],
                "units_sold_lag_3": lag_vals[2],
                "units_sold_lag_4": lag_vals[3],
                "units_sold_lag_52": lag_52_val,
                "units_sold_roll_mean_4": roll_mean,
                "units_sold_roll_std_4": roll_std,
                "month": int(target_week.month),
                "week_of_year": int(target_week.isocalendar()[1]),
                "holiday_days": holiday_days_val,
                "promo_active": promo_active_val
            })
            
        if not step_records:
            continue
            
        df_step = pd.DataFrame(step_records)
        preds = final_model.predict(df_step[feature_cols])
        preds = np.clip(preds, 0.0, None)
        df_step["pred"] = preds
        
        for _, row in df_step.iterrows():
            sim_sales_dict[(row["sku_id"], row["target_week"])] = float(row["pred"])
            
            rmse = step_errors.get(step, 1.0)
            ci_lower = max(0.0, row["pred"] - 1.28 * rmse)
            ci_upper = row["pred"] + 1.28 * rmse
            
            forecast_rows.append({
                "sku_id": row["sku_id"],
                "week_start": row["target_week"],
                "forecast": row["pred"],
                "baseline": row["baseline"],
                "ci_lower": ci_lower,
                "ci_upper": ci_upper,
                "step": step
            })
            
    df_fc = pd.DataFrame(forecast_rows)
    
    # ----------------------------------------------------
    # 6. Save Forecast Results
    # ----------------------------------------------------
    history_records = []
    for (sku_id, week_start), val in hist_dict.items():
        baseline_val = get_seasonal_naive_pred(sku_id, week_start)
        history_records.append({
            "sku_id": sku_id,
            "week_start": week_start,
            "type": "actual",
            "value": float(val["units_sold"]),
            "baseline": baseline_val,
            "ci_lower": float(val["units_sold"]),
            "ci_upper": float(val["units_sold"]),
            "step": 0
        })
    df_fc_hist = pd.DataFrame(history_records)
    
    future_records = []
    for _, row in df_fc.iterrows():
        future_records.append({
            "sku_id": row["sku_id"],
            "week_start": row["week_start"],
            "type": "forecast",
            "value": row["forecast"],
            "baseline": row["baseline"],
            "ci_lower": row["ci_lower"],
            "ci_upper": row["ci_upper"],
            "step": row["step"]
        })
    df_fc_future = pd.DataFrame(future_records)
    
    df_all_fc = pd.concat([df_fc_hist, df_fc_future], ignore_index=True)
    
    combined_path = os.path.join(processed_dir, "forecasts.csv")
    df_all_fc.to_csv(combined_path, index=False)
    print(f"Demand forecast generation complete. Saved combined results to {combined_path}")

if __name__ == "__main__":
    train_and_evaluate_forecast()
