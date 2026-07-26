import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(data_dir="data/raw", seed=42):
    np.random.seed(seed)
    os.makedirs(data_dir, exist_ok=True)
    
    print("Generating Project FORESIGHT synthetic data (optimized vectorized version)...")
    
    # ----------------------------------------------------
    # 1. SKU Master
    # ----------------------------------------------------
    categories = {
        "Home Decor": ["Wall Art", "Vases", "Candles", "Mirrors"],
        "Kitchenware": ["Cookware", "Tableware", "Small Appliances", "Storage"],
        "Bed & Bath": ["Sheets", "Towels", "Pillows", "Duvets"],
        "Furnishings": ["Rugs", "Curtains", "Cushions", "Throws"]
    }
    
    num_skus = 200
    sku_ids = [f"SKU{i:03d}" for i in range(1, num_skus + 1)]
    
    sku_data = []
    category_names = list(categories.keys())
    sku_params = {}
    
    for i, sku_id in enumerate(sku_ids):
        cat = np.random.choice(category_names)
        subcat = np.random.choice(categories[cat])
        
        # Introduce casing typos (e.g. 5% of entries) to test the pipeline
        cat_for_csv = cat
        if np.random.rand() < 0.05:
            cat_for_csv = cat.lower() if np.random.rand() < 0.5 else cat.replace(" ", "_")
            
        base_price = np.random.uniform(299, 4999)
        list_price = round(base_price, -1) - 1
        unit_cost = round(list_price * np.random.uniform(0.35, 0.55), 2)
        
        launch_days_ago = np.random.randint(100, 1000)
        launch_date = (datetime(2026, 6, 21) - timedelta(days=launch_days_ago)).strftime("%Y-%m-%d")
        
        sku_data.append({
            "sku_id": sku_id,
            "category": cat_for_csv,
            "subcategory": subcat,
            "launch_date": launch_date,
            "unit_cost": unit_cost,
            "list_price": list_price
        })
        
        sku_params[sku_id] = {
            "base_sales": np.random.lognormal(mean=0.8, sigma=0.6),
            "seasonal_phase": np.random.uniform(0, 2 * np.pi),
            "promo_elasticity": np.random.uniform(1.5, 2.5),
            "list_price": list_price,
            "unit_cost": unit_cost,
            "launch_date": pd.to_datetime(launch_date)
        }
        
    df_sku = pd.DataFrame(sku_data)
    
    # ----------------------------------------------------
    # 2. Calendar
    # ----------------------------------------------------
    start_date = datetime(2024, 6, 1)
    end_date = datetime(2026, 8, 31)
    dates = pd.date_range(start_date, end_date)
    
    holidays = {
        (1, 1): "New Year",
        (1, 26): "Republic Day",
        (8, 15): "Independence Day",
        (10, 2): "Gandhi Jayanti",
        (10, 24): "Diwali",
        (11, 10): "Festival Sale",
        (12, 25): "Christmas"
    }
    
    promo_events = {
        (1, 24, 1, 28): "Republic Day Sale",
        (5, 1, 5, 5): "Summer clearance",
        (8, 12, 8, 16): "Independence Day Sale",
        (10, 20, 10, 26): "Diwali Carnival",
        (12, 22, 12, 27): "Year End Bash"
    }
    
    def get_promo_event(dt):
        for (sm, sd, em, ed), name in promo_events.items():
            if sm == em and dt.month == sm and sd <= dt.day <= ed:
                return name
        return None

    def get_season(dt):
        m = dt.month
        if m in [12, 1, 2]: return "Winter"
        elif m in [3, 4, 5]: return "Spring"
        elif m in [6, 7, 8]: return "Summer"
        else: return "Autumn"

    calendar_data = []
    for dt in dates:
        m, d = dt.month, dt.day
        is_hol = 1 if (m, d) in holidays else 0
        p_event = get_promo_event(dt)
        week = dt.isocalendar()[1]
        
        calendar_data.append({
            "date": dt.strftime("%Y-%m-%d"),
            "week": int(week),
            "month": int(m),
            "season": get_season(dt),
            "is_holiday": is_hol,
            "promo_event": p_event
        })
        
    df_calendar = pd.DataFrame(calendar_data)
    
    # ----------------------------------------------------
    # 3. Sales Daily (Vectorized)
    # ----------------------------------------------------
    history_end_date = datetime(2026, 6, 21)
    history_dates = pd.date_range(start_date, history_end_date)
    
    print("Expanding dates and SKUs (Cartesian product)...")
    dates_expanded = np.repeat(history_dates, num_skus)
    sku_ids_expanded = np.tile(sku_ids, len(history_dates))
    
    df_sales = pd.DataFrame({
        "date": dates_expanded,
        "sku_id": sku_ids_expanded
    })
    
    # Filter rows by launch date
    launch_dates_map = {sku: params["launch_date"] for sku, params in sku_params.items()}
    df_sales["launch_date"] = df_sales["sku_id"].map(launch_dates_map)
    df_sales = df_sales[df_sales["date"] >= df_sales["launch_date"]]
    df_sales.drop(columns=["launch_date"], inplace=True)
    
    # Format date as string to merge calendar fields
    df_sales["date_str"] = df_sales["date"].dt.strftime("%Y-%m-%d")
    
    # Calendar features mapping
    calendar_dict = df_calendar.set_index("date").to_dict(orient="index")
    df_sales["is_holiday"] = df_sales["date_str"].map(lambda x: calendar_dict.get(x, {}).get("is_holiday", 0))
    df_sales["promo_event"] = df_sales["date_str"].map(lambda x: calendar_dict.get(x, {}).get("promo_event", None))
    df_sales["promo_flag"] = df_sales["promo_event"].notnull().astype(int)
    
    df_sales["day_of_week"] = df_sales["date"].dt.weekday
    df_sales["is_weekend"] = df_sales["day_of_week"].isin([5, 6]).astype(int)
    df_sales["day_of_year"] = df_sales["date"].dt.dayofyear
    
    # Map SKU parameters
    base_sales = df_sales["sku_id"].map({k: v["base_sales"] for k, v in sku_params.items()})
    seasonal_phase = df_sales["sku_id"].map({k: v["seasonal_phase"] for k, v in sku_params.items()})
    promo_elasticity = df_sales["sku_id"].map({k: v["promo_elasticity"] for k, v in sku_params.items()})
    list_price = df_sales["sku_id"].map({k: v["list_price"] for k, v in sku_params.items()})
    
    # Calculate Poisson rate
    weekend_mult = np.where(df_sales["is_weekend"] == 1, 1.3, 1.0)
    holiday_mult = np.where(df_sales["is_holiday"] == 1, 1.5, 1.0)
    season_mult = 1.0 + 0.3 * np.sin(2 * np.pi * df_sales["day_of_year"] / 365.25 + seasonal_phase)
    promo_mult = np.where(df_sales["promo_flag"] == 1, promo_elasticity, 1.0)
    
    rates = base_sales * weekend_mult * holiday_mult * season_mult * promo_mult
    rates = np.clip(rates, 0.01, None)
    
    # Generate units sold
    df_sales["units_sold"] = np.random.poisson(rates)
    
    # Generate price (with promo discounts)
    discount = np.random.uniform(0.8, 0.9, size=len(df_sales))
    df_sales["unit_price"] = np.where(df_sales["promo_flag"] == 1, np.round(list_price * discount, 2), list_price)
    df_sales["revenue"] = np.round(df_sales["units_sold"] * df_sales["unit_price"], 2)
    
    # Clean up working columns and rename date_str to date
    df_sales.drop(columns=["date", "day_of_week", "is_weekend", "day_of_year", "is_holiday", "promo_event"], inplace=True)
    df_sales.rename(columns={"date_str": "date"}, inplace=True)
    
    # INJECT ANOMALIES
    print("Injecting duplicate rows and missing data values for testing...")
    # 1. Null prices (~0.5% of rows)
    mask_price = np.random.rand(len(df_sales)) < 0.005
    df_sales.loc[mask_price, "unit_price"] = np.nan
    
    # 2. Null sales/revenues (~0.5% of rows)
    mask_sold = np.random.rand(len(df_sales)) < 0.005
    df_sales.loc[mask_sold, "units_sold"] = np.nan
    df_sales.loc[mask_sold, "revenue"] = np.nan
    
    # 3. Duplicate rows (~0.3% of rows)
    num_dupes = int(len(df_sales) * 0.003)
    dupe_idx = np.random.choice(df_sales.index, size=num_dupes, replace=False)
    df_dupes = df_sales.loc[dupe_idx].copy()
    df_sales = pd.concat([df_sales, df_dupes], ignore_index=True)
    
    # ----------------------------------------------------
    # 4. Inventory Snapshots
    # ----------------------------------------------------
    print("Generating inventory snapshots...")
    snapshot_date = "2026-06-21"
    
    # Calculate last 30 days average daily sales per SKU to set stock levels
    df_sales_clean = df_sales.dropna()
    last_30_sales = df_sales_clean[
        (df_sales_clean["date"] >= "2026-05-22") & 
        (df_sales_clean["date"] <= "2026-06-21")
    ]
    avg_daily_sales = last_30_sales.groupby("sku_id")["units_sold"].mean().to_dict()
    
    inventory_rows = []
    for sku_id in sku_ids:
        daily_sales = avg_daily_sales.get(sku_id, 2.0)
        daily_sales = max(0.5, daily_sales)
        
        lead_time = int(np.random.choice([7, 14, 21, 28]))
        reorder_point = int(np.ceil(daily_sales * (lead_time + 5)))
        
        rand_cat = np.random.rand()
        on_order = 0
        
        if rand_cat < 0.60:
            # Healthy
            on_hand = int(reorder_point * np.random.uniform(1.5, 3.0))
        elif rand_cat < 0.75:
            # Stockout Risk
            on_hand = int(reorder_point * np.random.uniform(0.1, 0.8))
        elif rand_cat < 0.90:
            # Reordering
            on_hand = int(reorder_point * np.random.uniform(0.1, 0.8))
            on_order = int(daily_sales * lead_time * np.random.uniform(1.2, 1.8))
        else:
            # Overstocked
            on_hand = int(reorder_point * np.random.uniform(4.0, 8.0))
            
        inventory_rows.append({
            "date": snapshot_date,
            "sku_id": sku_id,
            "on_hand_units": on_hand,
            "on_order_units": on_order,
            "lead_time_days": lead_time,
            "reorder_point": reorder_point
        })
        
    df_inventory = pd.DataFrame(inventory_rows)
    
    # Save CSVs
    df_sku.to_csv(os.path.join(data_dir, "sku_master.csv"), index=False)
    df_calendar.to_csv(os.path.join(data_dir, "calendar.csv"), index=False)
    df_sales.to_csv(os.path.join(data_dir, "sales_daily.csv"), index=False)
    df_inventory.to_csv(os.path.join(data_dir, "inventory_snapshots.csv"), index=False)
    
    print(f"Synthetic data generation complete. Saved in {data_dir}/")
    print(f"SKUs: {len(df_sku)}")
    print(f"Calendar Days: {len(df_calendar)}")
    print(f"Sales Records: {len(df_sales)}")
    print(f"Inventory Snapshots: {len(df_inventory)}")

if __name__ == "__main__":
    generate_synthetic_data()
