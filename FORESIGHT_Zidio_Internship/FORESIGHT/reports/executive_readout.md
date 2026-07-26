# EXECUTIVE READOUT: Project FORESIGHT
**Demand & Inventory Intelligence Platform**

**Prepared for**: Head of Operations & Finance Lead, NorthBay Living  
**Prepared by**: Lead Data Scientist, Zidio Project Team  
**Status**: Handover Ready (Milestone M4)

---

## 1. High-Level Financial Summary (The Rupee Impact)

Our analytics pipeline reveals that NorthBay Living is losing significant margin due to inventory planning inefficiencies. By running Project FORESIGHT, we have quantified the business impact at stake over the next 8 weeks:

*   **Total Revenue at Stake (Stockout Risk)**: **₹8,24,350.00**  
    *   *What it is*: Expected lost sales from 65 best-selling SKUs that are projected to run out of stock during their replenishment lead time.
*   **Total Capital Locked (Overstock Risk)**: **₹3,15,400.00**  
    *   *What it is*: Working capital tied up in 31 slow-moving SKUs where current warehouse inventory exceeds 8 weeks of forecasted demand.
*   **Net Opportunity**: Mitigating these risks can recover up to **₹11.39 Lakhs** in cash flow and lost revenue.

---

## 2. Strategic Operational Recommendations

We recommend immediate implementation of the following policies:

### A. Replenishment Action ("Reorder Now")
*   **Trigger**: 65 SKUs are in the red zone. Their projected stock level (on-hand + on-order - lead time demand) is below their safety reorder point.
*   **Action**: Place replenishment orders immediately for the suggested quantities shown in the **Operations Triage** list on the dashboard. Prioritize the top 5 SKUs (e.g. SKU002, SKU015) which account for 30% of the revenue at stake.

### B. Inventory Clearance ("Markdown / Clear")
*   **Trigger**: 31 SKUs have over 3x the stock required for the next 8 weeks.
*   **Action**: Implement a targeted **20% to 30% markdown promotion** during the upcoming "Summer Clearance" event to sell off this inventory. This will free up **₹3.15 Lakhs** in cash and relieve warehouse space.

### C. Manual Triage ("Watch")
*   **Trigger**: SKUs with high variability in demand.
*   **Action**: Merchandisers should review these weekly. Do not place large automated orders for these; review supplier lead times first.

---

## 3. Forecast Accuracy and Model Selection

At NorthBay Living, forecasting demand is highly cyclical. We evaluated two models using time-series backtesting (evaluating past predictions against actual sales):

1.  **Seasonal-Naive Baseline**: **24.05% WAPE** (Weighted Absolute Percentage Error)
2.  **Machine Learning Model (Random Forest)**: **27.77% WAPE**

### Why did the Baseline win?
*   **High Seasonality Consistency**: NorthBay's customer demand patterns are extremely consistent year-over-year. A simple model predicting "sales will match last year's sales for the same week" is highly accurate (WAPE of 24%).
*   **Model Noise**: The Random Forest model fits the overall patterns well but introduces minor overfitting noise, leading to a slightly higher error rate (27%).
*   **Consultant Decision**: In compliance with our scientific rigor standards, we do not hide performance. We have shipped the **Seasonal-Naive baseline** as the primary forecasting engine in the dashboard, but we display the ML model forecast alongside it to give planners two alternative views.

---

## 4. Platform Delivery & Next Steps

We have delivered three ready-to-use software products:
1.  **Streamlit Planning Dashboard**: Accessible locally via `streamlit run app/app.py`. Planners can view the prioritized reorder lists, deep-dive into SKU level forecasts, and run "What-if" simulation slide-bars.
2.  **FastAPI Scoring API**: Publicly accessible REST endpoints (`/predict/sku/{sku_id}` and `/predict/batch`) for integration with future ERP systems.
3.  **Reproducible Data Pipeline**: A clean execution script (`src/pipeline.py`) that ingests and cleans raw spreadsheet exports in one command.

### Handover Checklist
*   [x] Verify data folder contains `raw/` and `processed/` folders.
*   [x] Open dashboard and test the "What-if Simulator" to align lead-times.
*   [x] Review API documentation at `http://localhost:8000/docs`.
