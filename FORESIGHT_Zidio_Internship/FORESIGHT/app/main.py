
import streamlit as st

# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(

    page_title="RetailPulse Analytics",

    page_icon="🛒",

    layout="wide",

    initial_sidebar_state="expanded"

)

# Inject custom premium layout styling
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    html, body, [class*="css"], .stMarkdown {
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #f8fafc !important;
    }
    
    .stApp {
        background-color: #080d15 !important;
    }
    
    [data-testid="stSidebar"] {
        background-color: #0c111d !important; 
        border-right: 1px solid #1f2937;
    }
    
    /* Hide radio button circles entirely */
    [data-testid="stSidebar"] [data-testid="stRadioButton"] label div[data-baseweb="radio"] > div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] label > div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] label span:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] label div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label > div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label span:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] div[data-baseweb="radio"] > div:first-child {
        display: none !important;
    }
    [data-testid="stSidebar"] div[data-baseweb="radio"] div:first-child {
        display: none !important;
    }
    
    /* Style radio labels as navigation links */
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label,
    [data-testid="stSidebar"] div[data-baseweb="radio"] {
        background-color: transparent !important;
        padding: 10px 14px !important;
        border-radius: 8px !important;
        margin-bottom: 6px !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        border-left: 3px solid transparent !important;
    }
    
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label:hover,
    [data-testid="stSidebar"] div[data-baseweb="radio"]:hover {
        background-color: rgba(255, 255, 255, 0.05) !important;
    }
    
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label[aria-checked="true"],
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label[data-checked="true"],
    [data-testid="stSidebar"] div[data-baseweb="radio"][aria-checked="true"] {
        background-color: rgba(6, 182, 212, 0.1) !important;
        border-left: 3px solid #06b6d4 !important;
    }
    
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label div:last-child,
    [data-testid="stSidebar"] div[data-baseweb="radio"] div:last-child {
        color: #94a3b8 !important;
        font-weight: 500 !important;
        font-size: 13.5px !important;
    }
    
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label[aria-checked="true"] div:last-child,
    [data-testid="stSidebar"] [data-testid="stRadioButton"] [role="radiogroup"] label[data-checked="true"] div:last-child,
    [data-testid="stSidebar"] div[data-baseweb="radio"][aria-checked="true"] div:last-child {
        color: #06b6d4 !important;
        font-weight: 600 !important;
    }
    </style>
    """, unsafe_allow_html=True)

st.sidebar.title(
    "🛒 RetailPulse"
)

st.sidebar.caption(
    "AI-Powered Retail Analytics Platform"
)

st.sidebar.markdown("---")

# ============================================================
# NAVIGATION
# ============================================================

page = st.sidebar.radio(

    "Navigate",

    [

        "🏠 Overview",

        "📈 Demand Forecasting",

        "👥 Customer Segments",

        "⚠️ Churn Risk",

        "📦 Inventory Optimizer",

        "🔬 Model Monitoring"

    ]

)

# ============================================================
# PAGE ROUTING
# ============================================================

if page.startswith("🏠"):

    st.title(
        "🚀 RetailPulse Dashboard"
    )

    st.subheader(
        "AI-Powered Retail Analytics Platform"
    )

    st.markdown("""
    ### Platform Features

    - 📈 Hybrid Demand Forecasting
    - 👥 Customer Segmentation
    - ⚠️ Churn Prediction
    - 📦 Inventory Optimization
    - 🔬 Drift Monitoring
    - 🤖 Automated Retraining
    - ☁️ Cloud Deployment
    """)

    st.divider()

    # ========================================================
    # KPI STRIP
    # ========================================================

    col1, col2, col3 = st.columns(3)

    col1.metric(
        "Hybrid Forecast MAPE",
        "4.61%"
    )

    col2.metric(
        "Churn Model AUC",
        "0.94"
    )

    col3.metric(
        "Projected Stockout Reduction",
        "32.7%"
    )

    st.divider()

    # ========================================================
    # PROJECT SUMMARY
    # ========================================================

    st.subheader(
        "📊 System Overview"
    )

    st.markdown("""

    RetailPulse is an end-to-end AI-powered retail analytics platform designed for:

    - Demand Forecasting
    - Customer Intelligence
    - Churn Prediction
    - Inventory Optimization
    - Model Monitoring
    - Automated ML Retraining

    ### Tech Stack

    - Streamlit
    - Prophet
    - PyTorch Lightning
    - XGBoost
    - MLflow
    - Evidently AI
    - Docker + Kubernetes

    """)

# ============================================================
# FORECASTING PAGE
# ============================================================

elif page.startswith("📈"):

    from app.pages import forecasting as p
    #from pages import forecasting as p

    p.render()

# ============================================================
# SEGMENTS PAGE
# ============================================================

elif page.startswith("👥"):

    from app.pages import segments as p

    p.render()

# ============================================================
# CHURN PAGE
# ============================================================

elif page.startswith("⚠️"):

    from app.pages import churn as p

    p.render()

# ============================================================
# INVENTORY PAGE
# ============================================================

elif page.startswith("📦"):

    from app.pages import inventory as p

    p.render()

# ============================================================
# MONITORING PAGE
# ============================================================

else:

    from app.pages import monitoring as p

    p.render()
