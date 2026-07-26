import os
import pandas as pd
import numpy as np

def clean_and_process_data(raw_dir="data/raw", processed_dir="data/processed"):
    os.makedirs(processed_dir, exist_ok=True)
    
    print("Starting data ingestion and cleaning pipeline...")
    
    # ----------------------------------------------------
    # 1. Ingest Data
    # ----------------------------------------------------
    sales_path = os.path.join(raw_dir, "sales_daily.csv")
    sku_path = os.path.join(raw_dir, "sku_master.csv")
    calendar_path = os.path.join(raw_dir, "calendar.csv")
    inventory_path = os.path.join(raw_dir, "inventory_snapshots.csv")
    
    if not (os.path.exists(sales_path) and os.path.exists(sku_path) and 
            os.path.exists(calendar_path) and os.path.exists(inventory_path)):
        raise FileNotFoundError("Raw files missing from data/raw/. Run src/generator.py first.")
        
    df_sales = pd.read_csv(sales_path)
    df_sku = pd.read_csv(sku_path)
    df_calendar = pd.read_csv(calendar_path)
    df_inventory = pd.read_csv(inventory_path)
    
    print(f"Loaded raw data:")
    print(f"  Sales daily rows: {len(df_sales)}")
    print(f"  SKU master rows: {len(df_sku)}")
    print(f"  Calendar rows: {len(df_calendar)}")
    print(f"  Inventory snapshot rows: {len(df_inventory)}")
    
    # ----------------------------------------------------
    # 2. Clean SKU Master
    # ----------------------------------------------------
    print("Cleaning SKU Master...")
    # Standardize category names (casing typos)
    # E.g. "home decor", "home_decor", "Home Decor" -> all become "Home Decor"
    df_sku["category"] = df_sku["category"].astype(str).str.replace("_", " ").str.strip().str.title()
    df_sku["subcategory"] = df_sku["subcategory"].astype(str).str.strip().str.title()
    
    # Convert types
    df_sku["unit_cost"] = pd.to_numeric(df_sku["unit_cost"], errors="coerce")
    df_sku["list_price"] = pd.to_numeric(df_sku["list_price"], errors="coerce")
    df_sku["launch_date"] = pd.to_datetime(df_sku["launch_date"])
    
    # Save clean sku master
    df_sku.to_csv(os.path.join(processed_dir, "sku_master_clean.csv"), index=False)
    
    # ----------------------------------------------------
    # 3. Clean Sales Daily
    # ----------------------------------------------------
    print("Cleaning Sales Daily...")
    # Remove duplicates
    initial_len = len(df_sales)
    df_sales.drop_duplicates(inplace=True)
    dupe_count = initial_len - len(df_sales)
    print(f"  Removed {dupe_count} duplicate sales records.")
    
    # Standardize types
    df_sales["date"] = pd.to_datetime(df_sales["date"])
    df_sales["units_sold"] = pd.to_numeric(df_sales["units_sold"], errors="coerce")
    df_sales["unit_price"] = pd.to_numeric(df_sales["unit_price"], errors="coerce")
    df_sales["revenue"] = pd.to_numeric(df_sales["revenue"], errors="coerce")
    df_sales["promo_flag"] = pd.to_numeric(df_sales["promo_flag"], errors="coerce").fillna(0).astype(int)
    
    # Impute missing values
    # We join with SKU master to get list_price
    df_sales = df_sales.merge(df_sku[["sku_id", "list_price"]], on="sku_id", how="left")
    
    # If price is missing: if promo_flag = 1, list_price * 0.85 (15% off), else list_price
    discounted_price = np.round(df_sales["list_price"] * 0.85, 2)
    imputed_price = pd.Series(np.where(df_sales["promo_flag"] == 1, discounted_price, df_sales["list_price"]), index=df_sales.index)
    df_sales["unit_price"] = df_sales["unit_price"].fillna(imputed_price)
    
    # If units_sold is missing, fill with 0
    df_sales["units_sold"] = df_sales["units_sold"].fillna(0).astype(int)
    
    # Recalculate revenue where it was null
    df_sales["revenue"] = df_sales["revenue"].fillna(
        np.round(df_sales["units_sold"] * df_sales["unit_price"], 2)
    )
    
    # Drop list_price helper column
    df_sales.drop(columns=["list_price"], inplace=True)
    
    # Save clean daily sales
    df_sales.to_csv(os.path.join(processed_dir, "sales_daily_clean.csv"), index=False)
    
    # ----------------------------------------------------
    # 4. Clean Calendar and Inventory
    # ----------------------------------------------------
    print("Cleaning Calendar and Inventory...")
    df_calendar["date"] = pd.to_datetime(df_calendar["date"])
    df_calendar["week"] = df_calendar["week"].astype(int)
    df_calendar["month"] = df_calendar["month"].astype(int)
    df_calendar.to_csv(os.path.join(processed_dir, "calendar_clean.csv"), index=False)
    
    df_inventory["date"] = pd.to_datetime(df_inventory["date"])
    df_inventory["on_hand_units"] = pd.to_numeric(df_inventory["on_hand_units"], errors="coerce").fillna(0).astype(int)
    df_inventory["on_order_units"] = pd.to_numeric(df_inventory["on_order_units"], errors="coerce").fillna(0).astype(int)
    df_inventory["lead_time_days"] = pd.to_numeric(df_inventory["lead_time_days"], errors="coerce").fillna(14).astype(int)
    df_inventory["reorder_point"] = pd.to_numeric(df_inventory["reorder_point"], errors="coerce").fillna(30).astype(int)
    df_inventory.to_csv(os.path.join(processed_dir, "inventory_clean.csv"), index=False)
    
    # ----------------------------------------------------
    # 5. Aggregate to Weekly SKU-level
    # ----------------------------------------------------
    print("Aggregating sales to Weekly SKU-level dataset...")
    # Calculate week starting Monday
    df_sales["week_start"] = df_sales["date"] - pd.to_timedelta(df_sales["date"].dt.weekday, unit="D")
    
    df_weekly = df_sales.groupby(["sku_id", "week_start"]).agg(
        units_sold=("units_sold", "sum"),
        revenue=("revenue", "sum"),
        avg_unit_price=("unit_price", "mean"),
        promo_days=("promo_flag", "sum")
    ).reset_index()
    
    # Aggregate calendar to weekly parameters
    df_calendar["week_start"] = df_calendar["date"] - pd.to_timedelta(df_calendar["date"].dt.weekday, unit="D")
    df_calendar_weekly = df_calendar.groupby("week_start").agg(
        holiday_days=("is_holiday", "sum"),
        promo_active=("promo_event", lambda x: int(x.notnull().any()))
    ).reset_index()
    
    # Merge weekly sales with weekly calendar & SKU info
    df_weekly = df_weekly.merge(df_calendar_weekly, on="week_start", how="left")
    df_weekly = df_weekly.merge(df_sku[["sku_id", "category", "subcategory", "unit_cost", "list_price"]], on="sku_id", how="left")
    
    # Fill any gaps: make sure there are no missing weeks in history for active SKUs
    # Create complete grid of (sku, week_start)
    all_skus = df_sku["sku_id"].unique()
    all_weeks = df_calendar_weekly["week_start"].unique()
    
    # We only want weeks up to the history end date (2026-06-21)
    history_weeks = [w for w in all_weeks if w <= pd.to_datetime("2026-06-21")]
    
    grid = pd.MultiIndex.from_product([all_skus, history_weeks], names=["sku_id", "week_start"]).to_frame().reset_index(drop=True)
    
    df_weekly = grid.merge(df_weekly, on=["sku_id", "week_start"], how="left")
    
    # Merge back SKU attributes for rows created by complete grid
    df_weekly.drop(columns=["category", "subcategory", "unit_cost", "list_price"], inplace=True, errors="ignore")
    df_weekly = df_weekly.merge(df_sku[["sku_id", "category", "subcategory", "unit_cost", "list_price", "launch_date"]], on="sku_id", how="left")
    
    # Filter out records before the SKU's launch date
    df_weekly = df_weekly[df_weekly["week_start"] >= (df_weekly["launch_date"] - pd.to_timedelta(df_weekly["launch_date"].dt.weekday, unit="D"))]
    df_weekly.drop(columns=["launch_date"], inplace=True)
    
    # Fill NaNs for weeks with zero sales
    df_weekly["units_sold"] = df_weekly["units_sold"].fillna(0).astype(int)
    df_weekly["revenue"] = df_weekly["revenue"].fillna(0.0)
    # Impute average unit price
    df_weekly["avg_unit_price"] = df_weekly["avg_unit_price"].fillna(df_weekly["list_price"])
    df_weekly["promo_days"] = df_weekly["promo_days"].fillna(0).astype(int)
    
    # Merge calendar metrics for complete grid rows
    df_weekly.drop(columns=["holiday_days", "promo_active"], inplace=True, errors="ignore")
    df_weekly = df_weekly.merge(df_calendar_weekly, on="week_start", how="left")
    
    # ----------------------------------------------------
    # 6. Feature Engineering
    # ----------------------------------------------------
    print("Engineering weekly lag and rolling features...")
    df_weekly = df_weekly.sort_values(["sku_id", "week_start"]).reset_index(drop=True)
    
    # Create Lags
    for lag in [1, 2, 3, 4]:
        df_weekly[f"units_sold_lag_{lag}"] = df_weekly.groupby("sku_id")["units_sold"].shift(lag)
    
    # 52-week lag for seasonality
    df_weekly["units_sold_lag_52"] = df_weekly.groupby("sku_id")["units_sold"].shift(52)
        
    # Create Rolling Means
    df_weekly["units_sold_roll_mean_4"] = df_weekly.groupby("sku_id")["units_sold_lag_1"].transform(
        lambda x: x.rolling(4, min_periods=1).mean()
    )
    df_weekly["units_sold_roll_std_4"] = df_weekly.groupby("sku_id")["units_sold_lag_1"].transform(
        lambda x: x.rolling(4, min_periods=1).std().fillna(0.0)
    )
    
    # Calendar properties of the week start
    df_weekly["month"] = df_weekly["week_start"].dt.month
    df_weekly["year"] = df_weekly["week_start"].dt.year
    df_weekly["week_of_year"] = df_weekly["week_start"].dt.isocalendar().week.astype(int)
    
    # Fill remaining NaNs in lag features (e.g. at the beginning of history)
    df_weekly.fillna({
        "units_sold_lag_1": 0,
        "units_sold_lag_2": 0,
        "units_sold_lag_3": 0,
        "units_sold_lag_4": 0,
        "units_sold_lag_52": df_weekly.groupby("sku_id")["units_sold"].transform("mean").fillna(0),
        "units_sold_roll_mean_4": 0,
        "units_sold_roll_std_4": 0
    }, inplace=True)
    
    # Save processed dataset
    output_path = os.path.join(processed_dir, "sales_weekly.csv")
    df_weekly.to_csv(output_path, index=False)
    print(f"Data pipeline complete. Cleaned and processed dataset saved to {output_path}")
    print(f"Processed weekly records: {len(df_weekly)}")

if __name__ == "__main__":
    clean_and_process_data()
