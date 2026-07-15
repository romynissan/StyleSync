"""Simulate fashion trend data collection (scraping-ready structure)."""

from __future__ import annotations

import random
from datetime import datetime, timedelta

import pandas as pd
import requests
from bs4 import BeautifulSoup

from config import TREND_SOURCES

# Representative apparel search terms for simulated trend signals
FASHION_KEYWORDS = [
    "align legging",
    "belt bag",
    "puffer jacket",
    "air max",
    "cashmere coat",
    "dri-fit",
]


def _simulate_keyword_interest(keyword: str, day_offset: int) -> float:
    """Deterministic pseudo-trend score from keyword + day."""
    seed = hash(f"{keyword}:{day_offset}") % 10_000
    rng = random.Random(seed)
    seasonal = 1 + 0.12 * ((day_offset % 14) / 14)
    return round(rng.uniform(45, 92) * seasonal, 2)


def scrape_public_signals() -> pd.DataFrame:
    """
    Attempt a lightweight public fetch; fall back to simulated rows.
    Keeps the same interface a real scraper would use in production.
    """
    rows: list[dict] = []

    try:
        response = requests.get(
            "https://en.wikipedia.org/wiki/High_street_fashion",
            timeout=5,
            headers={"User-Agent": "FashionInventoryBot/1.0"},
        )
        if response.ok:
            soup = BeautifulSoup(response.text, "html.parser")
            title = soup.title.string if soup.title else "fashion"
            base_score = min(95, 60 + len(title) % 30)
            rows.append(
                {
                    "source": "web_scrape",
                    "keyword": "high_street_fashion",
                    "trend_score": float(base_score),
                    "recorded_at": datetime.utcnow().isoformat(),
                }
            )
    except requests.RequestException:
        pass

    for day in range(56, -1, -7):
        recorded_at = (datetime.utcnow() - timedelta(days=day)).isoformat()
        for keyword in FASHION_KEYWORDS:
            rows.append(
                {
                    "source": TREND_SOURCES[day % len(TREND_SOURCES)],
                    "keyword": keyword,
                    "trend_score": _simulate_keyword_interest(keyword, day),
                    "recorded_at": recorded_at,
                }
            )

    return pd.DataFrame(rows)
