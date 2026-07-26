from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import pandas as pd
import numpy as np
import pickle

app = FastAPI(
    title="Project FORESIGHT - Demand & Inventory Intelligence API",
    description="REST API service returning SKU-level demand forecasts and inventory risk classifications for NorthBay Living.",
    version="1.0"
)

# ----------------------------------------------------
# Data Loading and Paths
# ----------------------------------------------------
PROCESSED_DIR = "data/processed"
risks_path = os.path.join(PROCESSED_DIR, "sku_risks.csv")
forecasts_path = os.path.join(PROCESSED_DIR, "forecasts.csv")
metrics_path = os.path.join(PROCESSED_DIR, "backtest_metrics.pkl")

# Shared cache
db_risks = None
db_forecasts = None
db_metrics = None

def load_databases():
    global db_risks, db_forecasts, db_metrics
    if not (os.path.exists(risks_path) and os.path.exists(forecasts_path)):
        # Data not generated yet
        return False
    db_risks = pd.read_csv(risks_path)
    db_forecasts = pd.read_csv(forecasts_path)
    db_forecasts["week_start"] = pd.to_datetime(db_forecasts["week_start"])
    
    if os.path.exists(metrics_path):
        with open(metrics_path, "rb") as f:
            db_metrics = pickle.load(f)
    return True

# Initialize databases on startup
load_databases()

# ----------------------------------------------------
# Pydantic Schemas for validation
# ----------------------------------------------------
class WeeklyForecastItem(BaseModel):
    week_start: str = Field(..., description="Starting date of the weekly forecast horizon (Monday)")
    forecast_units: float = Field(..., description="Projected units sold for the week")
    baseline_units: float = Field(..., description="Seasonal-naive baseline units sold for the week")
    ci_lower: float = Field(..., description="80% confidence interval lower bound")
    ci_upper: float = Field(..., description="80% confidence interval upper bound")
    step: int = Field(..., description="Horizon step (1 to 8 weeks out)")

class SKUResponse(BaseModel):
    sku_id: str = Field(..., description="Product SKU identifier")
    category: str = Field(..., description="Category classification")
    subcategory: str = Field(..., description="Subcategory classification")
    on_hand_units: int = Field(..., description="Units physically in stock")
    on_order_units: int = Field(..., description="Units on replenishment order")
    lead_time_days: int = Field(..., description="Replenishment lead time in days")
    reorder_point: int = Field(..., description="Safety reorder point")
    lead_time_demand: float = Field(..., description="Projected demand during lead time")
    projected_stock: float = Field(..., description="Projected stock level at end of lead time")
    forward_demand: float = Field(..., description="Total forecasted demand over the 8-week horizon")
    stockout_risk: float = Field(..., description="Calculated stockout risk score (0.0 to 1.0)")
    overstock_risk: float = Field(..., description="Calculated overstock risk score (0.0 to 1.0)")
    quadrant: str = Field(..., description="Inventory risk quadrant (HEALTHY, REORDER NOW, MARKDOWN / CLEAR, WATCH / VOLATILE)")
    recommended_action: str = Field(..., description="Actionable recommendation for logistics")
    rupee_impact: float = Field(..., description="Rupee value at stake")
    impact_type: str = Field(..., description="Type of rupee impact (revenue_at_risk, locked_capital, volatile_combined, none)")
    unit_cost: float = Field(..., description="Cost price per unit")
    list_price: float = Field(..., description="Selling price per unit")
    forecast_horizon: List[WeeklyForecastItem] = Field(..., description="Step-by-step weekly predictions")


class BatchRequest(BaseModel):
    sku_ids: Optional[List[str]] = Field(default=None, description="List of SKU IDs to predict. If null or empty, returns all SKUs.")

# ----------------------------------------------------
# API Endpoints
# ----------------------------------------------------

@app.get("/api/status")
def get_service_status():
    """Returns the API health and performance metrics."""
    loaded = load_databases()
    status = "healthy" if loaded else "missing_data"
    
    accuracy = {}
    if loaded and db_metrics:
        accuracy = {
            "ml_wape": db_metrics.get("ml_wape"),
            "baseline_wape": db_metrics.get("baseline_wape"),
            "wape_improvement_pct": db_metrics.get("improvement_pct")
        }
        
    return {
        "status": status,
        "service_name": "Project FORESIGHT Demand & Inventory Intelligence Service",
        "client": "NorthBay Living",
        "accuracy_metrics": accuracy,
        "api_docs_url": "/docs"
    }

@app.get("/predict/sku/{sku_id}", response_model=SKUResponse)
def predict_single_sku(sku_id: str):
    """Returns forecast and inventory risk scores for a single product SKU."""
    loaded = load_databases()
    if not loaded:
        raise HTTPException(status_code=503, detail="Database files missing from data/processed/. Run pipeline and forecast first.")
        
    # Match SKU in risks table
    sku_risk_match = db_risks[db_risks["sku_id"] == sku_id.upper()]
    if len(sku_risk_match) == 0:
        raise HTTPException(status_code=404, detail=f"Product SKU ID '{sku_id}' not found.")
        
    meta = sku_risk_match.iloc[0]
    
    # Get future forecasts for this SKU (type == forecast)
    df_sku_fc = db_forecasts[(db_forecasts["sku_id"] == sku_id.upper()) & (db_forecasts["type"] == "forecast")].sort_values("week_start")
    
    forecast_items = []
    for _, row in df_sku_fc.iterrows():
        forecast_items.append(WeeklyForecastItem(
            week_start=pd.to_datetime(row["week_start"]).strftime("%Y-%m-%d"),
            forecast_units=float(row["value"]),
            baseline_units=float(row["baseline"]),
            ci_lower=float(row["ci_lower"]),
            ci_upper=float(row["ci_upper"]),
            step=int(row["step"])
        ))
        
    return SKUResponse(
        sku_id=str(meta["sku_id"]),
        category=str(meta["category"]),
        subcategory=str(meta["subcategory"]),
        on_hand_units=int(meta["on_hand_units"]),
        on_order_units=int(meta["on_order_units"]),
        lead_time_days=int(meta["lead_time_days"]),
        reorder_point=int(meta["reorder_point"]),
        lead_time_demand=float(meta["lead_time_demand"]),
        projected_stock=float(meta["projected_stock"]),
        forward_demand=float(meta["forward_demand"]),
        stockout_risk=float(meta["stockout_risk"]),
        overstock_risk=float(meta["overstock_risk"]),
        quadrant=str(meta["quadrant"]),
        recommended_action=str(meta["recommended_action"]),
        rupee_impact=float(meta["rupee_impact"]),
        impact_type=str(meta["impact_type"]),
        unit_cost=float(meta["unit_cost"]),
        list_price=float(meta["list_price"]),
        forecast_horizon=forecast_items
    )

@app.post("/predict/batch", response_model=List[SKUResponse])
def predict_batch_skus(request: BatchRequest):
    """Returns forecasts and inventory risks for a batch list of SKU IDs. If empty, returns all."""
    loaded = load_databases()
    if not loaded:
        raise HTTPException(status_code=503, detail="Database files missing from data/processed/. Run pipeline and forecast first.")
        
    target_skus = request.sku_ids
    if not target_skus:
        target_skus = db_risks["sku_id"].tolist()
    else:
        target_skus = [s.upper() for s in target_skus]

    sku_set = set(target_skus)
    filtered_forecasts = db_forecasts[db_forecasts["sku_id"].isin(sku_set) & (db_forecasts["type"] == "forecast")]
    
    # Pre-index/group forecasts to avoid O(N * M) query lookups
    forecasts_by_sku = {}
    for _, row in filtered_forecasts.iterrows():
        sku = row["sku_id"]
        if sku not in forecasts_by_sku:
            forecasts_by_sku[sku] = []
        forecasts_by_sku[sku].append(WeeklyForecastItem(
            week_start=pd.to_datetime(row["week_start"]).strftime("%Y-%m-%d"),
            forecast_units=float(row["value"]),
            baseline_units=float(row["baseline"]),
            ci_lower=float(row["ci_lower"]),
            ci_upper=float(row["ci_upper"]),
            step=int(row["step"])
        ))
        
    # Sort forecast items by week_start (step)
    for sku in forecasts_by_sku:
        forecasts_by_sku[sku].sort(key=lambda item: item.step)

    filtered_meta = db_risks[db_risks["sku_id"].isin(sku_set)]
    
    results = []
    for _, row in filtered_meta.iterrows():
        sku_id = row["sku_id"]
        forecast_items = forecasts_by_sku.get(sku_id, [])
        
        results.append(SKUResponse(
            sku_id=sku_id,
            category=str(row["category"]),
            subcategory=str(row["subcategory"]),
            on_hand_units=int(row["on_hand_units"]),
            on_order_units=int(row["on_order_units"]),
            lead_time_days=int(row["lead_time_days"]),
            reorder_point=int(row["reorder_point"]),
            lead_time_demand=float(row["lead_time_demand"]),
            projected_stock=float(row["projected_stock"]),
            forward_demand=float(row["forward_demand"]),
            stockout_risk=float(row["stockout_risk"]),
            overstock_risk=float(row["overstock_risk"]),
            quadrant=str(row["quadrant"]),
            recommended_action=str(row["recommended_action"]),
            rupee_impact=float(row["rupee_impact"]),
            impact_type=str(row["impact_type"]),
            unit_cost=float(row["unit_cost"]),
            list_price=float(row["list_price"]),
            forecast_horizon=forecast_items
        ))
        
    return results

import os
from fastapi.responses import FileResponse

@app.get("/api/download/deck")
def download_deck():
    pdf_path = "Zidio_Project_Data_1.1.pdf"
    if not os.path.exists(pdf_path):
        pdf_path = "Instructions.pdf"
    return FileResponse(path=pdf_path, filename="FORESIGHT_Executive_Deck.pdf", media_type="application/pdf")

import shutil
import subprocess

@app.post("/api/upload/{dataset_type}")
def upload_dataset(dataset_type: str, file: UploadFile = File(...)):
    """Uploads raw CSV dataset and runs ingestion pipeline."""
    type_map = {
        "sales_daily": "data/raw/sales_daily.csv",
        "sku_master": "data/raw/sku_master.csv",
        "calendar": "data/raw/calendar.csv",
        "inventory_snapshots": "data/raw/inventory_snapshots.csv"
    }
    
    if dataset_type not in type_map:
        raise HTTPException(status_code=400, detail=f"Invalid dataset type. Must be one of: {list(type_map.keys())}")
        
    os.makedirs("data/raw", exist_ok=True)
    
    file_path = type_map[dataset_type]
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
    try:
        # Execute pipeline scripts sequentially
        subprocess.run([".\\venv\\Scripts\\python.exe", "src/pipeline.py"], check=True)
        subprocess.run([".\\venv\\Scripts\\python.exe", "src/forecast.py"], check=True)
        subprocess.run([".\\venv\\Scripts\\python.exe", "src/risk.py"], check=True)
        
        # Reload memory database cache
        load_databases()
        
        return {"status": "success", "message": f"Successfully uploaded {dataset_type} and re-executed model pipelines."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute pipelines: {str(e)}")

from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="service/static", html=True), name="static")

