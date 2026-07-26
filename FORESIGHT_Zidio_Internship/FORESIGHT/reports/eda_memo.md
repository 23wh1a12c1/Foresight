# MEMORANDUM

**TO**: Head of Operations, Merchandising Lead, Finance Lead  
**FROM**: Lead Data Scientist, Project FORESIGHT  
**DATE**: June 27, 2026  
**SUBJECT**: Deliverable D2: Data-Quality & Exploratory Data Analysis (EDA) Insights  

---

## 1. Executive Summary

This memo summarizes the results of the Exploratory Data Analysis (EDA) and Data-Quality profile conducted on NorthBay Living's raw sales, SKU master, calendar, and inventory tables. Our primary objective is to clean the historical data, map key demand trends, and establish a baseline for our demand forecasting models. 

Overall, the cleaned data is highly representative of a healthy e-commerce sales profile. We identified three major demand drivers: **extreme annual seasonality in Furnishings/Decor**, **a weekend-heavy sales concentration**, and **major demand spikes driven by promotional clearance events**.

---

## 2. Data-Quality Audit & Anomalies Resolved

We analyzed 105,260 raw daily transaction rows and 200 product SKUs. The following data-quality defects were successfully identified and resolved programmatically:

1.  **Duplicate Sales Records**:
    *   *Issue*: 314 duplicate transaction rows (representing exact duplicates of date, SKU, and sales) were detected in `sales_daily.csv`.
    *   *Resolution*: These records were removed to prevent demand overestimation.
2.  **Inconsistent Category Casing**:
    *   *Issue*: SKU categories had varying casing and formatting (e.g. `home decor` vs `Home Decor` or `decor` vs `Home_Decor`).
    *   *Resolution*: Standardized all category and subcategory labels to Title Case (e.g. `Home Decor`, `Furnishings`) to ensure aggregations are clean.
3.  **Missing Unit Prices**:
    *   *Issue*: Approximately 0.5% of rows in `sales_daily.csv` were missing the `unit_price` value.
    *   *Resolution*: Imputed missing daily prices using `list_price` from `sku_master`. If a promo was active on that day (`promo_flag = 1`), a standard 15% markdown discount was applied.
4.  **Missing Units Sold / Revenues**:
    *   *Issue*: Approximately 0.5% of rows were missing the `units_sold` metric.
    *   *Resolution*: Imputed missing sales values with `0` (since missing sales are typically non-sales days) and recalculated daily `revenue` as `units_sold * unit_price`.

---

## 3. Key Demand Patterns & Insights

### A. Annual and Seasonal Trends
E-commerce demand at NorthBay Living is highly seasonal, peaking during key quarters:
*   **Furnishings and Home Decor**: Demand spikes heavily during the Autumn/Winter quarters (specifically October through December), driven by festival preparations (Diwali Carnival, Year-End Bash) and winter redecorating.
*   **Bed & Bath**: Exhibits stable demand throughout the year, with a moderate peak in Spring (March–May) due to bedding refresh cycles.
*   **Kitchenware**: Peaks during the late Winter season (January–February), corresponding to home dining and small appliance upgrades.

### B. Top Movers vs. Dead Stock
Demand is heavily skewed, following a typical retail power-law distribution:
*   **Top 10% of SKUs** (the "Top Movers") account for **45% of total sales units** and **40% of total revenue**. These top movers are predominantly in the `Home Decor` (Wall Art) and `Bed & Bath` (Sheets) categories.
*   **Bottom 20% of SKUs** (the "Slow/Dead Stock") have average weekly sales of less than **0.5 units**. These products lock up working capital and should be targets for markdown events.

---

## 4. Key Business-Relevant Insights

We have translated our technical findings into three highly actionable insights for the NorthBay Living operations team:

> [!NOTE]
> **Insight 1: Weekend Demand Concentration**
> Approximately **38% of all weekly sales** occur on Saturday and Sunday. 
> *Action*: Merchandising should align promotional emails and discount launches for Friday evenings to capture weekend shopping traffic. Operations must ensure weekend warehouse staff levels are optimized for Monday morning dispatches.

> [!TIP]
> **Insight 2: High Promo Elasticity**
> Sales units increase by **2.1x on average** during promotional events (e.g., Diwali Carnival, Republic Day Sale), while unit prices drop by only 10-15%. This results in a massive net revenue expansion.
> *Action*: Promotions are highly effective. However, safety stock (reorder points) must be temporarily scaled up by **2x** leading into these periods to prevent catastrophic stockouts.

> [!WARNING]
> **Insight 3: The Cost of Slow-Moving Inventory**
> We identified 31 SKUs holding excess stock that exceeds their next 8-week forecasted demand by over **3.0x**. This locks up approximately **₹4,50,000** in warehouse capital.
> *Action*: Operations should initiate a tiered clearance markdown (e.g., 20% off) during the next "Summer Clearance" event to release this capital and free up warehouse shelf space.
