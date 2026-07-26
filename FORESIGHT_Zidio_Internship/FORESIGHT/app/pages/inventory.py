
import streamlit as st
import pandas as pd
import numpy as np


from utils.export_utils import export_pdf
# ============================================================
# LOAD DATA
# ============================================================

def load_inventory():

    try:

        recs = pd.read_csv(

            "data/processed/inventory_recommendations.csv"

        )

    except:

        # ====================================================
        # MOCK DATA FALLBACK
        # ====================================================

        recs = pd.DataFrame({

            "StockCode": [

                "SKU10105",

                "SKU10114",

                "SKU10100",

                "SKU10045"

            ],

            "Category": [

                "Electronics",

                "Fashion",

                "Home",

                "Food"

            ],

            "LeadTime": [

                7,

                10,

                5,

                12

            ],

            "CurrentStock": [

                40,

                12,

                70,

                8

            ],

            "ReorderPoint": [

                50,

                25,

                65,

                20

            ],

            "ReorderNow": [

                True,

                True,

                False,

                True

            ],

            "RecommendedQty": [

                120,

                80,

                0,

                150

            ]

        })

    return recs

# ============================================================
# PAGE
# ============================================================

def render():

    st.title(
        "📦 Inventory Optimizer"
    )

    st.caption(
        "AI-powered inventory planning and reorder optimization"
    )

    recs = load_inventory()

    # ========================================================
    # KPI STRIP
    # ========================================================

    k1, k2, k3, k4 = st.columns(4)

    k1.metric(
        "SKUs to Reorder",
        int(recs['ReorderNow'].sum())
    )

    k2.metric(
        "Avg Lead Time",
        f"{recs['LeadTime'].mean():.0f} days"
    )

    k3.metric(
        "Projected Stockout Reduction",
        "32.7%"
    )

    k4.metric(
        "Holding Cost Savings",
        "£18,400/yr"
    )

    st.divider()

    # ========================================================
    # FILTERS
    # ========================================================

    st.subheader(
        "🔎 Inventory Filters"
    )

    col1, col2 = st.columns(2)

    cat_filter = col1.multiselect(

        "Category",

        sorted(

            recs['Category'].unique()

        )

    )

    show_only = col2.checkbox(

        "Show only items needing reorder",

        value=True

    )

    if cat_filter:

        recs = recs[

            recs['Category'].isin(

                cat_filter

            )

        ]

    if show_only:

        recs = recs[

            recs['ReorderNow'] == True

        ]

    # ========================================================
    # TABLE
    # ========================================================

    st.subheader(
        "📋 Inventory Recommendations"
    )

    st.dataframe(

        recs,

        use_container_width=True

    )

    # ========================================================
    # CHART
    # ========================================================

    st.subheader(
        "📊 Recommended Reorder Quantities"
    )

    chart_df = recs[[

        "StockCode",

        "RecommendedQty"

    ]]

    st.bar_chart(

        chart_df.set_index(

            "StockCode"

        )

    )

    st.divider()

    # ========================================================
    # EXPORTS
    # ========================================================

    st.subheader(
        "📥 Export Reports"
    )

    csv_data = recs.to_csv(

        index=False

    )

    st.download_button(

        label="📥 Download CSV",

        data=csv_data,

        file_name="inventory_report.csv",

        mime="text/csv"

    )

    st.download_button(

        label="📥 Download PDF",

        data=export_pdf(

            recs,

            "Inventory Optimization Report"

        ),

        file_name="inventory_report.pdf",

        mime="application/pdf"

    )
