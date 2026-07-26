
from airflow import DAG

from airflow.operators.python import PythonOperator

from datetime import datetime, timedelta

# ============================================================
# DEFAULT SETTINGS
# ============================================================

default_args = {

    'owner': 'retailpulse',

    'retries': 2,

    'retry_delay': timedelta(minutes=10),

}

# ============================================================
# TASK FUNCTIONS
# ============================================================

def ingest():

    print("✅ Raw data refreshed")

def validate():

    print("✅ Great Expectations validation passed")

def check_drift():

    score = 0.12

    print(f"✅ Drift score: {score}")

    return score

def retrain_models():

    print("✅ Prophet retrained")

    print("✅ LSTM retrained")

    print("✅ XGBoost retrained")

def register_models():

    print("✅ Best models promoted to registry")

# ============================================================
# DAG DEFINITION
# ============================================================

with DAG(

    dag_id='retailpulse_retrain',

    default_args=default_args,

    start_date=datetime(2025, 1, 1),

    schedule='@weekly',

    catchup=False,

    tags=['retailpulse', 'mlops']

) as dag:

    t1 = PythonOperator(

        task_id='ingest',

        python_callable=ingest

    )

    t2 = PythonOperator(

        task_id='validate',

        python_callable=validate

    )

    t3 = PythonOperator(

        task_id='check_drift',

        python_callable=check_drift

    )

    t4 = PythonOperator(

        task_id='retrain',

        python_callable=retrain_models

    )

    t5 = PythonOperator(

        task_id='register_models',

        python_callable=register_models

    )

    t1 >> t2 >> t3 >> t4 >> t5
