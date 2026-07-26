import os
import pandas as pd
import numpy as np

def calculate_inventory_risks(processed_dir="data/processed"):
    print("Starting inventory risk scoring and decisioning layer...")
    
    # ----------------------------------------------------
    # 1. Load Data
    # ----------------------------------------------------
    sku_path = os.path.join(processed_dir, "sku_master_clean.csv")
    inventory_path = os.path.join(processed_dir, "inventory_clean.csv")
    forecast_path = os.path.join(processed_dir, "forecasts.csv")
    
    if not (os.path.exists(sku_path) and os.path.exists(inventory_path) and os.path.exists(forecast_path)):
        raise FileNotFoundError("Clean files missing. Run src/pipeline.py and src/forecast.py first.")
        
    df_sku = pd.read_csv(sku_path)
    df_inv = pd.read_csv(inventory_path)
    df_fc = pd.read_csv(forecast_path)
    
    df_fc["week_start"] = pd.to_datetime(df_fc["week_start"])
    df_inv["date"] = pd.to_datetime(df_inv["date"])
    
    # Filter forecasts for the future forecast horizon (type == "forecast")
    df_future_fc = df_fc[df_fc["type"] == "forecast"].copy()
    
    sku_ids = df_sku["sku_id"].unique()
    
    risk_records = []
    
    for sku_id in sku_ids:
        # Get SKU master info
        sku_meta = df_sku[df_sku["sku_id"] == sku_id].iloc[0]
        list_price = float(sku_meta["list_price"])
        unit_cost = float(sku_meta["unit_cost"])
        category = sku_meta["category"]
        subcategory = sku_meta["subcategory"]
        
        # Get Inventory details
        inv_match = df_inv[df_inv["sku_id"] == sku_id]
        if len(inv_match) == 0:
            # Fallback if no inventory details
            on_hand = 0
            on_order = 0
            lead_time_days = 14
            reorder_point = 10
        else:
            inv_row = inv_match.iloc[0]
            on_hand = int(inv_row["on_hand_units"])
            on_order = int(inv_row["on_order_units"])
            lead_time_days = int(inv_row["lead_time_days"])
            reorder_point = int(inv_row["reorder_point"])
            
        # Get Forecast for this SKU
        sku_fc = df_future_fc[df_future_fc["sku_id"] == sku_id].sort_values("week_start")
        if len(sku_fc) == 0:
            # Fallback to zero if no forecast exists
            forecast_values = [0.0] * 8
        else:
            forecast_values = sku_fc["value"].tolist()
            
        # ----------------------------------------------------
        # 2. Lead Time Demand Calculation
        # ----------------------------------------------------
        # Lead time in weeks
        lt_weeks = lead_time_days / 7.0
        lt_weeks_int = int(np.floor(lt_weeks))
        lt_weeks_frac = lt_weeks - lt_weeks_int
        
        # Sum forecasts over lead time weeks
        lead_time_demand = 0.0
        for w in range(min(len(forecast_values), lt_weeks_int)):
            lead_time_demand += forecast_values[w]
            
        # Add fractional week forecast
        if lt_weeks_int < len(forecast_values) and lt_weeks_frac > 0:
            lead_time_demand += lt_weeks_frac * forecast_values[lt_weeks_int]
            
        # Projected Stock at end of lead time
        projected_stock = on_hand + on_order - lead_time_demand
        
        # ----------------------------------------------------
        # 3. Stockout Risk Score (0.0 to 1.0)
        # ----------------------------------------------------
        if projected_stock < 0:
            # Will stockout during lead time
            stockout_risk = 1.0
        elif projected_stock < reorder_point:
            # Below safety stock reorder point
            if reorder_point > 0:
                stockout_risk = 0.5 + 0.5 * (reorder_point - projected_stock) / reorder_point
            else:
                stockout_risk = 0.5
        else:
            # Safe, risk decays linearly to 0.0
            if reorder_point > 0:
                safety_margin = projected_stock - reorder_point
                stockout_risk = max(0.0, 0.5 - 0.5 * (safety_margin / reorder_point))
            else:
                stockout_risk = 0.0
                
        # ----------------------------------------------------
        # 4. Overstock Risk Score (0.0 to 1.0)
        # ----------------------------------------------------
        # Total forecasted demand over the 8-week horizon
        forward_demand = sum(forecast_values)
        forward_demand = max(1.0, forward_demand) # avoid divide by zero
        
        # Overstock ratio
        overstock_ratio = on_hand / forward_demand
        
        if overstock_ratio > 3.0:
            # Holding more than 3x the 8-week forecasted demand
            overstock_risk = 1.0
        elif overstock_ratio > 1.5:
            # Holding between 1.5x and 3.0x the demand
            overstock_risk = 0.5 + 0.5 * (overstock_ratio - 1.5) / 1.5
        else:
            # Safe, risk grows linearly to 0.5
            overstock_risk = (overstock_ratio / 1.5) * 0.5
            
        stockout_risk = float(np.clip(stockout_risk, 0.0, 1.0))
        overstock_risk = float(np.clip(overstock_risk, 0.0, 1.0))
        
        # ----------------------------------------------------
        # 5. Decisioning Grid & Action Mapping
        # ----------------------------------------------------
        if stockout_risk >= 0.5 and overstock_risk < 0.5:
            quadrant = "REORDER NOW"
            action = "Raise a replenishment order immediately."
            
            # Revenue at stake: demand we can't meet (deficit below reorder point)
            deficit = max(0.0, reorder_point - projected_stock)
            rupee_impact = round(deficit * list_price, 2)
            impact_type = "revenue_at_risk"
            
        elif overstock_risk >= 0.5 and stockout_risk < 0.5:
            quadrant = "MARKDOWN / CLEAR"
            action = "Promote or discount to free up locked capital."
            
            # Locked capital: cost of holding stock exceeding the forward demand
            surplus = max(0.0, on_hand - forward_demand)
            rupee_impact = round(surplus * unit_cost, 2)
            impact_type = "locked_capital"
            
        elif stockout_risk >= 0.5 and overstock_risk >= 0.5:
            quadrant = "WATCH / VOLATILE"
            action = "Demand is erratic; review stock and orders manually."
            
            # High risk of both: report combined impact
            deficit = max(0.0, reorder_point - projected_stock)
            surplus = max(0.0, on_hand - forward_demand)
            rev_risk = deficit * list_price
            lock_cap = surplus * unit_cost
            
            # Use the larger of the two as primary impact, but compute sum for tracking
            rupee_impact = round(rev_risk + lock_cap, 2)
            impact_type = "volatile_combined"
            
        else:
            quadrant = "HEALTHY"
            action = "No action needed; inventory levels are optimal."
            rupee_impact = 0.0
            impact_type = "none"
            
        risk_records.append({
            "sku_id": sku_id,
            "category": category,
            "subcategory": subcategory,
            "on_hand_units": on_hand,
            "on_order_units": on_order,
            "lead_time_days": lead_time_days,
            "reorder_point": reorder_point,
            "lead_time_demand": round(lead_time_demand, 2),
            "projected_stock": round(projected_stock, 2),
            "forward_demand": round(forward_demand, 2),
            "stockout_risk": stockout_risk,
            "overstock_risk": overstock_risk,
            "quadrant": quadrant,
            "recommended_action": action,
            "rupee_impact": rupee_impact,
            "impact_type": impact_type,
            "list_price": list_price,
            "unit_cost": unit_cost
        })
        
    df_risks = pd.DataFrame(risk_records)
    
    # Save the risks scoring
    risk_output_path = os.path.join(processed_dir, "sku_risks.csv")
    df_risks.to_csv(risk_output_path, index=False)
    
    print(f"Risk scoring layer complete. Saved risk assessments to {risk_output_path}")
    print(f"Summary by Quadrant:")
    print(df_risks["quadrant"].value_counts().to_string())

if __name__ == "__main__":
    calculate_inventory_risks()
