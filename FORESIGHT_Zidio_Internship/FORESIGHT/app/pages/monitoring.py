
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import time

# ============================================================
# MOCK LIVE METRICS
# ============================================================

def load_metrics():

    np.random.seed(

        int(time.time()) % 1000

    )

    drift_score = round(

        np.random.uniform(

            0.05,

            0.45

        ),

        2

    )

    stockouts_today = np.random.randint(

        5,

        25

    )

    weekly_avg = 10

    weekly_std = 4

    churn_spike = round(

        np.random.uniform(

            0.0,

            0.20

        ),

        2

    )

    return {

        "drift_score": drift_score,

        "stockouts_today": stockouts_today,

        "weekly_avg": weekly_avg,

        "weekly_std": weekly_std,

        "churn_spike": churn_spike

    }

# ============================================================
# PAGE
# ============================================================

def render():

    st.title(
        "🔬 Real-Time Monitoring Dashboard"
    )

    st.caption(
        "Production monitoring for model drift, stockouts, and churn anomalies"
    )

    # ========================================================
    # LOAD METRICS
    # ========================================================

    metrics = load_metrics()

    drift_score = metrics["drift_score"]

    stockouts_today = metrics["stockouts_today"]

    weekly_avg = metrics["weekly_avg"]

    weekly_std = metrics["weekly_std"]

    churn_spike = metrics["churn_spike"]

    # ========================================================
    # KPI STRIP
    # ========================================================

    k1, k2, k3 = st.columns(3)

    k1.metric(
        "Drift Score",
        drift_score
    )

    k2.metric(
        "Today's Stockouts",
        stockouts_today
    )

    k3.metric(
        "WoW Churn Spike",
        f"{churn_spike:.0%}"
    )

    st.divider()

    # ========================================================
    # ALERTS
    # ========================================================

    st.subheader(
        "🚨 Active Alerts"
    )

    alerts = []

    # --------------------------------------------------------
    # DRIFT ALERT
    # --------------------------------------------------------

    if drift_score > 0.30:

        alerts.append(
            f"⚠️ Drift score high ({drift_score})"
        )

    # --------------------------------------------------------
    # STOCKOUT ALERT
    # --------------------------------------------------------

    stockout_limit = (

        weekly_avg

        + 2 * weekly_std

    )

    if stockouts_today > stockout_limit:

        alerts.append(
            f"📦 Stockouts unusually high ({stockouts_today})"
        )

    # --------------------------------------------------------
    # CHURN ALERT
    # --------------------------------------------------------

    if churn_spike > 0.10:

        alerts.append(
            f"⚠️ Churn spike detected ({churn_spike:.0%})"
        )

    # ========================================================
    # DISPLAY ALERTS
    # ========================================================

    if alerts:

        for a in alerts:

            st.error(a)

    else:

        st.success(
            "✅ All systems operating normally"
        )

    st.divider()

    # ========================================================
    # MONITORING TABLE
    # ========================================================

    st.subheader(
        "📊 Monitoring Metrics"
    )

    monitor_df = pd.DataFrame({

        "Metric": [

            "Drift Score",

            "Stockouts Today",

            "Weekly Avg Stockouts",

            "Weekly Std Dev",

            "Churn Spike"

        ],

        "Value": [

            drift_score,

            stockouts_today,

            weekly_avg,

            weekly_std,

            f"{churn_spike:.0%}"

        ]

    })

    st.dataframe(

        monitor_df,

        use_container_width=True

    )

    # ========================================================
    # VISUALIZATION
    # ========================================================

    st.subheader(
        "📈 Monitoring Visualization"
    )

    chart_df = pd.DataFrame({

        "Metric": [

            "Drift",

            "Stockouts",

            "Churn"

        ],

        "Value": [

            drift_score,

            stockouts_today,

            churn_spike * 100

        ]

    })

    fig = px.bar(

        chart_df,

        x="Metric",

        y="Value",

        color="Metric",

        title="Operational Monitoring Metrics"

    )

    st.plotly_chart(

        fig,

        use_container_width=True

    )

    # ========================================================
    # REFRESH INFO
    # ========================================================

    st.info(
        "🔄 Refresh page manually to simulate live monitoring updates"
    )
