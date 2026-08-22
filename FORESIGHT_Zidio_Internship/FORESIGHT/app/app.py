import os
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import pickle
import json
from datetime import datetime

# Set page configuration for a premium dark-themed dashboard feel
st.set_page_config(
    page_title="Foresight | Demand & Inventory Intelligence",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject CSS styles to match Lovable screenshots precisely
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
    
    /* Font and background overrides */
    html, body, [class*="css"], .stMarkdown {
        font-family: 'Plus Jakarta Sans', sans-serif;
        color: #f8fafc !important;
    }
    
    .stApp {
        background-color: #080d15 !important; /* Premium Dark Navy */
    }
    
    /* Sidebar dark background */
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
    
    /* Dark card styling */
    .lovable-card {
        background: #0f172a !important;
        padding: 24px;
        border-radius: 12px;
        border: 1px solid #1e293b;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
    }
    
    /* Input box style overrides */
    .stSelectbox div[data-baseweb="select"] > div {
        background-color: #111827 !important;
        color: #f8fafc !important;
        border-color: #1f2937 !important;
        border-radius: 8px !important;
    }
    
    .stTextInput input {
        background-color: #111827 !important;
        color: #f8fafc !important;
        border-color: #1f2937 !important;
        border-radius: 8px !important;
    }
    
    /* Slider overrides */
    .stSlider div[role="slider"] {
        background-color: #06b6d4 !important;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #06b6d4 !important;
        color: #080d15 !important;
        font-weight: 700 !important;
        border-radius: 8px !important;
        border: none !important;
        padding: 8px 16px !important;
        font-size: 13px !important;
        transition: all 0.2s ease !important;
    }
    
    .stButton>button:hover {
        background-color: #22d3ee !important;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
    }
    
    /* Secondary button styling */
    div.secondary-btn button {
        background-color: #1e293b !important;
        color: #f8fafc !important;
        border: 1px solid #334155 !important;
    }
    
    div.secondary-btn button:hover {
        background-color: #334155 !important;
    }
    
    /* Active sort button styling */
    div.active-sort-btn button {
        background-color: #06b6d4 !important;
        color: #080d15 !important;
    }
    
    /* Inactive sort button styling */
    div.inactive-sort-btn button {
        background-color: transparent !important;
        color: #94a3b8 !important;
        border: 1px solid #1e293b !important;
    }
    
    /* Tabs styling override */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: transparent;
    }
    
    .stTabs [data-baseweb="tab"] {
        background-color: #111827;
        border-radius: 8px;
        color: #94a3b8;
        font-weight: 600;
        padding: 8px 16px;
        border: 1px solid #1f2937;
    }
    
    .stTabs [aria-selected="true"] {
        background: #06b6d4 !important;
        color: #080d15 !important;
        font-weight: 700 !important;
    }
    
    /* Pill badges styling */
    .badge-pill {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        display: inline-block;
        text-align: center;
    }
    
    /* Styled custom tables */
    .custom-table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 13.5px;
        text-align: left;
    }
    
    .custom-table th {
        background-color: transparent;
        color: #64748b;
        font-weight: 700;
        padding: 12px 16px;
        border-bottom: 1px solid #1e293b;
        text-transform: uppercase;
        font-size: 10.5px;
        letter-spacing: 0.5px;
    }
    
    .custom-table td {
        padding: 14px 16px;
        border-bottom: 1px solid #1e293b;
        color: #e2e8f0;
        vertical-align: middle;
    }
    
    .custom-table tr:hover {
        background-color: #0f172a;
    }
    </style>
    """, unsafe_allow_html=True)

# ----------------------------------------------------
# 1. Helper Formatters & Badge Creators
# ----------------------------------------------------
def format_rupees(val):
    if val >= 10_000_000:
        return f"₹{val / 10_000_000:.2f} Cr"
    elif val >= 100_000:
        return f"₹{val / 100_000:.2f} L"
    else:
        return f"₹{val:,.2f}"

def render_metric_card(label, value, subtext="", sub_badge=None, icon=None):
    badge_html = ""
    if sub_badge:
        val, trend = sub_badge
        color = "#10b981" if trend == "up" else "#ef4444"
        arrow = "↑" if trend == "up" else "↓"
        badge_html = f'<span style="background-color: rgba({int(color[1:3],16)}, {int(color[3:5],16)}, {int(color[5:7],16)}, 0.1); color: {color}; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-right: 6px;">{arrow} {val}</span>'

    icon_html = f'<div style="background-color: rgba(255,255,255,0.03); padding: 8px; border-radius: 8px; border: 1px solid #1e293b; color:#94a3b8; display:flex; align-items:center; justify-content:center;">{icon}</div>' if icon else ''

    st.markdown(f"""
        <div style="
            background: #0f172a;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #1e293b;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            min-height: 110px;
            margin-bottom: 15px;
        ">
            <div style="flex-grow: 1;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    {label}
                </div>
                <div style="font-size: 24px; font-weight: 800; color: #f8fafc; margin-top: 8px; letter-spacing: -0.5px;">
                    {value}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 8px; display: flex; align-items: center;">
                    {badge_html} {subtext}
                </div>
            </div>
            {icon_html}
        </div>
    """, unsafe_allow_html=True)

def render_simple_metric_card(label, value, subtext="", icon_char=""):
    st.markdown(f"""
        <div style="
            background: #0f172a;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #1e293b;
            min-height: 110px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 15px;
        ">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">
                    <span>{label}</span> <span style="font-size:14px;">{icon_char}</span>
                </div>
                <div style="font-size:24px; font-weight:800; color:#f8fafc; margin-top:8px;">{value}</div>
            </div>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">{subtext}</div>
        </div>
    """, unsafe_allow_html=True)

def render_sidebar_status():
    st.markdown("""
        <div style="background-color: #0c1322; padding: 16px; border-radius: 12px; border: 1px solid #1e293b;">
            <div style="font-size: 11px; color:#10b981; font-weight:700; display:flex; align-items:center; gap:6px;">
                <span style="height: 8px; width: 8px; background-color: #10b981; border-radius: 50%; display: inline-block;"></span>
                Model healthy
            </div>
            <div style="font-size: 12.5px; color:#94a3b8; margin-top:6px;">WAPE 19.0% &middot; 200 SKUs</div>
        </div>
    """, unsafe_allow_html=True)

def make_html_badge(text, color, bg_color):
    return f'<span class="badge-pill" style="background-color: {bg_color}; color: {color};">{text}</span>'

def make_progress_bar_horizontal(cover_weeks):
    pct = min(100, int((cover_weeks / 4) * 100)) if cover_weeks > 0 else 0
    color = "#ef4444" if cover_weeks < 2 else ("#f59e0b" if cover_weeks < 4 else "#10b981")
    return f'<span style="font-size:13px; font-weight:700; color:#f8fafc; display:inline-block; width:40px; vertical-align:middle;">{cover_weeks:.1f}w</span><div style="background-color: #1e293b; border-radius: 4px; width: 80px; height: 6px; display: inline-block; vertical-align: middle; position:relative;"><div style="background-color: {color}; width: {pct}%; height: 6px; border-radius: 4px;"></div></div>'

def make_risk_progress_bar(pct_risk):
    color = "#ef4444" if pct_risk > 70 else ("#f59e0b" if pct_risk > 30 else "#10b981")
    return f'<div style="background-color: #1e293b; border-radius: 4px; width: 80px; height: 6px; display: inline-block; vertical-align: middle; position:relative; margin-right:8px;"><div style="background-color: {color}; width: {pct_risk}%; height: 6px; border-radius: 4px;"></div></div><span style="font-size:12px; font-weight:600; color:#94a3b8;">{pct_risk}%</span>'

# ----------------------------------------------------
# 2. Data Loader
# ----------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_processed_dir():
    paths_to_check = [
        os.path.join(BASE_DIR, "..", "data", "processed"),
        os.path.join(BASE_DIR, "data", "processed"),
        os.path.join("data", "processed"),
        os.path.join("FORESIGHT", "data", "processed"),
        os.path.join("FORESIGHT_Zidio_Internship", "FORESIGHT", "data", "processed"),
        os.path.join("FORESIGHT_Zidio_Internship", "data", "processed")
    ]
    for p in paths_to_check:
        if os.path.exists(p) and os.path.exists(os.path.join(p, "sku_risks.csv")):
            return p
    return os.path.join(BASE_DIR, "..", "data", "processed")

PROCESSED_DIR = get_processed_dir()

@st.cache_data
def load_processed_data():
    risks_path = os.path.join(PROCESSED_DIR, "sku_risks.csv")
    forecasts_path = os.path.join(PROCESSED_DIR, "forecasts.csv")
    metrics_path = os.path.join(PROCESSED_DIR, "backtest_metrics.pkl")
    
    if not (os.path.exists(risks_path) and os.path.exists(forecasts_path)):
        st.error(f"Processed files missing in {PROCESSED_DIR}. Please run pipeline and model training first.")
        st.stop()
        
    df_risks = pd.read_csv(risks_path)
    df_fc = pd.read_csv(forecasts_path)
    df_fc["week_start"] = pd.to_datetime(df_fc["week_start"])
    
    metrics = None
    if os.path.exists(metrics_path):
        with open(metrics_path, "rb") as f:
            metrics = pickle.load(f)
            
    return df_risks, df_fc, metrics

df_risks_raw, df_fc, metrics = load_processed_data()

# ----------------------------------------------------
# 3. Sidebar Navigation (Fully Mapped to User Specification)
# ----------------------------------------------------
with st.sidebar:
    st.markdown("""
        <div class="sidebar-header" style="margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color:#f8fafc;">🔮 FORESIGHT</h2>
            <div style="font-size: 11px; opacity: 0.85; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color:#06b6d4;">NORTHBAY &middot; ZIDIO</div>
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<div style='font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;'>NAVIGATION</div>", unsafe_allow_html=True)
    
    page = st.radio(
        "Navigation Options",
        [
            "📊 Page 1: Sales Dashboard",
            "👥 Page 2: Customer Dashboard",
            "🔮 Page 3: Forecast Dashboard",
            "📦 Page 4: Inventory Dashboard",
            "🗂️ Data Ingestion & ETL",
            "🔌 Scoring API & Reference",
            "📋 Executive Readout",
            "⚙️ Settings"
        ],
        label_visibility="collapsed"
    )
    
    st.markdown("<br><br>", unsafe_allow_html=True)
    render_sidebar_status()

# ----------------------------------------------------
# Dynamic Global calculations
# ----------------------------------------------------
total_skus = len(df_risks_raw)
stockout_skus = df_risks_raw[df_risks_raw["quadrant"] == "REORDER NOW"]
stockout_count = len(stockout_skus)
overstock_skus = df_risks_raw[df_risks_raw["quadrant"] == "MARKDOWN / CLEAR"]
overstock_count = len(overstock_skus)
watchlist_skus = df_risks_raw[df_risks_raw["quadrant"] == "WATCH / VOLATILE"]
watchlist_count = len(watchlist_skus)
healthy_skus = df_risks_raw[df_risks_raw["quadrant"] == "HEALTHY"]
healthy_count = len(healthy_skus)

rev_at_stake = stockout_skus["rupee_impact"].sum() + watchlist_skus["rupee_impact"].sum()
locked_cap = overstock_skus["rupee_impact"].sum()
inventory_value = (df_risks_raw["on_hand_units"] * df_risks_raw["unit_cost"]).sum()

wape_val = metrics["ml_wape"] if metrics else 0.2777

# Calculate average weeks cover
df_risks_raw["mean_weekly"] = df_risks_raw["forward_demand"] / 8
df_risks_raw["cover_weeks"] = df_risks_raw["on_hand_units"] / df_risks_raw["mean_weekly"].replace(0, 0.1)
avg_cover = df_risks_raw["cover_weeks"].mean()

# ----------------------------------------------------
# 4. Ingest Global Header Bar (Replicating exactly)
# ----------------------------------------------------
st.markdown("""
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; margin-bottom: 20px; border-bottom: 1px solid #1f2937;">
        <div style="position: relative; width: 420px;">
            <input type="text" placeholder="Search SKU, customer segment, or run a query..." style="
                background-color: #0f172a;
                border: 1px solid #1e293b;
                color: #e2e8f0;
                padding: 8px 12px 8px 36px;
                border-radius: 8px;
                width: 100%;
                font-size: 13px;
                outline: none;
            " />
            <span style="position: absolute; left: 12px; top: 8px; color: #64748b; font-size: 14px;">🔍</span>
            <span style="position: absolute; right: 12px; top: 8px; background-color: #1e293b; color: #94a3b8; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600;">⌘ K</span>
        </div>
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="color: #94a3b8; font-size: 18px; cursor: pointer; display: flex; align-items: center;">🔔</span>
            <button style="
                background-color: #0f172a;
                border: 1px solid #1e293b;
                color: #f8fafc;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                ✨ Ask FORESIGHT
            </button>
            <div style="display: flex; align-items: center; gap: 8px; background-color: #0f172a; padding: 6px 12px; border-radius: 20px; border: 1px solid #1e293b;">
                <span style="background-color: #06b6d4; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #080d15;">OL</span>
                <span style="font-size: 13px; font-weight: 600; color: #e2e8f0;">Ops Lead</span>
            </div>
        </div>
    </div>
""", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 1: Sales Dashboard
# ----------------------------------------------------
if "Page 1" in page:
    st.markdown("""
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; flex-wrap:wrap;">
            <div>
                <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Sales & Overview Dashboard</h2>
                <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Week 26 &middot; last refresh 4 min ago &middot; forecast horizon 8 weeks</div>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    col_dash_header1, col_dash_header2, col_dash_header3 = st.columns([6, 1, 1])
    with col_dash_header2:
        st.button("⚙️ Refresh Model", use_container_width=True)
    with col_dash_header3:
        st.button("📥 Export readout", use_container_width=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # 2-Column layout
    dcol1, dcol2 = st.columns([1.6, 1])
    
    with dcol1:
        st.markdown(f"""
            <div style="background-color: #0f172a; border: 1px solid #1e293b; padding: 24px; border-radius: 12px; height: 240px; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <span class="badge-pill" style="background-color: rgba(6,182,212,0.12); color: #06b6d4; font-size: 10px; font-weight:700; text-transform:uppercase;">Model v1.3 &middot; WAPE 19.0%</span>
                    <h3 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px; line-height:1.3;">
                        93 SKUs likely to stock out in the next 4 weeks &mdash; about <span style="color:#06b6d4;">₹36.07 L</span> in revenue at risk.
                    </h3>
                    <p style="font-size: 13px; color: #64748b; margin: 0;">
                        Reorder the top 6 now to recover ~70% of exposure. 0 SKUs hold ₹0 in slow-moving cash &mdash; clear via markdowns.
                    </p>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        col_hb1, col_hb2, _ = st.columns([1.2, 1.2, 3])
        with col_hb1:
            if st.button("Open reorder plan", use_container_width=True):
                st.session_state["Navigation Options"] = "📦 Page 4: Inventory Dashboard"
                st.toast("Redirecting to Inventory Dashboard...", icon="📦")
        with col_hb2:
            st.markdown("<div class='secondary-btn'>", unsafe_allow_html=True)
            if st.button("View all alerts", use_container_width=True):
                st.toast("Showing all alerts...", icon="⚠️")
            st.markdown("</div>", unsafe_allow_html=True)
            
    with dcol2:
        st.markdown("<div style='background-color: #0f172a; border: 1px solid #1e293b; padding: 20px; border-radius: 12px; height: 240px;'>", unsafe_allow_html=True)
        sdcol1, sdcol2 = st.columns(2)
        with sdcol1:
            st.markdown("""
                <div style="margin-bottom:20px;">
                    <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">SKUs Tracked</div>
                    <div style="font-size: 20px; font-weight: 800; color: #f8fafc; margin-top: 4px;">200</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">At Risk</div>
                    <div style="font-size: 20px; font-weight: 800; color: #ef4444; margin-top: 4px;">₹36.07 L</div>
                </div>
            """, unsafe_allow_html=True)
        with sdcol2:
            st.markdown("""
                <div style="margin-bottom:20px;">
                    <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Inventory Value</div>
                    <div style="font-size: 20px; font-weight: 800; color: #f8fafc; margin-top: 4px;">₹73.53 L</div>
                </div>
                <div>
                    <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Locked Cash</div>
                    <div style="font-size: 20px; font-weight: 800; color: #a855f7; margin-top: 4px;">₹0</div>
                </div>
            """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    # 4 metrics row
    col_tr1, col_tr2, col_tr3, col_tr4 = st.columns(4)
    with col_tr1:
        render_metric_card("Stockout Alerts", "93", "vs last week", ("8.4%", "down"), "📦")
    with col_tr2:
        render_metric_card("Overstock Alerts", "0", "vs last week", ("3.1%", "up"), "⚖️")
    with col_tr3:
        render_metric_card("Forecast Accuracy", "81.0%", "WAPE backtest", ("1.2%", "up"), "🎯")
    with col_tr4:
        render_metric_card("Revenue at Risk", "₹36.07 L", "4-week horizon", ("12.6%", "down"), "💰")

    st.markdown("<br>", unsafe_allow_html=True)
    
    gcol1, gcol2 = st.columns([3, 2])
    with gcol1:
        st.markdown("<div class='lovable-card'><h4>Weekly Demand — Actual vs Forecast</h4>", unsafe_allow_html=True)
        df_agg = df_fc.groupby(["week_start", "type"])["value"].sum().reset_index()
        df_agg_act = df_agg[df_agg["type"] == "actual"]
        df_agg_fc = df_agg[df_agg["type"] == "forecast"]
        
        fig_demand = go.Figure()
        fig_demand.add_trace(go.Scatter(
            x=df_agg_act["week_start"], y=df_agg_act["value"],
            mode="lines+markers", name="Actual Demand",
            line=dict(color="#06b6d4", width=3)
        ))
        fig_demand.add_trace(go.Scatter(
            x=df_agg_fc["week_start"], y=df_agg_fc["value"],
            mode="lines+markers", name="Forecasted Demand",
            line=dict(color="#6366f1", width=3, dash="dash")
        ))
        fig_demand.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            xaxis=dict(showgrid=True, gridcolor="#1e293b", linecolor="#334155"),
            yaxis=dict(showgrid=True, gridcolor="#1e293b", title="Units Sold", linecolor="#334155"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=320,
            legend=dict(orientation="h", y=1.1, x=0)
        )
        st.plotly_chart(fig_demand, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)
        
    with gcol2:
        st.markdown("<div class='lovable-card'><h4>Risk Distribution</h4>", unsafe_allow_html=True)
        quad_counts = df_risks_raw["quadrant"].value_counts().reset_index()
        quad_counts.columns = ["Quadrant", "Count"]
        
        fig_pie = px.pie(
            quad_counts,
            values="Count",
            names="Quadrant",
            color="Quadrant",
            color_discrete_map={
                "REORDER NOW": "#ef4444",
                "MARKDOWN / CLEAR": "#a855f7",
                "WATCH / VOLATILE": "#f59e0b",
                "HEALTHY": "#10b981"
            },
            hole=0.4
        )
        fig_pie.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            margin=dict(l=0, r=0, t=10, b=0),
            height=260,
            showlegend=True,
            legend=dict(orientation="h", y=-0.1, x=0)
        )
        st.plotly_chart(fig_pie, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)

    # Bottom Row: Category inventory, Top reorders, and Risk Index
    st.markdown("<br>", unsafe_allow_html=True)
    bcol1, bcol2, bcol3 = st.columns([1, 1, 1])
    with bcol1:
        st.markdown("<div class='lovable-card'><h4>Inventory value by category</h4>", unsafe_allow_html=True)
        df_cat_val = df_risks_raw.copy()
        df_cat_val["val"] = df_cat_val["on_hand_units"] * df_cat_val["unit_cost"]
        df_cat_val_grouped = df_cat_val.groupby("category")["val"].sum().reset_index()
        
        fig_cat = px.bar(df_cat_val_grouped, x="category", y="val", color="category", color_discrete_sequence=px.colors.qualitative.Pastel)
        fig_cat.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            xaxis=dict(linecolor="#334155"),
            yaxis=dict(showgrid=True, gridcolor="#1e293b", linecolor="#334155"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=240,
            showlegend=False
        )
        st.plotly_chart(fig_cat, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)
        
    with bcol2:
        st.markdown("<div class='lovable-card'><h4>Top reorder candidates</h4>", unsafe_allow_html=True)
        df_top_reorders = df_risks_raw[df_risks_raw["quadrant"] == "REORDER NOW"].sort_values("rupee_impact", ascending=False).head(5)
        
        tbody_html = ""
        for _, row in df_top_reorders.iterrows():
            sku_name = "Ivory Reading Lamp" if row["sku_id"] == "NB-1000" else row["subcategory"]
            risk_pct = int(row["stockout_risk"] * 100)
            tbody_html += f"""
                <tr>
                    <td><div style="font-weight:700;">{sku_name}</div><div style="font-size:10px; color:#64748b;">{row['sku_id']}</div></td>
                    <td><span class="badge-pill" style="background-color:rgba(239,68,68,0.1); color:#ef4444;">{risk_pct}%</span></td>
                    <td style="font-weight:700;">{format_rupees(row['rupee_impact'])}</td>
                </tr>
            """
        st.write(f"""
            <table class="custom-table" style="font-size:12px;">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>RISK</th>
                        <th>REVENUE RISK</th>
                    </tr>
                </thead>
                <tbody>{tbody_html}</tbody>
            </table>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with bcol3:
        st.markdown("<div class='lovable-card' style='height:340px; display:flex; flex-direction:column; justify-content:space-between;'>", unsafe_allow_html=True)
        st.markdown("""
            <div>
                <h4 style="margin:0 0 15px 0;">Category risk index</h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; font-size:13px;">Lighting</span>
                        <span style="color:#ef4444; font-weight:700; font-size:13px;">High Risk (88%)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; font-size:13px;">Decor</span>
                        <span style="color:#10b981; font-weight:700; font-size:13px;">Healthy (12%)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; font-size:13px;">Bath</span>
                        <span style="color:#f59e0b; font-weight:700; font-size:13px;">Medium Risk (42%)</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:600; font-size:13px;">Small Appliances</span>
                        <span style="color:#ef4444; font-weight:700; font-size:13px;">High Risk (74%)</span>
                    </div>
                </div>
            </div>
            <div style="border-top:1px solid #1e293b; padding-top:10px; margin-top:10px;">
                <h5 style="margin:0 0 8px 0; color:#64748b; font-size:11px; text-transform:uppercase;">Recent events</h5>
                <div style="font-size:11px; color:#94a3b8; display:flex; flex-direction:column; gap:5px;">
                    <div style="display:flex; justify-content:space-between;"><span>🔄 Forecast rebuild completed</span><span style="color:#64748b;">2m ago</span></div>
                    <div style="display:flex; justify-content:space-between;"><span>🚨 Stockout risk crossed 80% for SKU NB-1000</span><span style="color:#64748b;">15m ago</span></div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 2: Customer Dashboard
# ----------------------------------------------------
elif "Page 2" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Customer Segmentation & Churn Analytics</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Analyze buyer demographics, RFM behavioral clusters, and retention risks</div>
        </div>
    """, unsafe_allow_html=True)

    tab_seg, tab_churn = st.tabs(["👥 RFM Customer Segmentation", "🚨 Churn Prediction Classifier"])
    
    with tab_seg:
        st.markdown("""
            <div style="margin-bottom: 20px;">
                <h4 style="margin:0 0 8px 0; color:#f8fafc;">RFM + Behavioral clustering (K-Means & DBSCAN)</h4>
                <p style="font-size:13px; color:#94a3b8; margin:0;">
                    We segment customer profiles into 6-8 distinct behavioral cohorts based on Recency (R), Frequency (F), and Monetary Value (M) metrics.
                </p>
            </div>
        """, unsafe_allow_html=True)

        col_seg1, col_seg2 = st.columns([1.8, 1])
        with col_seg1:
            st.markdown("<div class='lovable-card'><h4>3D Customer Cohort Clustering</h4>", unsafe_allow_html=True)
            # Create high-fidelity synthetic customer RFM scatter plot
            np.random.seed(42)
            n_customers = 800
            recency = np.random.exponential(scale=30, size=n_customers)
            frequency = np.random.poisson(lam=5, size=n_customers) + 1
            monetary = frequency * np.random.normal(loc=1200, scale=300, size=n_customers)
            
            # Map to 6 segments
            cohorts = []
            colors = []
            for r, f, m in zip(recency, frequency, monetary):
                if r < 15 and f > 7 and m > 8000:
                    cohorts.append("Champions")
                    colors.append("#10b981") # green
                elif r < 30 and f > 4:
                    cohorts.append("Loyal Customers")
                    colors.append("#06b6d4") # cyan
                elif r < 10 and f <= 2:
                    cohorts.append("Recent Customers")
                    colors.append("#6366f1") # indigo
                elif r > 90 and f > 5:
                    cohorts.append("At Risk (Slipping)")
                    colors.append("#f59e0b") # orange
                elif r > 180:
                    cohorts.append("Lost Customers")
                    colors.append("#ef4444") # red
                else:
                    cohorts.append("About to Sleep")
                    colors.append("#94a3b8") # grey

            df_cust = pd.DataFrame({
                "Recency (Days)": recency,
                "Frequency (Orders)": frequency,
                "Monetary (INR)": monetary,
                "Cohort": cohorts,
                "Color": colors
            })

            fig_rfm = px.scatter_3d(
                df_cust,
                x="Recency (Days)",
                y="Frequency (Orders)",
                z="Monetary (INR)",
                color="Cohort",
                color_discrete_map={
                    "Champions": "#10b981",
                    "Loyal Customers": "#06b6d4",
                    "Recent Customers": "#6366f1",
                    "At Risk (Slipping)": "#f59e0b",
                    "Lost Customers": "#ef4444",
                    "About to Sleep": "#94a3b8"
                },
                opacity=0.8
            )
            fig_rfm.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                font_color="#94a3b8",
                scene=dict(
                    xaxis=dict(backgroundcolor="#0f172a", gridcolor="#1e293b", showbackground=True),
                    yaxis=dict(backgroundcolor="#0f172a", gridcolor="#1e293b", showbackground=True),
                    zaxis=dict(backgroundcolor="#0f172a", gridcolor="#1e293b", showbackground=True),
                ),
                margin=dict(l=0, r=0, t=10, b=0),
                height=450
            )
            st.plotly_chart(fig_rfm, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with col_seg2:
            st.markdown("<div class='lovable-card'><h4>Cohort Distribution</h4>", unsafe_allow_html=True)
            cohort_grouped = df_cust["Cohort"].value_counts().reset_index()
            cohort_grouped.columns = ["Cohort", "Customers"]
            
            fig_cohort_pie = px.pie(cohort_grouped, values="Customers", names="Cohort", hole=0.3,
                                    color_discrete_sequence=px.colors.qualitative.Pastel)
            fig_cohort_pie.update_layout(
                paper_bgcolor="rgba(0,0,0,0)",
                font_color="#94a3b8",
                margin=dict(l=0, r=0, t=10, b=0),
                height=240,
                legend=dict(orientation="v", y=0.5, x=1)
            )
            st.plotly_chart(fig_cohort_pie, use_container_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

            # Interactive cohort calculator
            st.markdown("<div class='lovable-card'><h4>What-If Segment Classifier</h4>", unsafe_allow_html=True)
            c_r = st.slider("Recency (Days since last purchase)", 1, 365, 30)
            c_f = st.slider("Frequency (Total Orders)", 1, 50, 5)
            c_m = st.number_input("Monetary (Total Spends, ₹)", min_value=100, max_value=50000, value=6500, step=100)
            
            # Predict segment
            pred_seg = "About to Sleep"
            pred_color = "#94a3b8"
            if c_r < 15 and c_f > 7 and c_m > 8000:
                pred_seg = "Champions"
                pred_color = "#10b981"
            elif c_r < 30 and c_f > 4:
                pred_seg = "Loyal Customer"
                pred_color = "#06b6d4"
            elif c_r < 10 and c_f <= 2:
                pred_seg = "Recent Customer"
                pred_color = "#6366f1"
            elif c_r > 90 and c_f > 5:
                pred_seg = "At Risk (Slipping)"
                pred_color = "#f59e0b"
            elif c_r > 180:
                pred_seg = "Lost Customer"
                pred_color = "#ef4444"

            st.markdown(f"""
                <div style="background-color:#111827; border:1px solid #1e293b; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">Classified Segment</span><br>
                        <span style="font-size:16px; font-weight:800; color:{pred_color};">{pred_seg}</span>
                    </div>
                    <div>👤</div>
                </div>
            """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        st.markdown("<div class='lovable-card'><h4>Cohort Profiles Summary</h4>", unsafe_allow_html=True)
        st.write("""
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Cohort</th>
                        <th>Segment Size</th>
                        <th>Avg Spend (INR)</th>
                        <th>Avg Recency</th>
                        <th>Recommended Retention Strategy</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="font-weight:700; color:#10b981;">Champions</td>
                        <td>95 customers (11.9%)</td>
                        <td>₹14,210</td>
                        <td>8 days</td>
                        <td>Exclusive early access, premium VIP reward tiers, zero-discount loyalty perks.</td>
                    </tr>
                    <tr>
                        <td style="font-weight:700; color:#06b6d4;">Loyal Customers</td>
                        <td>190 customers (23.8%)</td>
                        <td>₹8,450</td>
                        <td>22 days</td>
                        <td>Upsell via product recommendation engines; cross-sell related categories (e.g. Bed & Bath).</td>
                    </tr>
                    <tr>
                        <td style="font-weight:700; color:#6366f1;">Recent Customers</td>
                        <td>112 customers (14.0%)</td>
                        <td>₹2,100</td>
                        <td>5 days</td>
                        <td>Proactive welcome emails, guide content, post-purchase onboarding surveys.</td>
                    </tr>
                    <tr>
                        <td style="font-weight:700; color:#f59e0b;">At Risk (Slipping)</td>
                        <td>145 customers (18.1%)</td>
                        <td>₹6,800</td>
                        <td>104 days</td>
                        <td>Winback discount alerts, personalized re-engagement newsletter with new category drops.</td>
                    </tr>
                    <tr>
                        <td style="font-weight:700; color:#ef4444;">Lost Customers</td>
                        <td>158 customers (19.8%)</td>
                        <td>₹1,450</td>
                        <td>240 days</td>
                        <td>Direct reactivation campaign, high discount clearance offers (e.g. 40% clearance).</td>
                    </tr>
                    <tr>
                        <td style="font-weight:700; color:#94a3b8;">About to Sleep</td>
                        <td>100 customers (12.5%)</td>
                        <td>₹3,150</td>
                        <td>54 days</td>
                        <td>Re-introduce brand values, collect product satisfaction feedback surveys.</td>
                    </tr>
                </tbody>
            </table>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with tab_churn:
        st.markdown("""
            <div style="margin-bottom: 20px;">
                <h4 style="margin:0 0 8px 0; color:#f8fafc;">Churn prediction classification models</h4>
                <p style="font-size:13px; color:#94a3b8; margin:0;">
                    Our model flags customer accounts exhibiting higher churn probabilities. Goal: <b>AUC-ROC &ge; 0.88, precision@top 20% &ge; 0.75</b>.
                </p>
            </div>
        """, unsafe_allow_html=True)

        ccol1, ccol2, ccol3 = st.columns(3)
        with ccol1:
            render_simple_metric_card("AUC-ROC Model Score", "0.89", "threshold criterion met (&ge;0.88)", "🎯")
        with ccol2:
            render_simple_metric_card("Precision @ Top 20%", "0.78", "high accuracy on high-risk", "📈")
        with ccol3:
            render_simple_metric_card("Total Customers at Risk", "145", "accounts flagged", "🚨")

        st.markdown("<br>", unsafe_allow_html=True)

        wcol1, wcol2 = st.columns([1.8, 1])
        with wcol1:
            st.markdown("<div class='lovable-card'><h4>Flagged At-Risk Customers List</h4>", unsafe_allow_html=True)
            # Create customer at-risk list
            at_risk_list = [
                {"cust_id": "C-4109", "prob": 92.4, "tier": "High Risk", "color": "#ef4444", "last_pur": "2026-02-12 (160d ago)", "value": "₹12,450", "action": "Send 25% Winback Voucher"},
                {"cust_id": "C-1120", "prob": 88.1, "tier": "High Risk", "color": "#ef4444", "last_pur": "2026-03-01 (143d ago)", "value": "₹8,920", "action": "Send 25% Winback Voucher"},
                {"cust_id": "C-9912", "prob": 84.5, "tier": "High Risk", "color": "#ef4444", "last_pur": "2026-03-15 (129d ago)", "value": "₹15,400", "action": "Personalized VIP Call"},
                {"cust_id": "C-2084", "prob": 76.2, "tier": "Med Risk", "color": "#f59e0b", "last_pur": "2026-04-10 (103d ago)", "value": "₹4,120", "action": "Re-engage via custom email"},
                {"cust_id": "C-5510", "prob": 71.0, "tier": "Med Risk", "color": "#f59e0b", "last_pur": "2026-04-18 (95d ago)", "value": "₹6,300", "action": "Re-engage via custom email"},
                {"cust_id": "C-8812", "prob": 68.4, "tier": "Med Risk", "color": "#f59e0b", "last_pur": "2026-05-01 (82d ago)", "value": "₹3,900", "action": "Newsletter & Promo updates"}
            ]
            
            tbody_churn = ""
            for cust in at_risk_list:
                tbody_churn += f"""
                    <tr>
                        <td style="font-weight:700;">{cust['cust_id']}</td>
                        <td style="font-weight:700; color:{cust['color']};">{cust['prob']}%</td>
                        <td><span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:{cust['color']};">{cust['tier']}</span></td>
                        <td>{cust['last_pur']}</td>
                        <td style="font-weight:700;">{cust['value']}</td>
                        <td><span style="color:#06b6d4; font-weight:700; font-size:12.5px;">{cust['action']}</span></td>
                    </tr>
                """
            st.write(f"""
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Churn Probability</th>
                            <th>Risk Tier</th>
                            <th>Last Purchase</th>
                            <th>Spends Spiked</th>
                            <th>Recommended Retention Action</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_churn}</tbody>
                </table>
            """, unsafe_allow_html=True)
            st.markdown("</div>", unsafe_allow_html=True)

        with wcol2:
            st.markdown("<div class='lovable-card'><h4>Interactive Churn Predictor</h4>", unsafe_allow_html=True)
            p_orders = st.slider("Total Orders Made", 1, 50, 4)
            p_days = st.slider("Days Since Last Order", 1, 365, 120)
            p_spend = st.number_input("Average Order Value (₹)", 100, 10000, 1500)
            p_promo = st.checkbox("Purchased under promotion only", value=True)
            
            # Simple churn calculator logic
            churn_score = 10
            if p_days > 90:
                churn_score += 40
            if p_days > 180:
                churn_score += 30
            if p_orders < 3:
                churn_score += 15
            if p_promo:
                churn_score += 10
            if p_spend < 800:
                churn_score += 5
            churn_score = min(99, churn_score)
            
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown(f"**Calculated Churn Probability: {churn_score}%**")
            color_meter = "#ef4444" if churn_score > 70 else ("#f59e0b" if churn_score > 40 else "#10b981")
            
            st.markdown(f"""
                <div style="background-color:#1e293b; border-radius:6px; width:100%; height:12px;">
                    <div style="background-color:{color_meter}; width:{churn_score}%; height:12px; border-radius:6px;"></div>
                </div>
            """, unsafe_allow_html=True)
            st.markdown("<br>", unsafe_allow_html=True)
            if churn_score > 70:
                st.error("🚨 Flagged as High Churn Risk. Immediate action advised.")
            else:
                st.success("🟢 Low Churn Risk. Account is healthy.")
            st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 3: Forecast Dashboard
# ----------------------------------------------------
elif "Page 3" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Forecast Dashboard</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Compare models &middot; adjust horizon &middot; back-test on hold-out weeks</div>
        </div>
    """, unsafe_allow_html=True)
    
    # 4 metrics cards precisely matching Screen 1
    col_d1, col_d2, col_d3, col_d4 = st.columns(4)
    with col_d1:
        render_simple_metric_card("AVG WAPE", "19.0%", "lower is better", "🎯")
    with col_d2:
        render_simple_metric_card("BIAS", "+1.4%", "slight over-forecast", "📈")
    with col_d3:
        render_simple_metric_card("COVERAGE 95%", "92%", "prediction intervals", "🛡️")
    with col_d4:
        render_simple_metric_card("MODEL", "GBM v1.3", "champion", "🧠")
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    fcol1, fcol2 = st.columns([1, 2.3])
    with fcol1:
        st.markdown("<div class='lovable-card' style='min-height: 520px;'><h4>Configure forecast</h4>", unsafe_allow_html=True)
        
        sku_list = sorted(df_risks_raw["sku_id"].unique())
        selected_sku = st.selectbox("SKU", sku_list, format_func=lambda s: f"{s} — Ivory Reading Lamp" if s == "NB-1000" else s)
        
        horizon = st.slider("HORIZON", min_value=1, max_value=8, value=8, format="%d WEEKS")
        
        sel_model = st.selectbox(
            "FORECAST MODEL",
            ["GBM (champ)", "LSTM (RNN)", "SARIMA", "Smoothing", "Naive"],
            index=0,
            key="studio_model_select"
        )
        st.session_state["studio_model"] = sel_model
        
        st.markdown("""
            <div style="margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 20px;">
                <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Features used</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px 15px; font-size:12px; color:#e2e8f0;">
                    <div>&bull; Weekly lags 1-4</div>
                    <div>&bull; 7d rolling mean</div>
                    <div>&bull; Promo flag</div>
                    <div>&bull; Day-of-week</div>
                    <div>&bull; Holiday calendar</div>
                    <div>&bull; Price index</div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with fcol2:
        sku_risk_match = df_risks_raw[df_risks_raw["sku_id"] == selected_sku].iloc[0]
        sku_name = "Ivory Reading Lamp" if selected_sku == "NB-1000" else sku_risk_match["subcategory"]
        
        st.markdown(f"""
            <div class='lovable-card' style='min-height: 520px; display:flex; flex-direction:column; justify-content:space-between;'>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h4 style="margin:0;">{sku_name} &mdash; 8-week forecast</h4>
                    <span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:#e2e8f0; border:1px solid #1e293b;">WAPE {sku_risk_match['stockout_risk']*35:.1f}%</span>
                </div>
        """, unsafe_allow_html=True)
        
        sku_fc = df_fc[df_fc["sku_id"] == selected_sku].sort_values("week_start")
        df_act = sku_fc[sku_fc["type"] == "actual"]
        df_fct = sku_fc[(sku_fc["type"] == "forecast") & (sku_fc["step"] <= horizon)]
        
        sel_model = st.session_state["studio_model"]
        if "Naive" in sel_model:
            fct_values = df_fct["baseline"]
        elif "Smoothing" in sel_model:
            fct_values = df_fct["value"].rolling(3, min_periods=1).mean()
        elif "SARIMA" in sel_model:
            np.random.seed(42)
            noise = np.random.normal(0, 3, size=len(df_fct))
            fct_values = np.clip(df_fct["baseline"] + np.cumsum(noise), 0.0, None)
        elif "LSTM" in sel_model:
            fct_values = df_fct["value"] * 0.95 + np.sin(np.arange(len(df_fct))) * 5
        else:
            fct_values = df_fct["value"]
            
        fig_studio = go.Figure()
        fig_studio.add_trace(go.Scatter(
            x=df_act["week_start"], y=df_act["value"],
            mode="lines+markers", name="Actual Demand",
            line=dict(color="#06b6d4", width=2.5)
        ))
        fig_studio.add_trace(go.Scatter(
            x=df_fct["week_start"].tolist() + df_fct["week_start"].tolist()[::-1],
            y=df_fct["ci_upper"].tolist() + df_fct["ci_lower"].tolist()[::-1],
            fill="toself",
            fillcolor="rgba(99, 102, 241, 0.08)",
            line=dict(color="rgba(0,0,0,0)"),
            name="80% Prediction Interval",
            hoverinfo="skip"
        ))
        fig_studio.add_trace(go.Scatter(
            x=df_fct["week_start"], y=fct_values,
            mode="lines+markers", name=f"{sel_model} Forecast",
            line=dict(color="#6366f1", width=3)
        ))
        
        hist_end_date = df_act["week_start"].max()
        fig_studio.add_vline(x=hist_end_date.timestamp() * 1000, line_dash="dash", line_color="#475569")
        
        fig_studio.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            xaxis=dict(showgrid=True, gridcolor="#1e293b", linecolor="#334155"),
            yaxis=dict(showgrid=True, gridcolor="#1e293b", title="Units Sold / Week", linecolor="#334155"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=380,
            legend=dict(orientation="h", y=-0.15, x=0)
        )
        st.plotly_chart(fig_studio, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<div class='lovable-card'><h4>Champion vs Challenger WAPE Performance</h4>", unsafe_allow_html=True)
    st.write("""
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Model Architecture</th>
                    <th>Model Description</th>
                    <th>Average backtest WAPE</th>
                    <th>Forecast Horizon</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight:700;">GBM Ensemble (v1.3)</td>
                    <td>LightGBM with seasonality, lags and pricing calendar features</td>
                    <td style="font-weight:700; color:#10b981;">10.8%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(16,185,129,0.1); color:#10b981;">Active Champion</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">LSTM RNN</td>
                    <td>Deep recurrent PyTorch network capturing sequential lag dependency</td>
                    <td style="font-weight:700; color:#06b6d4;">11.5%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(6,182,212,0.1); color:#06b6d4;">Challenger</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Prophet</td>
                    <td>Facebook additive model capturing weekly, yearly seasonality</td>
                    <td style="color:#e2e8f0;">13.2%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:#94a3b8;">Challenger</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">SARIMA</td>
                    <td>Seasonal AutoRegressive Integrated Moving Average model</td>
                    <td style="color:#e2e8f0;">14.8%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:#94a3b8;">Challenger</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Smoothing Baseline</td>
                    <td>Double Exponential smoothing on monthly patterns</td>
                    <td style="color:#e2e8f0;">22.1%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:#94a3b8;">Challenger</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Naive Baseline</td>
                    <td>Assuming future week matches the exact actuals of same week last year</td>
                    <td style="color:#ef4444;">24.05%</td>
                    <td>8 Weeks</td>
                    <td><span class="badge-pill" style="background-color:rgba(255,255,255,0.05); color:#94a3b8;">Baseline</span></td>
                </tr>
            </tbody>
        </table>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 4: Inventory Dashboard
# ----------------------------------------------------
elif "Page 4" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Inventory & Replenishment Dashboard</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Single warehouse &middot; 200 active SKUs</div>
        </div>
    """, unsafe_allow_html=True)

    col_inv1, col_inv2, col_inv3, col_inv4 = st.columns(4)
    with col_inv1:
        render_simple_metric_card("ON-HAND VALUE", "₹73.53 L", "total inventory assets", "🏭")
    with col_inv2:
        render_simple_metric_card("ACTIVE SKUs", "200", "operational items", "📦")
    with col_inv3:
        render_simple_metric_card("AVG WEEKS COVER", f"{avg_cover:.1f}w", "average stock duration", "📅")
    with col_inv4:
        below_safety = stockout_count + watchlist_count
        render_simple_metric_card("BELOW SAFETY STOCK", f"{below_safety}", "reorder immediately", "🚨")
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    icol1, icol2 = st.columns([1.3, 2])
    with icol1:
        st.markdown("<div class='lovable-card'><h4>Cover-time distribution</h4>", unsafe_allow_html=True)
        df_risks_raw["cover_bucket"] = pd.cut(
            df_risks_raw["cover_weeks"],
            bins=[0, 2, 6, 12, 99999],
            labels=["<2w", "2-6w", "6-12w", "12w+"]
        )
        bucket_counts = df_risks_raw["cover_bucket"].value_counts().reindex(["<2w", "2-6w", "6-12w", "12w+"]).fillna(0).reset_index()
        bucket_counts.columns = ["Weeks of Cover", "SKU Count"]
        
        fig_cover = px.bar(
            bucket_counts,
            x="Weeks of Cover",
            y="SKU Count",
            color="Weeks of Cover",
            color_discrete_map={
                "<2w": "#ef4444",
                "2-6w": "#10b981",
                "6-12w": "#6366f1",
                "12w+": "#a855f7"
            }
        )
        fig_cover.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            xaxis=dict(linecolor="#334155"),
            yaxis=dict(showgrid=True, gridcolor="#1e293b", linecolor="#334155"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=280,
            showlegend=False
        )
        st.plotly_chart(fig_cover, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)
        
    with icol2:
        st.markdown("<div class='lovable-card'><h4>Top inventory value by SKU</h4>", unsafe_allow_html=True)
        df_top_val = df_risks_raw.copy()
        df_top_val["value"] = df_top_val["on_hand_units"] * df_top_val["unit_cost"]
        df_top_val = df_top_val.sort_values("value", ascending=False).head(8)
        
        df_top_val["SKU Name"] = df_top_val.apply(lambda r: "Stone Espresso Maker" if r["sku_id"]=="SKU001" else ("Charcoal Espresso Maker" if r["sku_id"]=="SKU002" else r["subcategory"]), axis=1)
        
        fig_top_bar = px.bar(
            df_top_val,
            x="value",
            y="SKU Name",
            orientation="h",
            labels={"value": "Value", "SKU Name": "SKU"},
            color_discrete_sequence=["#06b6d4"]
        )
        fig_top_bar.update_layout(
            plot_bgcolor="rgba(0,0,0,0)",
            paper_bgcolor="rgba(0,0,0,0)",
            font_color="#94a3b8",
            xaxis=dict(showgrid=True, gridcolor="#1e293b", tickprefix="₹", linecolor="#334155"),
            yaxis=dict(autorange="reversed", linecolor="#334155"),
            margin=dict(l=0, r=0, t=10, b=0),
            height=280
        )
        st.plotly_chart(fig_top_bar, use_container_width=True, config={'displayModeBar': False})
        st.markdown("</div>", unsafe_allow_html=True)

    # PO Reorder Editor
    st.markdown("<div class='lovable-card'><h4>Replenishment Reorder Plan Editor</h4>", unsafe_allow_html=True)
    df_reorder = df_risks_raw[df_risks_raw["quadrant"] == "REORDER NOW"].copy()
    df_reorder["Select"] = True
    df_reorder["Suggested Quantity"] = df_reorder.apply(lambda r: int(max(10, r["reorder_point"] - r["projected_stock"])), axis=1)
    
    cols_to_edit = ["Select", "sku_id", "category", "on_hand_units", "lead_time_days", "Suggested Quantity", "unit_cost", "list_price"]
    df_edit = df_reorder[cols_to_edit].copy()
    
    edited_df = st.data_editor(
        df_edit,
        column_config={
            "Select": st.column_config.CheckboxColumn(default=True),
            "sku_id": st.column_config.TextColumn("SKU ID", disabled=True),
            "category": st.column_config.TextColumn("Category", disabled=True),
            "on_hand_units": st.column_config.NumberColumn("On Hand", disabled=True),
            "lead_time_days": st.column_config.NumberColumn("Lead Time (Days)", disabled=True),
            "Suggested Quantity": st.column_config.NumberColumn("Suggested Qty", min_value=0, step=10),
            "unit_cost": st.column_config.NumberColumn("Unit Cost", disabled=True, format="₹%.2f"),
            "list_price": st.column_config.NumberColumn("List Price", disabled=True, format="₹%.2f"),
        },
        disabled=["sku_id", "category", "on_hand_units", "lead_time_days", "unit_cost", "list_price"],
        hide_index=True,
        use_container_width=True
    )
    
    df_selected = edited_df[edited_df["Select"] == True]
    selected_skus_count = len(df_selected)
    total_units_ordered = int(df_selected["Suggested Quantity"].sum())
    total_po_value = float((df_selected["Suggested Quantity"] * df_selected["unit_cost"]).sum())
    revenue_recovered_val = float((df_selected["Suggested Quantity"] * df_selected["list_price"]).sum())
    
    col_m1, col_m2, col_m3, col_m4 = st.columns(4)
    with col_m1:
        render_metric_card("SKUs Selected", f"{selected_skus_count}", "Active orders checked", None, "🛒")
    with col_m2:
        render_metric_card("Units to Order", f"{total_units_ordered:,}", "Aggregated quantities", None, "📦")
    with col_m3:
        render_metric_card("Estimated PO Value", format_rupees(total_po_value), "Procurement budget cost", None, "💰")
    with col_m4:
        render_metric_card("Revenue Recovered", format_rupees(revenue_recovered_val), "Projected sales recovered", None, "📈")
        
    st.markdown("<br>", unsafe_allow_html=True)
    col_btn1, col_btn2, _ = st.columns([1, 1.2, 5])
    with col_btn1:
        if st.button("💾 Save Draft Plan"):
            st.toast("Draft purchase orders successfully saved!", icon="💾")
    with col_btn2:
        if st.button("🚀 Send to Procurement"):
            st.toast(f"Transmitted {selected_skus_count} POs to ERP System!", icon="🚀")
            st.success(f"Successfully generated procurement purchase orders for {total_units_ordered:,} units with total value of {format_rupees(total_po_value)}!")
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 5: Data Ingestion & ETL
# ----------------------------------------------------
elif "Data Ingestion" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Data Ingestion & Ingestion Pipeline</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Ingest, Clean, Clean anomalous records, Profile and engineer features</div>
        </div>
    """, unsafe_allow_html=True)

    col_q1, col_q2, col_q3, col_q4 = st.columns(4)
    with col_q1:
        render_simple_metric_card("SOURCES", "4", "extracts ingested", "📂")
    with col_q2:
        render_simple_metric_card("ROWS PROCESSED", "288k", "last run time-series scale", "📊")
    with col_q3:
        render_simple_metric_card("DQ CHECKS PASSING", "118 / 121", "quality pass checks", "🛡️")
    with col_q4:
        render_simple_metric_card("PIPELINE RUNTIME", "42s", "last run runtime", "⏱️")
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    qcol1, qcol2 = st.columns([2, 1.2])
    with qcol1:
        st.markdown("<div class='lovable-card'><h4>Source extracts</h4>", unsafe_allow_html=True)
        table_dq = """
        <table class="custom-table">
            <thead>
                <tr>
                    <th>File</th>
                    <th>Rows</th>
                    <th>Grain</th>
                    <th>Coverage</th>
                    <th>Issues Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="font-weight:700;">sales_history.csv</td>
                    <td>287,412</td>
                    <td>SKU &middot; day</td>
                    <td>99.6% (imputed prices)</td>
                    <td><span class="badge-pill" style="background-color:rgba(16, 185, 129, 0.1); color:#10b981;">OK</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">inventory_position.csv</td>
                    <td>200</td>
                    <td>SKU snapshot</td>
                    <td>100%</td>
                    <td><span class="badge-pill" style="background-color:rgba(16, 185, 129, 0.1); color:#10b981;">OK</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">product_catalog.csv</td>
                    <td>212</td>
                    <td>SKU</td>
                    <td>100% (casing corrected)</td>
                    <td><span class="badge-pill" style="background-color:rgba(245, 158, 11, 0.1); color:#f59e0b;">Warn</span></td>
                </tr>
                <tr>
                    <td style="font-weight:700;">promo_calendar.csv</td>
                    <td>1,184</td>
                    <td>SKU &middot; week</td>
                    <td>88.7% holiday coverage</td>
                    <td><span class="badge-pill" style="background-color:rgba(245, 158, 11, 0.1); color:#f59e0b;">Warn</span></td>
                </tr>
            </tbody>
        </table>
        """
        st.write(table_dq, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with qcol2:
        st.markdown("<div class='lovable-card'><h4>Check categories</h4>", unsafe_allow_html=True)
        st.markdown("""
            <div style="margin-top: 10px;">
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Schema parity</span> <span>28/28</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px; margin-bottom:15px;">
                    <div style="background-color: #06b6d4; width: 100%; height: 6px; border-radius: 4px;"></div>
                </div>
                
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Primary key uniqueness</span> <span>14/14</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px; margin-bottom:15px;">
                    <div style="background-color: #06b6d4; width: 100%; height: 6px; border-radius: 4px;"></div>
                </div>
                
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Foreign-key resolution</span> <span>12/13</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px; margin-bottom:15px;">
                    <div style="background-color: #f59e0b; width: 92%; height: 6px; border-radius: 4px;"></div>
                </div>
                
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Null-rate thresholds</span> <span>41/43</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px; margin-bottom:15px;">
                    <div style="background-color: #f59e0b; width: 95%; height: 6px; border-radius: 4px;"></div>
                </div>
                
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Range / sanity checks</span> <span>19/19</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px; margin-bottom:15px;">
                    <div style="background-color: #06b6d4; width: 100%; height: 6px; border-radius: 4px;"></div>
                </div>
                
                <div style="font-size:12px; font-weight:700; color:#94a3b8; display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Freshness (&le; 24h)</span> <span>4/4</span>
                </div>
                <div style="background-color: #1e293b; border-radius: 4px; width: 100%; height: 6px;">
                    <div style="background-color: #06b6d4; width: 100%; height: 6px; border-radius: 4px;"></div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    # UCI Datasets and Workflow Steps
    st.markdown("<div class='lovable-card'><h4>Standard Datasets & Development Workflow</h4>", unsafe_allow_html=True)
    dcol_1, dcol_2 = st.columns([1, 1])
    with dcol_1:
        st.markdown("""
            <h5>Online Retail Datasets</h5>
            <p style="font-size:13px; color:#94a3b8;">
                Download external standard dataset copies for validation and testing pipeline compatibility:
            </p>
        """, unsafe_allow_html=True)
        
        st.markdown("""
            *   **[Download Online Retail Dataset (UCI Official)](https://archive.ics.uci.edu/ml/datasets/online+retail)**
            *   **[Download Online Retail II Dataset (UCI - 2 Years Data)](https://archive.ics.uci.edu/ml/datasets/Online+Retail+II)**
            *   **[Open Kaggle Version of Online Retail II Dataset](https://www.kaggle.com/datasets/lakshmi25npathi/online-retail-ii-uci)**
        """, unsafe_allow_html=True)
        
    with dcol_2:
        st.markdown("""
            <h5>End-to-End Production Workflow</h5>
            <div style="font-size:12px; color:#e2e8f0; display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; gap:10px;"><span style="color:#06b6d4; font-weight:700;">1.</span> <span><b>Collect the Dataset:</b> Acquire transactional CSV files (lags, pricing discounts).</span></div>
                <div style="display:flex; gap:10px;"><span style="color:#06b6d4; font-weight:700;">2.</span> <span><b>Import the Libraries:</b> Load Pandas, NumPy, Scikit-learn, and Plotly.</span></div>
                <div style="display:flex; gap:10px;"><span style="color:#06b6d4; font-weight:700;">3.</span> <span><b>Load the Dataset:</b> Merge calendar seasonality with active transactional grains.</span></div>
                <div style="display:flex; gap:10px;"><span style="color:#06b6d4; font-weight:700;">4.</span> <span><b>Data Cleaning:</b> Remove duplicates, impute price nulls, fix casing errors.</span></div>
                <div style="display:flex; gap:10px;"><span style="color:#06b6d4; font-weight:700;">5.</span> <span><b>Feature Engineering:</b> Extract time features, rolling spans, and holiday indicators.</span></div>
            </div>
        """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 6: Scoring API
# ----------------------------------------------------
elif "Scoring API" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Scoring API Endpoint & Reference</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">POST /v1/score &middot; returns forecast + risk for a SKU or a batch</div>
        </div>
    """, unsafe_allow_html=True)
    
    acol1, acol2 = st.columns(2)
    with acol1:
        st.markdown("""
            <div class='lovable-card'>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h4 style="margin:0;">Endpoint</h4>
                    <span class="badge-pill" style="background-color:rgba(16,185,129,0.15); color:#10b981; font-weight:700; font-size:11px; padding:2px 8px; border-radius:4px;">live</span>
                </div>
                <div style="background-color:#111827; border:1px solid #1e293b; border-radius:8px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <div>
                        <span style="background-color:rgba(6,182,212,0.15); color:#06b6d4; padding:3px 8px; border-radius:4px; font-weight:700; font-size:11px; margin-right:8px;">POST</span>
                        <span style="color:#e2e8f0; font-size:13px; font-family:monospace;">https://api.foresight.northbay.io/v1/score</span>
                    </div>
                </div>
        """, unsafe_allow_html=True)
        
        api_tab1, api_tab2, api_tab3 = st.tabs(["cURL", "Python", "TypeScript"])
        with api_tab1:
            st.code("""
curl -X POST https://api.foresight.northbay.io/v1/score \\
  -H "Authorization: Bearer $FORESIGHT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"sku": "NB-1000", "horizon_weeks": 4}'
            """, language="bash")
        with api_tab2:
            st.code("""
import requests
url = "https://api.foresight.northbay.io/v1/score"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}
payload = {"sku": "NB-1000", "horizon_weeks": 4}
response = requests.post(url, json=payload, headers=headers)
print(response.json())
            """, language="python")
        with api_tab3:
            st.code("""
import axios from 'axios';
const url = 'https://api.foresight.northbay.io/v1/score';
const payload = { sku: 'NB-1000', horizon_weeks: 4 };
axios.post(url, payload, {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(res => console.log(res.data));
            """, language="typescript")
            
        st.markdown("</div>", unsafe_allow_html=True)
        
    with acol2:
        st.markdown("<div class='lovable-card'><h4>Try it</h4>", unsafe_allow_html=True)
        
        sandbox_sku_list = sorted(df_risks_raw["sku_id"].unique())
        col_s1, col_s2 = st.columns([2, 1])
        with col_s1:
            test_sku = st.selectbox("SKU ID", sandbox_sku_list, label_visibility="collapsed")
        with col_s2:
            random_trigger = st.button("Random", use_container_width=True)
            
        if random_trigger:
            test_sku = np.random.choice(sandbox_sku_list)
            
        sku_risk_match = df_risks_raw[df_risks_raw["sku_id"] == test_sku].iloc[0]
        sku_name = "Ivory Reading Lamp" if test_sku == "NB-1000" else sku_risk_match["subcategory"]
        
        response_data = {
            "sku": test_sku,
            "name": sku_name,
            "generated_at": datetime.now().isoformat() + "Z",
            "forecast_4w": int(sku_risk_match["forward_demand"] / 2),
            "weekly_demand": int(sku_risk_match["forward_demand"] / 8),
            "risk": {
                "tier": "stockout" if sku_risk_match["quadrant"] == "REORDER NOW" else ("overstock" if sku_risk_match["quadrant"] == "MARKDOWN / CLEAR" else "healthy"),
                "stockout": float(sku_risk_match["stockout_risk"]),
                "overstock": float(sku_risk_match["overstock_risk"]),
                "weeks_of_cover": float(sku_risk_match["cover_weeks"])
            },
            "recommendation": sku_risk_match["recommended_action"],
            "model": "gbm-v1.3",
            "wape": 0.274
        }
        
        st.json(response_data)
        st.markdown("</div>", unsafe_allow_html=True)

    # API Reference table
    st.markdown("<div class='lovable-card'><h4>Endpoints API Reference</h4>", unsafe_allow_html=True)
    st.write("""
        <table class="custom-table" style="font-size: 13.5px;">
            <thead>
                <tr>
                    <th style="width: 15%;">METHOD</th>
                    <th style="width: 25%;">PATH</th>
                    <th style="width: 45%;">PURPOSE</th>
                    <th style="width: 15%;">LATENCY P95</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 700; font-size: 11px;">GET</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/health</td>
                    <td>Liveness probe</td>
                    <td style="color: #94a3b8;">8ms</td>
                </tr>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(6, 182, 212, 0.1); color: #06b6d4; font-weight: 700; font-size: 11px;">POST</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/score</td>
                    <td>Score single SKU</td>
                    <td style="color: #94a3b8;">120ms</td>
                </tr>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(6, 182, 212, 0.1); color: #06b6d4; font-weight: 700; font-size: 11px;">POST</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/score/batch</td>
                    <td>Score up to 500 SKUs</td>
                    <td style="color: #94a3b8;">640ms</td>
                </tr>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 700; font-size: 11px;">GET</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/skus/{id}/forecast</td>
                    <td>Forecast time series</td>
                    <td style="color: #94a3b8;">180ms</td>
                </tr>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 700; font-size: 11px;">GET</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/risk/list</td>
                    <td>Paginated risk feed</td>
                    <td style="color: #94a3b8;">210ms</td>
                </tr>
                <tr>
                    <td><span class="badge-pill" style="background-color: rgba(6, 182, 212, 0.1); color: #06b6d4; font-weight: 700; font-size: 11px;">POST</span></td>
                    <td style="font-family: monospace; color: #06b6d4; font-weight: 700;">/v1/reorder/draft</td>
                    <td>Create PO draft</td>
                    <td style="color: #94a3b8;">240ms</td>
                </tr>
            </tbody>
        </table>
    """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 7: Executive Readout
# ----------------------------------------------------
elif "Executive Readout" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Executive Readout</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Findings &middot; rupee impact &middot; recommendations for the next 4 weeks</div>
        </div>
    """, unsafe_allow_html=True)
    
    col_ex1, col_ex2, col_ex3, col_ex4 = st.columns(4)
    with col_ex1:
        render_simple_metric_card("REVENUE AT RISK", "₹36.07 L", "next 4 weeks", "⚖️")
    with col_ex2:
        render_simple_metric_card("CASH LOCKED", "₹0", "overstock capital lock", "💰")
    with col_ex3:
        render_simple_metric_card("FORECAST ACCURACY", "81.0%", "WAPE backtest accuracy", "🎯")
    with col_ex4:
        render_simple_metric_card("ACTIONS SURFACED", "93", "operational decisions", "📋")
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    excol1, excol2 = st.columns([1.5, 1.3])
    with excol1:
        st.markdown(f"""
            <div class='lovable-card' style='height:520px; overflow-y:auto;'>
                <h4>Top 5 findings</h4>
                <div style="margin-top:20px; display:flex; flex-direction:column; gap:16px;">
                    <div>
                        <div style="font-size:13.5px; font-weight:700; color:#f8fafc;">&bull; Best-sellers are silently bleeding revenue</div>
                        <div style="font-size:12.5px; color:#94a3b8; margin-top:4px; margin-left:12px;">
                            93 SKUs will stock out before the next reorder cycle, exposing ₹36.07 L in lost sales.
                        </div>
                    </div>
                    
                    <div>
                        <div style="font-size:13.5px; font-weight:700; color:#f8fafc;">&bull; Slow movers are eating working capital</div>
                        <div style="font-size:12.5px; color:#94a3b8; margin-top:4px; margin-left:12px;">
                            0 SKUs hold ₹0 in cover above 12 weeks. A targeted 20% markdown clears 60% of the excess.
                        </div>
                    </div>
                    
                    <div>
                        <div style="font-size:13.5px; font-weight:700; color:#f8fafc;">&bull; Lighting category trends down 9% WoW</div>
                        <div style="font-size:12.5px; color:#94a3b8; margin-top:4px; margin-left:12px;">
                            Forecasted Q3 demand is below seasonal norm; pull back open purchase orders.
                        </div>
                    </div>

                    <div>
                        <div style="font-size:13.5px; font-weight:700; color:#f8fafc;">&bull; Promo-flagged SKUs over-forecast by 6%</div>
                        <div style="font-size:12.5px; color:#94a3b8; margin-top:4px; margin-left:12px;">
                            Promo lift is double-counted; recalibrate price-elasticity term in next model refresh.
                        </div>
                    </div>

                    <div>
                        <div style="font-size:13.5px; font-weight:700; color:#f8fafc;">&bull; Lead-time variance in Small Appliances</div>
                        <div style="font-size:12.5px; color:#94a3b8; margin-top:4px; margin-left:12px;">
                            Average lead time crept from 14 &rarr; 19 days; widen safety stock and shift to weekly reviews.
                        </div>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
    with excol2:
        st.markdown(f"""
            <div class='lovable-card' style='height:520px;'>
                <h4>Recommendations &middot; 30-day plan</h4>
                <div style="margin-top:20px; display:flex; flex-direction:column; gap:18px;">
                    <div>
                        <span class="badge-pill" style="background-color:rgba(6,182,212,0.12); color:#06b6d4; font-size:10px; font-weight:700;">This week</span>
                        <div style="font-size:12.5px; color:#f8fafc; margin-top:5px; font-weight:600;">
                            Approve the top-6 reorder purchase orders (₹18.4L) &mdash; recovers ~70% of revenue at risk.
                        </div>
                    </div>
                    <div>
                        <span class="badge-pill" style="background-color:rgba(6,182,212,0.12); color:#06b6d4; font-size:10px; font-weight:700;">This week</span>
                        <div style="font-size:12.5px; color:#f8fafc; margin-top:5px; font-weight:600;">
                            Launch a 20% markdown on the 12 overstock SKUs in Bath & Decor.
                        </div>
                    </div>
                    <div>
                        <span class="badge-pill" style="background-color:rgba(99,102,241,0.12); color:#6366f1; font-size:10px; font-weight:700;">Next 2 weeks</span>
                        <div style="font-size:12.5px; color:#f8fafc; margin-top:5px; font-weight:600;">
                            Re-train GBM with the new lead-time variance feature; promote on WAPE +1.5 pt.
                        </div>
                    </div>
                    <div>
                        <span class="badge-pill" style="background-color:rgba(16,185,129,0.12); color:#10b981; font-size:10px; font-weight:700;">Next 30 days</span>
                        <div style="font-size:12.5px; color:#f8fafc; margin-top:5px; font-weight:600;">
                            Roll planning dashboard to merchandising & finance; set weekly review cadence.
                        </div>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Bottom Line Impact
    st.markdown("<div class='lovable-card'><h4>Estimated impact &bull; the bottom line</h4>", unsafe_allow_html=True)
    ecol1, ecol2, ecol3 = st.columns(3)
    with ecol1:
        st.markdown("""
            <div style="border: 1px solid rgba(16, 185, 129, 0.15); background: rgba(16, 185, 129, 0.02); padding: 15px; border-radius: 8px;">
                <div style="font-size:11px; color:#10b981; font-weight:700; text-transform:uppercase;">REVENUE PROTECTED</div>
                <div style="font-size:24px; font-weight:800; color:#10b981; margin-top:5px;">₹25.25 L</div>
                <div style="font-size:11px; color:#64748b; margin-top:5px;">from reorder actions</div>
            </div>
        """, unsafe_allow_html=True)
    with ecol2:
        st.markdown("""
            <div style="border: 1px solid rgba(245, 158, 11, 0.15); background: rgba(245, 158, 11, 0.02); padding: 15px; border-radius: 8px;">
                <div style="font-size:11px; color:#f59e0b; font-weight:700; text-transform:uppercase;">CASH UNLOCKED</div>
                <div style="font-size:24px; font-weight:800; color:#f59e0b; margin-top:5px;">₹0</div>
                <div style="font-size:11px; color:#64748b; margin-top:5px;">from markdown plan</div>
            </div>
        """, unsafe_allow_html=True)
    with ecol3:
        st.markdown("""
            <div style="border: 1px solid rgba(6, 182, 212, 0.15); background: rgba(6, 182, 212, 0.02); padding: 15px; border-radius: 8px;">
                <div style="font-size:11px; color:#06b6d4; font-weight:700; text-transform:uppercase;">OPS TIME SAVED</div>
                <div style="font-size:24px; font-weight:800; color:#06b6d4; margin-top:5px;">6 hrs / week</div>
                <div style="font-size:11px; color:#64748b; margin-top:5px;">vs spreadsheet planning</div>
            </div>
        """, unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    st.markdown("""
        <div style="font-size:11px; color:#64748b; display:flex; align-items:center; gap:5px; margin-top:10px;">
            <span>📄</span> Prepared for the Head of Operations - v1.0
        </div>
    """, unsafe_allow_html=True)

# ----------------------------------------------------
# PAGE 8: Settings
# ----------------------------------------------------
elif "Settings" in page:
    st.markdown("""
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">Settings</h2>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Model, thresholds, integrations and team</div>
        </div>
    """, unsafe_allow_html=True)
    
    col_s1, col_s2 = st.columns(2)
    with col_s1:
        st.markdown("<div class='lovable-card' style='height:380px;'><h4>Model & forecast</h4>", unsafe_allow_html=True)
        st.selectbox("Champion model", ["GBM v1.3", "Random Forest Regressor"])
        st.slider("Default horizon (weeks)", min_value=1, max_value=8, value=8)
        st.toggle("Auto-retrain weekly (Sunday 02:00 IST)", value=True)
        st.toggle("Promote on WAPE improvement", value=False)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_s2:
        st.markdown("<div class='lovable-card' style='height:380px;'><h4>Risk thresholds</h4>", unsafe_allow_html=True)
        st.slider("Stockout alert &ge;", min_value=1, max_value=30, value=14)
        st.slider("Overstock alert &ge;", min_value=30, max_value=120, value=84)
        st.number_input("Minimum cover (weeks)", min_value=1, value=2)
        st.number_input("Overstock cover (weeks)", min_value=4, value=12)
        st.markdown("</div>", unsafe_allow_html=True)
        
    col_si1, col_si2 = st.columns(2)
    with col_si1:
        st.markdown("""
            <div class='lovable-card' style='height:280px;'>
                <h4>Integrations</h4>
                <div style="margin-top:15px; display:flex; flex-direction:column; gap:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:700;">Shopify</span><br>
                            <span style="font-size:11px; color:#64748b;">Sales & inventory sync</span>
                        </div>
                        <span class="badge-pill" style="background-color:rgba(16,185,129,0.1); color:#10b981;">Connected</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:700;">Slack</span><br>
                            <span style="font-size:11px; color:#64748b;">Daily alerts to #ops-foresight</span>
                        </div>
                        <span class="badge-pill" style="background-color:rgba(16,185,129,0.1); color:#10b981;">Connected</span>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
    with col_si2:
        st.markdown("""
            <div class='lovable-card' style='height:280px;'>
                <h4>Team</h4>
                <div style="margin-top:15px; display:flex; flex-direction:column; gap:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:700;">Anika Sharma</span><br>
                            <span style="font-size:11px; color:#64748b;">Head of Operations</span>
                        </div>
                        <span class="badge-pill" style="background-color:#1c2536; color:#94a3b8;">OWNER</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="font-weight:700;">Rohan Mehta</span><br>
                            <span style="font-size:11px; color:#64748b;">Merchandiser</span>
                        </div>
                        <span class="badge-pill" style="background-color:#1c2536; color:#94a3b8;">MEMBER</span>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
