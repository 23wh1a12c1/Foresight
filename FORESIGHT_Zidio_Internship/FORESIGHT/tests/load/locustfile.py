
from locust import HttpUser, task, between

# ============================================================
# LOAD TEST USER
# ============================================================

class RetailPulseUser(HttpUser):

    wait_time = between(2, 6)

    # ========================================================
    # OVERVIEW PAGE
    # ========================================================

    @task(3)

    def overview(self):

        self.client.get("/")

    # ========================================================
    # FORECASTING PAGE
    # ========================================================

    @task(2)

    def forecast_page(self):

        self.client.get("/?page=Forecasting")

    # ========================================================
    # INVENTORY PAGE
    # ========================================================

    @task(1)

    def inventory_page(self):

        self.client.get("/?page=Inventory")
