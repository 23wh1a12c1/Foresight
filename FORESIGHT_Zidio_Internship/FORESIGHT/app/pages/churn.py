
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

# ============================================================
# LOAD MOCK CHURN DATA
# ============================================================

def load_churn():

    np.random.seed(42)

    customers = []

    reasons = [

        "High Recency",

        "Low Frequency",

        "No Recent Orders",

        "Low Spend",

        "Declining Activity"

    ]

    for i in range(1, 21):

        customers.append({

            "CustomerID": f"CUST{i:04d}",

            "ChurnProbability": round(

                np.random.uniform(

                    0.70,

                    0.99

                ),

                2

            ),

            "TopReason1": np.random.choice(reasons),

            "TopReason2": np.random.choice(reasons),

            "TopReason3": np.random.choice(reasons)

        })

    return pd.DataFrame(customers)

# ============================================================
# PAGE
# ============================================================

def render():

    st.title(
        "⚠️ Churn Risk Dashboard"
    )

    st.caption(
        "AI-based churn prediction and customer risk analysis"
    )

    df = load_churn()

    # ========================================================
    # KPI STRIP
    # ========================================================

    k1, k2, k3 = st.columns(3)

    k1.metric(
        "Customers Monitored",
        len(df)
    )

    k2.metric(
        "Average Risk",
        f"{df['ChurnProbability'].mean():.2%}"
    )

    k3.metric(
        "Model AUC",
        "0.94"
    )

    st.divider()

    # ========================================================
    # TOP N
    # ========================================================

    top_n = st.slider(

        "Top At-Risk Customers",

        5,

        20,

        10

    )

    risk_df = df.sort_values(

        "ChurnProbability",

        ascending=False

    ).head(top_n)

    # ========================================================
    # TABLE
    # ========================================================

    st.subheader(
        "🚨 High-Risk Customers"
    )

    st.dataframe(

        risk_df,

        use_container_width=True

    )

    # ========================================================
    # CHART
    # ========================================================

    st.subheader(
        "📊 Churn Probability Distribution"
    )

    fig = px.bar(

        risk_df,

        x="CustomerID",

        y="ChurnProbability",

        color="ChurnProbability",

        title="Top Customer Churn Risks"

    )

    st.plotly_chart(

        fig,

        use_container_width=True

    )

    # ========================================================
    # SUMMARY
    # ========================================================

    avg_risk = risk_df[

        "ChurnProbability"

    ].mean()

    st.success(

        f"Average churn risk among top customers: {avg_risk:.2%}"

    )
