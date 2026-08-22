import os
import json
import joblib
import pandas as pd
import numpy as np
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

# ---------------------------------------------------------
# Page Configuration & Modern Styling
# ---------------------------------------------------------
st.set_page_config(
    page_title="Financial Fraud Detection System",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for rich aesthetics
st.markdown("""
<style>
    /* Global Styling */
    .main {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    .stApp {
        background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
    }
    
    /* Header Banner */
    .main-header {
        background: linear-gradient(90deg, #1f2937 0%, #111827 100%);
        border: 1px solid #374151;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .main-title {
        color: #60A5FA;
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0;
    }
    .sub-title {
        color: #9CA3AF;
        font-size: 1.05rem;
        margin-top: 6px;
    }

    /* Metric Cards */
    .metric-card {
        background: rgba(31, 41, 55, 0.7);
        border: 1px solid #374151;
        border-radius: 10px;
        padding: 18px;
        text-align: center;
        backdrop-filter: blur(8px);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .metric-card:hover {
        transform: translateY(-3px);
        border-color: #60A5FA;
    }
    .metric-val {
        font-size: 2.2rem;
        font-weight: 800;
        color: #F9FAFB;
    }
    .metric-lbl {
        color: #9CA3AF;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Status Badges */
    .status-badge-high {
        background-color: rgba(239, 68, 68, 0.2);
        color: #F87171;
        border: 1px solid #EF4444;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.2rem;
        text-align: center;
    }
    .status-badge-medium {
        background-color: rgba(245, 158, 11, 0.2);
        color: #FBBF24;
        border: 1px solid #F59E0B;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.2rem;
        text-align: center;
    }
    .status-badge-low {
        background-color: rgba(16, 185, 129, 0.2);
        color: #34D399;
        border: 1px solid #10B981;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.2rem;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Helper Functions & Model Loader
# ---------------------------------------------------------
@st.cache_data
def load_dataset():
    path = os.path.join("Related_files", "financial_fraud_detection_dataset.csv")
    if os.path.exists(path):
        df = pd.read_csv(path)
        df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'], format='%d-%m-%Y %H:%M', errors='coerce')
        df['Hour'] = df['Transaction_Date'].dt.hour
        return df
    return None

@st.cache_resource
def load_artifacts():
    artifacts_dir = "model_artifacts"
    model_path = os.path.join(artifacts_dir, "fraud_model.pkl")
    scaler_path = os.path.join(artifacts_dir, "scaler.pkl")
    info_path = os.path.join(artifacts_dir, "feature_info.pkl")
    metrics_path = os.path.join(artifacts_dir, "model_metrics.json")
    
    if os.path.exists(model_path) and os.path.exists(info_path):
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        feature_info = joblib.load(info_path)
        metrics = {}
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                metrics = json.load(f)
        return model, scaler, feature_info, metrics
    return None, None, None, None

def auto_map_batch_columns(df):
    col_map = {c: c.strip().lower().replace(' ', '_') for c in df.columns}
    inv_map = {v: k for k, v in col_map.items()}
    
    alias_dict = {
        'Transaction_Amount': ['transaction_amount', 'amount', 'amt', 'txn_amount', 'price', 'val', 'value'],
        'Average_Spend': ['average_spend', 'avg_spend', 'account_balance', 'balance', 'mean_spend'],
        'Previous_Transactions': ['previous_transactions', 'prev_txns', 'daily_transaction_count', 'txn_count', 'previous_fraudulent_activity'],
        'Account_Age_Days': ['account_age_days', 'account_age', 'card_age', 'user_age', 'age'],
        'Is_International': ['is_international', 'international', 'foreign', 'is_foreign'],
        'Suspicious_Keyword': ['suspicious_keyword', 'suspicious_flag', 'is_suspicious', 'keyword'],
        'Merchant_Category': ['merchant_category', 'category', 'merchant', 'store_type'],
        'Payment_Method': ['payment_method', 'method', 'card_type', 'transaction_type', 'payment_type'],
        'Device_Type': ['device_type', 'device', 'channel'],
        'Location': ['location', 'city', 'country', 'state'],
        'Transaction_Date': ['transaction_date', 'date', 'datetime', 'time', 'timestamp'],
        'Transaction_ID': ['transaction_id', 'txn_id', 'id', 'trans_id'],
        'Customer_ID': ['customer_id', 'user_id', 'client_id', 'account_id']
    }
    
    res_cols = {}
    for target_col, aliases in alias_dict.items():
        found = None
        for alias in aliases:
            if alias in inv_map:
                found = inv_map[alias]
                break
        res_cols[target_col] = found
        
    return res_cols

df_raw = load_dataset()
model, scaler, feature_info, metrics = load_artifacts()

# ---------------------------------------------------------
# Sidebar & Navigation
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/isometric-folders/100/security-checked.png", width=70)
    st.title("Financial Risk Hub")
    st.caption("AI-Powered Fraud Intelligence Platform")
    st.markdown("---")
    
    menu = st.radio(
        "Navigation Menu",
        ["📊 Executive Dashboard", "⚡ Real-Time Fraud Predictor", "📈 Analytics & Insights", "🤖 Model Performance", "📁 Batch CSV Scanner"],
        index=0
    )
    
    st.markdown("---")
    st.info("💡 **Model Active:** " + (feature_info['best_model_name'] if feature_info else "Trained Classifier"))
    st.caption("Developed for Zidio Financial Fraud Detection Project")

# ---------------------------------------------------------
# Header Section
# ---------------------------------------------------------
st.markdown("""
<div class="main-header">
    <div class="main-title">🛡️ Financial Fraud Detection & Analytics System</div>
    <div class="sub-title">Real-Time Risk Scoring, Anomaly Detection & Machine Learning Insights</div>
</div>
""", unsafe_allow_html=True)

if df_raw is None:
    st.error("Dataset not found in `Related_files/financial_fraud_detection_dataset.csv`. Please verify workspace files.")
    st.stop()

# ---------------------------------------------------------
# 1. Executive Dashboard
# ---------------------------------------------------------
if menu == "📊 Executive Dashboard":
    st.subheader("📌 High-Level Performance Metrics")
    
    total_txns = len(df_raw)
    total_fraud = int(df_raw['Fraudulent'].sum())
    fraud_rate = (total_fraud / total_txns) * 100
    avg_txn_val = df_raw['Transaction_Amount'].mean()
    fraud_amt = df_raw[df_raw['Fraudulent'] == 1]['Transaction_Amount'].sum()
    
    c1, c2, c3, c4, c5 = st.columns(5)
    with c1:
        st.markdown(f'<div class="metric-card"><div class="metric-val">{total_txns:,}</div><div class="metric-lbl">Total Volume</div></div>', unsafe_allow_html=True)
    with c2:
        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#EF4444">{total_fraud:,}</div><div class="metric-lbl">Fraud Cases</div></div>', unsafe_allow_html=True)
    with c3:
        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#F59E0B">{fraud_rate:.2f}%</div><div class="metric-lbl">Fraud Rate</div></div>', unsafe_allow_html=True)
    with c4:
        st.markdown(f'<div class="metric-card"><div class="metric-val">${avg_txn_val:.2f}</div><div class="metric-lbl">Avg Spend</div></div>', unsafe_allow_html=True)
    with c5:
        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#10B981">${fraud_amt:,.2f}</div><div class="metric-lbl">Fraud Flagged ($)</div></div>', unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    row1_col1, row1_col2 = st.columns(2)
    
    with row1_col1:
        st.markdown("##### 💳 Fraud Occurrence by Payment Method")
        pm_df = df_raw.groupby(['Payment_Method', 'Fraudulent']).size().reset_index(name='Count')
        pm_df['Fraud Status'] = pm_df['Fraudulent'].map({0: 'Legitimate', 1: 'Fraudulent'})
        fig_pm = px.bar(
            pm_df, x='Payment_Method', y='Count', color='Fraud Status',
            barmode='group', color_discrete_map={'Legitimate': '#3B82F6', 'Fraudulent': '#EF4444'},
            template='plotly_dark'
        )
        fig_pm.update_layout(margin=dict(l=20, r=20, t=30, b=20), height=320)
        st.plotly_chart(fig_pm, use_container_width=True)
        
    with row1_col2:
        st.markdown("##### 🏬 Fraud Volume by Merchant Category")
        mc_df = df_raw[df_raw['Fraudulent'] == 1].groupby('Merchant_Category').size().reset_index(name='Fraud_Count')
        fig_mc = px.pie(
            mc_df, names='Merchant_Category', values='Fraud_Count', hole=0.4,
            color_discrete_sequence=px.colors.qualitative.Pastel,
            template='plotly_dark'
        )
        fig_mc.update_layout(margin=dict(l=20, r=20, t=30, b=20), height=320)
        st.plotly_chart(fig_mc, use_container_width=True)

    row2_col1, row2_col2 = st.columns(2)
    with row2_col1:
        st.markdown("##### 📍 Fraud Distribution across Top Locations")
        loc_df = df_raw.groupby('Location')['Fraudulent'].agg(['count', 'sum']).reset_index()
        loc_df['Fraud_Rate'] = (loc_df['sum'] / loc_df['count']) * 100
        fig_loc = px.bar(
            loc_df, x='Location', y='Fraud_Rate', color='Fraud_Rate',
            color_continuous_scale='Reds', labels={'Fraud_Rate': 'Fraud Rate (%)'},
            template='plotly_dark'
        )
        fig_loc.update_layout(margin=dict(l=20, r=20, t=30, b=20), height=320)
        st.plotly_chart(fig_loc, use_container_width=True)

    with row2_col2:
        st.markdown("##### ⏰ Time of Day Risk Analysis")
        hour_df = df_raw.groupby('Hour')['Fraudulent'].mean().reset_index()
        hour_df['Fraud_Rate'] = hour_df['Fraudulent'] * 100
        fig_hour = px.line(
            hour_df, x='Hour', y='Fraud_Rate', markers=True,
            line_shape='spline', color_discrete_sequence=['#F59E0B'],
            template='plotly_dark'
        )
        fig_hour.update_layout(xaxis_title="Hour of Day (0-23)", yaxis_title="Fraud Rate (%)", margin=dict(l=20, r=20, t=30, b=20), height=320)
        st.plotly_chart(fig_hour, use_container_width=True)

# ---------------------------------------------------------
# 2. Real-Time Fraud Predictor
# ---------------------------------------------------------
elif menu == "⚡ Real-Time Fraud Predictor":
    st.subheader("⚡ Real-Time Transaction Risk Engine")
    st.markdown("Simulate a transaction or enter live details to evaluate fraud probability in real time.")
    
    if model is None or feature_info is None:
        st.warning("Model artifacts not loaded. Run model training script first.")
        st.stop()
        
    cat_opts = feature_info['cat_options']
    feature_names = feature_info['feature_names']
    
    with st.form("prediction_form"):
        col1, col2, col3 = st.columns(3)
        
        with col1:
            amount = st.number_input("Transaction Amount ($)", min_value=0.1, max_value=50000.0, value=250.0, step=10.0)
            avg_spend = st.number_input("Customer Average Spend ($)", min_value=1.0, max_value=10000.0, value=200.0, step=10.0)
            prev_txns = st.number_input("Previous Transactions Count", min_value=0, max_value=500, value=45)
            account_age = st.number_input("Account Age (Days)", min_value=1, max_value=5000, value=450)
            
        with col2:
            merchant = st.selectbox("Merchant Category", cat_opts['Merchant_Category'])
            payment = st.selectbox("Payment Method", cat_opts['Payment_Method'])
            device = st.selectbox("Device Type", cat_opts['Device_Type'])
            location = st.selectbox("Location / City", cat_opts['Location'])
            
        with col3:
            is_intl = st.radio("Is International Transaction?", ["No", "Yes"], index=0)
            suspicious_kw = st.radio("Suspicious Keyword Flagged?", ["No", "Yes"], index=0)
            txn_hour = st.slider("Transaction Hour", 0, 23, 14)
            
        submit_btn = st.form_submit_button("🔍 Evaluate Fraud Risk", use_container_width=True)
        
    if submit_btn:
        input_data = {col: 0 for col in feature_names}
        input_data['Transaction_Amount'] = amount
        input_data['Previous_Transactions'] = prev_txns
        input_data['Average_Spend'] = avg_spend
        input_data['Account_Age_Days'] = account_age
        input_data['Spend_to_Avg_Ratio'] = amount / (avg_spend + 1.0)
        input_data['Spend_Minus_Avg'] = amount - avg_spend
        input_data['Is_International'] = 1 if is_intl == "Yes" else 0
        input_data['Suspicious_Keyword_Num'] = 1 if suspicious_kw == "Yes" else 0
        input_data['Hour'] = txn_hour
        input_data['DayOfWeek'] = 2
        input_data['Is_Night_Txn'] = 1 if (txn_hour >= 23 or txn_hour <= 5) else 0
        
        for cat_col, val in [('Merchant_Category', merchant), ('Payment_Method', payment), ('Device_Type', device), ('Location', location)]:
            col_name = f"{cat_col}_{val}"
            if col_name in input_data:
                input_data[col_name] = 1
                
        input_df = pd.DataFrame([input_data])
        
        if feature_info['best_model_name'] == 'Logistic Regression':
            input_scaled = scaler.transform(input_df)
            fraud_prob = model.predict_proba(input_scaled)[0][1]
        else:
            fraud_prob = model.predict_proba(input_df)[0][1]
            
        risk_pct = fraud_prob * 100
        
        st.markdown("---")
        res_col1, res_col2 = st.columns([1, 2])
        
        with res_col1:
            st.markdown("#### Transaction Verdict")
            if risk_pct >= 65.0:
                st.markdown(f'<div class="status-badge-high">🚨 HIGH FRAUD RISK<br><span style="font-size:2rem">{risk_pct:.1f}%</span></div>', unsafe_allow_html=True)
            elif risk_pct >= 35.0:
                st.markdown(f'<div class="status-badge-medium">⚠️ MODERATE RISK<br><span style="font-size:2rem">{risk_pct:.1f}%</span></div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="status-badge-low">✅ SAFE TRANSACTION<br><span style="font-size:2rem">{risk_pct:.1f}%</span></div>', unsafe_allow_html=True)

        with res_col2:
            st.markdown("#### Key Risk Triggers & Insights")
            triggers = []
            if amount > (avg_spend * 2.5):
                triggers.append(f"• **Unusual High Spending:** Transaction amount (${amount}) is over 2.5x average spend (${avg_spend}).")
            if suspicious_kw == "Yes":
                triggers.append("• **Suspicious Keyword Detected:** Communication logs contains high-risk flag.")
            if is_intl == "Yes":
                triggers.append("• **Cross-Border Activity:** International transaction originating outside home city.")
            if (txn_hour >= 23 or txn_hour <= 5):
                triggers.append(f"• **Night-time Activity:** Processed at {txn_hour}:00 hrs.")
            if account_age < 90:
                triggers.append(f"• **New Account Profile:** Account age is only {account_age} days.")
                
            if not triggers:
                triggers.append("• No anomalous risk factors identified. Transaction aligns with normal user profile.")
                
            for t in triggers:
                st.markdown(t)

# ---------------------------------------------------------
# 3. Analytics & Insights
# ---------------------------------------------------------
elif menu == "📈 Analytics & Insights":
    st.subheader("📈 Deep-Dive Behavioral & Anomaly Analytics")
    
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("##### Spending Amount vs Average Spend Scatter Plot")
        fig_scatter = px.scatter(
            df_raw, x='Average_Spend', y='Transaction_Amount',
            color=df_raw['Fraudulent'].map({0: 'Legitimate', 1: 'Fraudulent'}),
            color_discrete_map={'Legitimate': '#3B82F6', 'Fraudulent': '#EF4444'},
            hover_data=['Merchant_Category', 'Payment_Method'],
            template='plotly_dark'
        )
        fig_scatter.update_layout(height=380)
        st.plotly_chart(fig_scatter, use_container_width=True)

    with col2:
        st.markdown("##### Fraud Risk by Device Type")
        dev_df = df_raw.groupby('Device_Type')['Fraudulent'].agg(['count', 'sum']).reset_index()
        dev_df['Fraud_Rate'] = (dev_df['sum'] / dev_df['count']) * 100
        fig_dev = px.bar(
            dev_df, x='Device_Type', y='Fraud_Rate', color='Device_Type',
            color_discrete_sequence=px.colors.qualitative.Bold,
            template='plotly_dark'
        )
        fig_dev.update_layout(height=380)
        st.plotly_chart(fig_dev, use_container_width=True)
        
    st.markdown("##### Suspicious Keyword Correlation with Fraud")
    kw_df = df_raw.groupby('Suspicious_Keyword')['Fraudulent'].agg(['count', 'sum']).reset_index()
    kw_df['Fraud_Rate'] = (kw_df['sum'] / kw_df['count']) * 100
    fig_kw = px.bar(
        kw_df, x='Suspicious_Keyword', y='Fraud_Rate', color='Suspicious_Keyword',
        labels={'Suspicious_Keyword': 'Suspicious Keyword Flag'},
        color_discrete_map={'No': '#3B82F6', 'Yes': '#EF4444'},
        template='plotly_dark'
    )
    fig_kw.update_layout(height=320)
    st.plotly_chart(fig_kw, use_container_width=True)

# ---------------------------------------------------------
# 4. Model Performance & Benchmarking
# ---------------------------------------------------------
elif menu == "🤖 Model Performance":
    st.subheader("🤖 Machine Learning Model Benchmarks & Feature Importance")
    
    if not metrics:
        st.info("Metrics not found in `model_artifacts/model_metrics.json`.")
        st.stop()
        
    metrics_df = pd.DataFrame(metrics).T.reset_index().rename(columns={'index': 'Model'})
    
    col1, col2 = st.columns([1.2, 1])
    with col1:
        st.markdown("##### Model Comparison Metrics")
        st.dataframe(metrics_df[['Model', 'Accuracy', 'Precision', 'Recall', 'F1_Score', 'ROC_AUC']].style.highlight_max(axis=0, color='#1e3a8a'), use_container_width=True)
        
        fig_comp = px.bar(
            metrics_df, x='Model', y=['Precision', 'Recall', 'F1_Score', 'ROC_AUC'],
            barmode='group', template='plotly_dark'
        )
        fig_comp.update_layout(height=350)
        st.plotly_chart(fig_comp, use_container_width=True)
        
    with col2:
        st.markdown("##### Top 10 Influential Features")
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        elif hasattr(model, 'coef_'):
            importances = np.abs(model.coef_[0])
        else:
            importances = np.zeros(len(feature_info['feature_names']))
            
        fi = pd.DataFrame({
            'Feature': feature_info['feature_names'],
            'Importance': importances
        }).sort_values(by='Importance', ascending=False).head(10)
        
        fig_fi = px.bar(
            fi, x='Importance', y='Feature', orientation='h',
            color='Importance', color_continuous_scale='Blues',
            template='plotly_dark'
        )
        fig_fi.update_layout(yaxis=dict(autorange='reversed'), height=420)
        st.plotly_chart(fig_fi, use_container_width=True)

# ---------------------------------------------------------
# 5. Batch CSV Fraud Scanner
# ---------------------------------------------------------
elif menu == "📁 Batch CSV Scanner":
    st.subheader("📁 Batch CSV Fraud Scanner & Exporter")
    st.markdown("Upload any CSV dataset of financial transactions to run instant automated fraud risk evaluation.")
    
    uploaded_file = st.file_uploader("Upload Transaction File (CSV)", type=['csv'])
    
    if uploaded_file is not None:
        try:
            batch_df = pd.read_csv(uploaded_file)
            st.success(f"File uploaded successfully! Loaded {len(batch_df):,} rows.")
            
            auto_mapped = auto_map_batch_columns(batch_df)
            
            with st.expander("🛠️ Column Mapping Settings (Auto-Detected)", expanded=False):
                st.info("The scanner automatically matched your CSV headers to fraud model inputs. Adjust if needed:")
                cols = list(batch_df.columns)
                mapped_inputs = {}
                m_c1, m_c2 = st.columns(2)
                for i, (k, v) in enumerate(auto_mapped.items()):
                    default_idx = (cols.index(v) + 1) if (v and v in cols) else 0
                    target_container = m_c1 if i % 2 == 0 else m_c2
                    mapped_inputs[k] = target_container.selectbox(
                        f"{k}:",
                        options=["-- Auto/Default --"] + cols,
                        index=default_idx
                    )
            
            if st.button("🚀 Run Batch Prediction Scanner", use_container_width=True):
                with st.spinner("Processing & scoring transactions..."):
                    input_df_batch = pd.DataFrame(index=batch_df.index)
                    
                    amt_col = mapped_inputs['Transaction_Amount']
                    if amt_col != "-- Auto/Default --" and amt_col in batch_df.columns:
                        input_df_batch['Transaction_Amount'] = pd.to_numeric(batch_df[amt_col], errors='coerce').fillna(50.0)
                    else:
                        num_cols = batch_df.select_dtypes(include=[np.number]).columns
                        if len(num_cols) > 0:
                            input_df_batch['Transaction_Amount'] = batch_df[num_cols[0]].fillna(50.0)
                        else:
                            input_df_batch['Transaction_Amount'] = 50.0

                    avg_col = mapped_inputs['Average_Spend']
                    if avg_col != "-- Auto/Default --" and avg_col in batch_df.columns:
                        input_df_batch['Average_Spend'] = pd.to_numeric(batch_df[avg_col], errors='coerce').fillna(100.0)
                    else:
                        input_df_batch['Average_Spend'] = input_df_batch['Transaction_Amount']

                    prev_col = mapped_inputs['Previous_Transactions']
                    if prev_col != "-- Auto/Default --" and prev_col in batch_df.columns:
                        input_df_batch['Previous_Transactions'] = pd.to_numeric(batch_df[prev_col], errors='coerce').fillna(20)
                    else:
                        input_df_batch['Previous_Transactions'] = 20

                    age_col = mapped_inputs['Account_Age_Days']
                    if age_col != "-- Auto/Default --" and age_col in batch_df.columns:
                        input_df_batch['Account_Age_Days'] = pd.to_numeric(batch_df[age_col], errors='coerce').fillna(365)
                    else:
                        input_df_batch['Account_Age_Days'] = 365

                    intl_col = mapped_inputs['Is_International']
                    if intl_col != "-- Auto/Default --" and intl_col in batch_df.columns:
                        input_df_batch['Is_International'] = pd.to_numeric(batch_df[intl_col], errors='coerce').fillna(0).astype(int)
                    else:
                        input_df_batch['Is_International'] = 0

                    kw_col = mapped_inputs['Suspicious_Keyword']
                    if kw_col != "-- Auto/Default --" and kw_col in batch_df.columns:
                        input_df_batch['Suspicious_Keyword_Num'] = batch_df[kw_col].apply(lambda x: 1 if str(x).strip().lower() in ['yes', '1', 'true'] else 0)
                    else:
                        input_df_batch['Suspicious_Keyword_Num'] = 0

                    date_col = mapped_inputs['Transaction_Date']
                    if date_col != "-- Auto/Default --" and date_col in batch_df.columns:
                        dt_series = pd.to_datetime(batch_df[date_col], errors='coerce')
                        input_df_batch['Hour'] = dt_series.dt.hour.fillna(14).astype(int)
                        input_df_batch['DayOfWeek'] = dt_series.dt.dayofweek.fillna(2).astype(int)
                    else:
                        input_df_batch['Hour'] = 14
                        input_df_batch['DayOfWeek'] = 2

                    input_df_batch['Is_Night_Txn'] = input_df_batch['Hour'].apply(lambda h: 1 if (h >= 23 or h <= 5) else 0)
                    input_df_batch['Spend_to_Avg_Ratio'] = input_df_batch['Transaction_Amount'] / (input_df_batch['Average_Spend'] + 1.0)
                    input_df_batch['Spend_Minus_Avg'] = input_df_batch['Transaction_Amount'] - input_df_batch['Average_Spend']

                    cat_cols = ['Merchant_Category', 'Payment_Method', 'Device_Type', 'Location']
                    for cat in cat_cols:
                        c_col = mapped_inputs[cat]
                        if c_col != "-- Auto/Default --" and c_col in batch_df.columns:
                            input_df_batch[cat] = batch_df[c_col].astype(str)
                        else:
                            input_df_batch[cat] = feature_info['cat_options'][cat][0]

                    batch_encoded = pd.get_dummies(input_df_batch, columns=cat_cols)

                    for fn in feature_info['feature_names']:
                        if fn not in batch_encoded.columns:
                            batch_encoded[fn] = 0

                    final_batch_X = batch_encoded[feature_info['feature_names']]

                    if feature_info['best_model_name'] == 'Logistic Regression':
                        X_scaled = scaler.transform(final_batch_X)
                        probs = model.predict_proba(X_scaled)[:, 1]
                    else:
                        probs = model.predict_proba(final_batch_X)[:, 1]

                    output_df = batch_df.copy()
                    output_df['Predicted_Fraud_Prob_%'] = (probs * 100).round(2)
                    output_df['Fraud_Risk_Flag'] = output_df['Predicted_Fraud_Prob_%'].apply(
                        lambda p: '🔴 RED (HIGH RISK)' if p >= 65.0 else ('🟡 YELLOW (MODERATE)' if p >= 35.0 else '🟢 GREEN (LOW RISK)')
                    )

                    st.markdown("#### 📊 Batch Risk Evaluation Results")
                    
                    b_c1, b_c2, b_c3 = st.columns(3)
                    high_risk_cnt = int((output_df['Predicted_Fraud_Prob_%'] >= 65.0).sum())
                    mod_risk_cnt = int(((output_df['Predicted_Fraud_Prob_%'] >= 35.0) & (output_df['Predicted_Fraud_Prob_%'] < 65.0)).sum())
                    low_risk_cnt = len(output_df) - high_risk_cnt - mod_risk_cnt
                    
                    with b_c1:
                        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#EF4444">{high_risk_cnt:,}</div><div class="metric-lbl">High Risk Flagged</div></div>', unsafe_allow_html=True)
                    with b_c2:
                        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#F59E0B">{mod_risk_cnt:,}</div><div class="metric-lbl">Moderate Risk</div></div>', unsafe_allow_html=True)
                    with b_c3:
                        st.markdown(f'<div class="metric-card"><div class="metric-val" style="color:#10B981">{low_risk_cnt:,}</div><div class="metric-lbl">Low Risk / Safe</div></div>', unsafe_allow_html=True)
                        
                    st.markdown("<br>", unsafe_allow_html=True)
                    
                    st.dataframe(output_df, use_container_width=True)

                    csv_data = output_df.to_csv(index=False).encode('utf-8')
                    st.download_button(
                        label="📥 Download Labeled Fraud Risk CSV",
                        data=csv_data,
                        file_name="batch_fraud_risk_analysis.csv",
                        mime="text/csv",
                        use_container_width=True
                    )
        except Exception as e:
            st.error(f"Error processing CSV file: {e}")
