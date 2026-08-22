# Financial Fraud Detection Model & Streamlit Dashboard
## Project Technical Report & Documentation

**Author / Developer:** Data Science & Analytics Project Team  
**Project Title:** Financial Fraud Detection System & Real-Time Analytics Dashboard  
**Technologies Used:** Python 3.14, Streamlit, Scikit-Learn, XGBoost, Pandas, Plotly, NumPy, Joblib  

---

## 1. Executive Summary

Financial fraud represents a critical threat to banks, merchants, and digital payment ecosystems worldwide. As transaction volumes expand across channels (Credit Cards, UPI, NetBanking, PayPal), manual detection systems become ineffective.

This project delivers an end-to-end Machine Learning & Analytics solution for **Financial Fraud Detection**. It encompasses:
1. **Automated Feature Engineering:** Computes risk ratios (`Spend_to_Avg_Ratio`), time-of-day flags (`Is_Night_Txn`), international flags, and suspicious keyword indicators.
2. **Model Training & Benchmarking:** Compares **Logistic Regression**, **Random Forest**, and **XGBoost** classifiers.
3. **Interactive Dashboard:** Deploys a full-featured Streamlit web application for real-time risk scoring, behavioral insights, and batch transaction CSV scanning.

---

## 2. System Architecture

```
                               ┌────────────────────────────────────────┐
                               │  Financial Transaction Dataset (CSV)   │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │     Data Preprocessing Engine          │
                               │  - Missing Value Imputation            │
                               │  - Feature Engineering & Ratios        │
                               │  - Categorical One-Hot Encoding        │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │     Model Training & Benchmarking      │
                               │  - Logistic Regression (Selected)      │
                               │  - Random Forest Classifier            │
                               │  - XGBoost Gradient Boosting           │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │  Saved Artifacts (model_artifacts/)    │
                               │  - fraud_model.pkl                     │
                               │  - scaler.pkl                          │
                               │  - feature_info.pkl                    │
                               │  - model_metrics.json                  │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │    Streamlit Web Dashboard (app.py)    │
                               │  ├── 📊 Executive KPI Dashboard        │
                               │  ├── ⚡ Real-Time Fraud Predictor       │
                               │  ├── 📈 Behavioral Anomaly Insights    │
                               │  ├── 🤖 Model Benchmarks               │
                               │  └── 📁 Batch CSV Scanner & Exporter   │
                               └────────────────────────────────────────┘
```

---

## 3. Dataset & Feature Engineering

### 3.1 Dataset Overview
Dataset: `financial_fraud_detection_dataset.csv` (5,000 transaction records, 14 features):

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `Transaction_ID` | String | Unique transaction reference code |
| `Customer_ID` | String | Unique customer identification code |
| `Transaction_Date` | Datetime | Timestamp of transaction (`DD-MM-YYYY HH:MM`) |
| `Transaction_Amount` | Float | Amount spent in USD ($) |
| `Merchant_Category` | Categorical | Grocery, Travel, Electronics, Health, Utilities, Food, Fashion |
| `Payment_Method` | Categorical | Credit Card, Debit Card, PayPal, NetBanking, UPI |
| `Device_Type` | Categorical | Mobile, Desktop, POS terminal |
| `Location` | Categorical | City location (Bengaluru, Mumbai, Delhi, Kolkata, Pune, Chennai, Hyderabad) |
| `Is_International` | Binary (0/1) | Flag for cross-border transaction |
| `Previous_Transactions`| Integer | Total prior transactions made by customer |
| `Average_Spend` | Float | Customer's historical average transaction value ($) |
| `Account_Age_Days` | Integer | Total age of customer account in days |
| `Suspicious_Keyword` | Binary (Yes/No)| Communication/notes risk keyword flag |
| `Fraudulent` | Target (0/1) | Ground truth label (0 = Legitimate, 1 = Fraudulent) |

### 3.2 Feature Engineering
1. **`Spend_to_Avg_Ratio`**: $\frac{\text{Transaction\_Amount}}{\text{Average\_Spend} + 1.0}$ — Detects sudden spike spending relative to user baseline.
2. **`Spend_Minus_Avg`**: $\text{Transaction\_Amount} - \text{Average\_Spend}$ — Absolute dollar anomaly.
3. **`Is_Night_Txn`**: Flag set to `1` if transaction timestamp is between 23:00 and 05:00 hrs.
4. **`Suspicious_Keyword_Num`**: Numerical mapping (`Yes` $\to 1$, `No` $\to 0$).

---

## 4. Model Training & Evaluation Benchmarks

### 4.1 Performance Metrics Comparison
Models were evaluated on a 20% test split:

| Model Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression (Selected)** | **75.40%** | **28.07%** | **100.00%** | **0.4384** | **0.8933** |
| **Random Forest Classifier** | 77.20% | 26.26% | 76.04% | 0.3904 | 0.8580 |
| **XGBoost Classifier** | 83.30% | 28.22% | 47.92% | 0.3552 | 0.8665 |

### 4.2 Model Selection Rationale
In financial fraud prevention, **Recall is the top priority** because missing a fraudulent transaction (False Negative) results in direct financial loss, whereas false flags (False Positives) can be verified by automated alerts. **Logistic Regression achieved 100% Recall and an ROC-AUC of 0.8933**.

---

## 5. Web Application Features (`app.py`)

1. **📊 Executive Dashboard:** Real-time KPI metric cards (Total Volume, Fraud Rate %, Loss Flagged) and interactive breakdown charts.
2. **⚡ Real-Time Fraud Predictor:** Form interface for single transaction input $\to$ Instant Fraud Risk Score (%) + Risk Badge (🔴 High Risk, 🟡 Moderate, 🟢 Safe) + Risk Trigger Breakdown.
3. **📈 Analytics & Insights:** Spending scatter plots, Device Type risk analysis, and Suspicious Keyword correlation.
4. **🤖 Model Performance:** Side-by-side metric comparison and Top 10 Influential Features graph.
5. **📁 Batch CSV Scanner:** Drag-and-drop batch transaction scanning with smart auto-column detection and downloadable CSV output.

---

## 6. How to Run the Project

* **Run Dashboard:**
  ```bash
  streamlit run app.py
  ```
  Access live UI at: **`http://localhost:8501`**

* **Re-train Model:**
  ```bash
  python train_model.py
  ```
