
from fastapi import FastAPI
from prometheus_client import Gauge, generate_latest
from fastapi.responses import Response
import random

app = FastAPI()

# ============================================================
# PROMETHEUS METRICS
# ============================================================

forecast_mape = Gauge(
    'forecast_mape',
    'Forecast model MAPE'
)

churn_auc = Gauge(
    'churn_auc',
    'Churn model AUC'
)

drift_score = Gauge(
    'drift_score',
    'Current drift score'
)

stockout_rate = Gauge(
    'stockout_rate',
    'Stockout percentage'
)

# ============================================================
# METRICS ENDPOINT
# ============================================================

@app.get("/metrics")

def metrics():

    # --------------------------------------------------------
    # MOCK VALUES
    # --------------------------------------------------------

    forecast_mape.set(
        round(random.uniform(4.0, 6.0), 2)
    )

    churn_auc.set(
        round(random.uniform(0.90, 0.96), 2)
    )

    drift_score.set(
        round(random.uniform(0.05, 0.40), 2)
    )

    stockout_rate.set(
        round(random.uniform(10, 35), 2)
    )

    return Response(

        generate_latest(),

        media_type="text/plain"

    )
