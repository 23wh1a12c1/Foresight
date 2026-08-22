# Financial Fraud Detection System
## Complete Technical Documentation & User Manual

**Project Name:** Financial Fraud Detection System & Streamlit Analytics Dashboard  
**Client / Internship:** Zidio Development - Data Science & Analytics Project  
**Author / Developer:** Data Science Team  
**Version:** 1.0.0  
**Date:** August 2026  

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Codebase Architecture & Directory Structure](#2-codebase-architecture--directory-structure)
3. [Data Dictionary & Feature Engineering](#3-data-dictionary--feature-engineering)
4. [Machine Learning Pipeline Details (`train_model.py`)](#4-machine-learning-pipeline-details-train_modelpy)
5. [Web Application Architecture (`app.py`)](#5-web-application-architecture-apppy)
6. [User Guide & Operating Instructions](#6-user-guide--operating-instructions)
7. [API & Function References](#7-api--function-references)

---

## 1. Project Overview

The **Financial Fraud Detection System** is an artificial intelligence and data analytics platform engineered to identify unauthorized or fraudulent transactions across modern financial payment networks (Credit Cards, PayPal, UPI, NetBanking, Debit Cards).

### Key Objectives:
* **Automated Fraud Scoring:** Classifies incoming financial transactions as Low, Moderate, or High Fraud Risk.
* **Zero-Miss Fraud Detection:** Configured to maximize **Recall (100%)** so that zero fraudulent activities slip past the detection firewall.
* **Interactive Visual Analytics:** Equips risk managers and fraud analysts with real-time KPI metrics, time-of-day risk heatmaps, device risk distributions, and geographic hotspots.
* **Flexible Batch Processing:** Accepts custom transaction dataset CSV files of any schema via smart column alias mapping.

---

## 2. Codebase Architecture & Directory Structure

```text
c:\Users\K.Meghana\Downloads\Projects\Fraud_Detection_Zidio\
│
├── train_model.py                        # ML Training & Feature Engineering Script
├── app.py                                # Streamlit Web Dashboard Application
├── Financial_Fraud_Detection_Project_Report.html # Printable HTML Project Report
├── Financial_Fraud_Detection_Project_Report.md   # Markdown Project Summary Report
├── PROJECT_DOCUMENTATION.md              # Full Technical Documentation & Manual
├── PROJECT_DOCUMENTATION.html            # Printable Full Documentation Webpage
│
├── model_artifacts/                      # Trained Model Files & Saved Weights
│   ├── fraud_model.pkl                   # Trained Logistic Regression Model
│   ├── scaler.pkl                        # StandardScaler Object
│   ├── feature_info.pkl                  # Feature names, dropdown options & metadata
│   └── model_metrics.json                # Saved benchmark metrics (RF, XGBoost, LR)
│
└── Related_files/                        # Dataset & Reference Notebooks
    ├── financial_fraud_detection_dataset.csv # Primary training dataset (5,000 rows)
    ├── synthetic_fraud_dataset1.csv          # Secondary test dataset (50,000 rows)
    ├── EDA.ipynb                             # Exploratory Data Analysis Notebook
    ├── Data_Analytics (1).ipynb              # Analytics Notebook
    ├── Data_Visualization_Info.ipynb         # Data Visualization Notebook
    ├── Outlier Detection & EDA.txt           # Lecture notes on outlier detection
    └── Data Augmentation.txt                 # Lecture notes on data augmentation
```

---

## 3. Data Dictionary & Feature Engineering

### 3.1 Raw Dataset Schema (`financial_fraud_detection_dataset.csv`)

| Column Name | Data Type | Description | Sample Value |
| :--- | :--- | :--- | :--- |
| `Transaction_ID` | String | Unique transaction identifier | `T100000` |
| `Customer_ID` | String | Unique customer identifier | `CUST3252` |
| `Transaction_Date` | String/Datetime | Timestamp of transaction | `04-10-2023 07:45` |
| `Transaction_Amount` | Float | Value of transaction in USD ($) | `37.54` |
| `Merchant_Category` | Categorical | Business type | `Travel`, `Grocery`, `Electronics` |
| `Payment_Method` | Categorical | Payment mechanism | `Credit Card`, `UPI`, `PayPal` |
| `Device_Type` | Categorical | Terminal used | `Mobile`, `POS`, `Desktop` |
| `Location` | Categorical | Origin city | `Mumbai`, `Bengaluru`, `Delhi` |
| `Is_International` | Integer (0/1) | Cross-border transaction indicator | `0` (Domestic), `1` (Intl) |
| `Previous_Transactions`| Integer | Historical transaction count | `94` |
| `Average_Spend` | Float | Historical average spend amount | `417.40` |
| `Account_Age_Days` | Integer | Account age in days | `1492` |
| `Suspicious_Keyword` | String (Yes/No)| Communication risk flag | `No` / `Yes` |
| `Fraudulent` | Integer (0/1) | Target Label | `0` (Normal), `1` (Fraud) |

### 3.2 Engineered Features (`train_model.py`)

1. **`Spend_to_Avg_Ratio`**:
   $$\text{Ratio} = \frac{\text{Transaction\_Amount}}{\text{Average\_Spend} + 1.0}$$
   *Captures sudden surges in spending relative to the user's personal baseline.*

2. **`Spend_Minus_Avg`**:
   $$\text{Difference} = \text{Transaction\_Amount} - \text{Average\_Spend}$$
   *Measures absolute dollar deviation from normal habits.*

3. **`Is_Night_Txn`**:
   $$\text{Is\_Night\_Txn} = \begin{cases} 1 & \text{if Hour} \in [23, 0, 1, 2, 3, 4, 5] \\ 0 & \text{otherwise} \end{cases}$$
   *Identifies late-night transactions which show statistically higher fraud correlation.*

4. **`Suspicious_Keyword_Num`**:
   *Maps string `'Yes'` to `1` and `'No'` to `0`.*

5. **Categorical One-Hot Encoding**:
   *Converts `Merchant_Category`, `Payment_Method`, `Device_Type`, and `Location` into binary indicator columns.*

---

## 4. Machine Learning Pipeline Details (`train_model.py`)

### 4.1 Data Split & Scaler
* **Train / Test Split:** 80% Train (4,000 samples), 20% Test (1,000 samples) stratified by target class (`Fraudulent`).
* **Scaler:** `StandardScaler()` applied to numerical features.

### 4.2 Model Training & Benchmark Results

| Model Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (Selected)** | **75.40%** | **28.07%** | **100.00%** | **0.4384** | **0.8933** |
| **Random Forest** | 77.20% | 26.26% | 76.04% | 0.3904 | 0.8580 |
| **XGBoost** | 83.30% | 28.22% | 47.92% | 0.3552 | 0.8665 |

### 4.3 Why Logistic Regression was Selected:
In financial risk management, **missing a fraud case (False Negative)** costs thousands of dollars, whereas a false alarm (False Positive) is easily verified. **Logistic Regression achieved 100% Recall** (zero missed fraud cases) and the highest **ROC-AUC of 0.8933**.

---

## 5. Web Application Architecture (`app.py`)

The Streamlit web application consists of 5 interactive modules:

1. **📊 Executive Dashboard (`menu == "📊 Executive Dashboard"`)**:
   * Shows 5 KPI cards (Total Volume, Fraud Cases, Fraud Rate %, Avg Spend, Fraud Flagged $).
   * Interactive Plotly charts: Payment Method breakdown, Merchant Category pie chart, Geographic location bar chart, and Hour-of-Day risk line chart.

2. **⚡ Real-Time Fraud Predictor (`menu == "⚡ Real-Time Fraud Predictor"`)**:
   * Interactive form to enter transaction parameters.
   * Calculates real-time risk score % and displays risk badges:
     * 🔴 **HIGH FRAUD RISK** ($\ge 65\%$)
     * 🟡 **MODERATE RISK** ($35\% - 65\%$)
     * 🟢 **SAFE TRANSACTION** ($< 35\%$)
   * Generates natural language risk explanations (e.g. 2.5x higher spending than average, night-time transaction).

3. **📈 Analytics & Insights (`menu == "📈 Analytics & Insights"`)**:
   * Scatter plot comparing Transaction Amount vs Average Spend color-coded by Fraud status.
   * Fraud rate by Device Type and Suspicious Keyword correlation.

4. **🤖 Model Performance (`menu == "🤖 Model Performance"`)**:
   * Comparative metric table and bar chart across all 3 algorithms.
   * Top 10 influential features horizontal bar graph.

5. **📁 Batch CSV Scanner (`menu == "📁 Batch CSV Scanner"`)**:
   * Drag-and-drop CSV uploader for batch fraud processing.
   * **Smart Auto-Column Mapping (`auto_map_batch_columns`)**: Auto-detects header aliases (`Amount`, `Card_Age`, `User_ID`, `Date`).
   * One-click download button for labeled CSV output.

---

## 6. User Guide & Operating Instructions

### 6.1 Launching the Dashboard:
```powershell
cd c:\Users\K.Meghana\Downloads\Projects\Fraud_Detection_Zidio
streamlit run app.py
```
Open your browser to: **`http://localhost:8501`**

### 6.2 Re-training the ML Model:
```powershell
python train_model.py
```

---

## 7. API & Function References

### `train_model.py`:
* `load_data()`: Reads `financial_fraud_detection_dataset.csv`.
* `preprocess_and_engineer(df)`: Converts dates, builds feature ratios, performs one-hot encoding.
* `train_and_evaluate()`: Trains Random Forest, XGBoost, and Logistic Regression, computes metrics, and exports `model_artifacts/`.

### `app.py`:
* `load_dataset()`: Cached function loading raw CSV for analytics.
* `load_artifacts()`: Cached function loading trained model, scaler, and metadata.
* `auto_map_batch_columns(df)`: Maps uploaded CSV columns to required model input features.
