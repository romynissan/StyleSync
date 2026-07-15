"""Train a lightweight demand forecasting model."""

from __future__ import annotations

from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

from config import HORIZON_DAYS


def _build_training_frame(trends: pd.DataFrame, sku: str, category: str) -> pd.DataFrame:
    if trends.empty:
        base = 3.0
    else:
        cat_rows = trends[trends["category"] == category]
        base = float(cat_rows["trend_score"].tail(4).mean() / 20) if not cat_rows.empty else 3.0

    rng = np.random.default_rng(abs(hash(sku)) % (2**32))
    days = 60
    dates = [datetime.utcnow().date() - timedelta(days=d) for d in range(days, 0, -1)]
    demand = np.maximum(1, (base + rng.normal(0, 0.6, size=days)).round().astype(int))

    return pd.DataFrame({"date": dates, "demand": demand})


def train_and_predict(
    sku: str,
    category: str,
    trends: pd.DataFrame,
    horizon_days: int = HORIZON_DAYS,
) -> list[dict]:
    train = _build_training_frame(trends, sku, category)
    train = train.sort_values("date")
    train["day_index"] = np.arange(len(train))

    model = Ridge(alpha=1.0)
    model.fit(train[["day_index"]], train["demand"])

    last_index = int(train["day_index"].max())
    future_dates = [
        datetime.utcnow().date() + timedelta(days=d) for d in range(1, horizon_days + 1)
    ]
    future_index = np.arange(last_index + 1, last_index + horizon_days + 1).reshape(-1, 1)
    preds = np.maximum(1, model.predict(future_index).round().astype(int))

    residuals = train["demand"] - model.predict(train[["day_index"]])
    std = float(np.std(residuals)) if len(residuals) else 1.0
    confidence = max(0.65, min(0.95, 1 - (std / (train["demand"].mean() + 1)) * 0.35))

    return [
        {
            "date": d.isoformat(),
            "predicted_demand": int(p),
            "confidence": round(confidence, 3),
        }
        for d, p in zip(future_dates, preds, strict=True)
    ]
