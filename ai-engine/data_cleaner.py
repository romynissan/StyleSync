"""Clean and normalize raw trend signals."""

from __future__ import annotations

import pandas as pd


def clean_trend_data(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df

    cleaned = df.copy()
    cleaned["trend_score"] = pd.to_numeric(cleaned["trend_score"], errors="coerce")
    cleaned = cleaned.dropna(subset=["trend_score"])
    cleaned["trend_score"] = cleaned["trend_score"].clip(0, 100)
    cleaned["keyword"] = cleaned["keyword"].str.strip().str.lower()
    cleaned["recorded_at"] = pd.to_datetime(cleaned["recorded_at"], utc=True)
    cleaned = cleaned.drop_duplicates(
        subset=["source", "keyword", "recorded_at"], keep="last"
    )
    return cleaned.sort_values("recorded_at")
