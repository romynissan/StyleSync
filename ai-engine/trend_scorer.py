"""Aggregate cleaned trends into category-level scores."""

from __future__ import annotations

import pandas as pd

KEYWORD_CATEGORY_MAP = {
    "align legging": "Activewear",
    "dri-fit": "Activewear",
    "belt bag": "Accessories",
    "puffer jacket": "Outerwear",
    "cashmere coat": "Outerwear",
    "air max": "Footwear",
}


def calculate_trend_scores(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["category", "trend_score", "recorded_at"])

    scored = df.copy()
    scored["category"] = scored["keyword"].map(KEYWORD_CATEGORY_MAP).fillna("Loungewear")

    weekly = (
        scored.assign(week=scored["recorded_at"].dt.to_period("W").dt.start_time)
        .groupby(["category", "week"], as_index=False)
        .agg(trend_score=("trend_score", "mean"))
        .rename(columns={"week": "recorded_at"})
    )
    weekly["trend_score"] = weekly["trend_score"].round(2)
    return weekly
