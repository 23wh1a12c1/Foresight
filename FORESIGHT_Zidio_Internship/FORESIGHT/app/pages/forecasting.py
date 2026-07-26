
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

# ============================================================
# MOCK DATA HELPERS
# ============================================================

def load_top_skus():

    return [

        "SKU10105",

        "SKU10114",

        "SKU10100",

        "SKU10045",

        "SKU10108"

    ]

def load_mape(sku):

    return round(

        np.random.uniform(

            4.0,

            6.0

        ),

        2

    )

def load_forecast(sku, horizon):

    dates = pd.date_range(

        start="2026-01-01",

        periods=horizon

    )

    actual = np.random.randint(

        80,

        140,

        size=horizon

    )

    forecast = actual + np.random.normal(

        0,

        8,

        size=horizon

    )

    upper = forecast + 15

    lower = forecast - 15

    return pd.DataFrame({

        "ds": dates,

        "actual": actual,

        "yhat": forecast,

        "yhat_upper": upper,

        "yhat_lower": lower

    })

# ============================================================
# PAGE
# ============================================================

def render():

    st.title(
        "📈 Demand Forecasting"
    )

    st.caption(
        "Hybrid Prophet + LSTM demand forecasting dashboard"
    )

    # ========================================================
    # KPI STRIP
    # ========================================================

    k1, k2, k3 = st.columns(3)

    k1.metric(
        "Forecast MAPE",
        "4.61%"
    )

    k2.metric(
        "Forecast Horizon",
        "30 Days"
    )

    k3.metric(
        "Top SKU Accuracy",
        "95.4%"
    )

    st.divider()

    # ========================================================
    # CONTROLS
    # ========================================================

    col1, col2, col3 = st.columns(3)

    sku = col1.selectbox(

        "Select SKU",

        load_top_skus()

    )

    horizon = col2.slider(

        "Forecast Horizon (Days)",

        7,

        90,

        30

    )

    promo = col3.slider(

        "Promo Lift (%)",

        -20,

        50,

        0,

        help="Apply what-if demand adjustment"

    )

    # ========================================================
    # LOAD DATA
    # ========================================================

    fcst = load_forecast(

        sku,

        horizon

    )

    fcst['yhat_adj'] = (

        fcst['yhat']

        * (1 + promo / 100)

    )

    # ========================================================
    # CHART
    # ========================================================

    st.subheader(
        "📊 Forecast Visualization"
    )

    fig = go.Figure()

    fig.add_trace(

        go.Scatter(

            x=fcst['ds'],

            y=fcst['actual'],

            name='Historical',

            mode='lines'

        )

    )

    fig.add_trace(

        go.Scatter(

            x=fcst['ds'],

            y=fcst['yhat'],

            name='Forecast',

            mode='lines'

        )

    )

    fig.add_trace(

        go.Scatter(

            x=fcst['ds'],

            y=fcst['yhat_upper'],

            line=dict(width=0),

            showlegend=False

        )

    )

    fig.add_trace(

        go.Scatter(

            x=fcst['ds'],

            y=fcst['yhat_lower'],

            fill='tonexty',

            name='95% Confidence Interval',

            line=dict(width=0)

        )

    )

    # ========================================================
    # WHAT-IF ANALYSIS
    # ========================================================

    if promo != 0:

        fig.add_trace(

            go.Scatter(

                x=fcst['ds'],

                y=fcst['yhat_adj'],

                name=f'What-if ({promo:+}%)',

                line=dict(dash='dot')

            )

        )

    st.plotly_chart(

        fig,

        use_container_width=True

    )

    # ========================================================
    # METRICS
    # ========================================================

    st.subheader(
        "📈 Forecast Metrics"
    )

    m1, m2, m3 = st.columns(3)

    m1.metric(

        "MAPE",

        f"{load_mape(sku):.2f}%"

    )

    m2.metric(

        "Avg Daily Demand",

        f"{fcst['yhat'].mean():.0f} units"

    )

    m3.metric(

        "Total Forecast",

        f"{fcst['yhat'].sum():.0f} units"

    )

    # ========================================================
    # RAW DATA
    # ========================================================

    st.subheader(
        "📋 Forecast Data"
    )

    st.dataframe(

        fcst,

        use_container_width=True

    )

    # ========================================================
    # DOWNLOAD
    # ========================================================

    csv = fcst.to_csv(

        index=False

    )

    st.download_button(

        label="📥 Download Forecast CSV",

        data=csv,

        file_name=f"{sku}_forecast.csv",

        mime="text/csv"

    )
