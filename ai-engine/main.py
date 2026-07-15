#!/usr/bin/env python3
"""Fashion Inventory Forecast — AI prediction pipeline entry point."""

from __future__ import annotations

import json
import sys
from pathlib import Path

# Allow running as script from repo root or ai-engine/
sys.path.insert(0, str(Path(__file__).resolve().parent))

from data_cleaner import clean_trend_data
from export_predictions import export_json
from forecast_model import train_and_predict
from trend_scraper import scrape_public_signals
from trend_scorer import calculate_trend_scores

# Product catalog mirror for offline inference (synced with seed SKUs)
PRODUCTS = [
    {"sku": "LL-ALIGN-25-BLK-M", "category": "Activewear"},
    {"sku": "LL-SWIFT-SEA-M", "category": "Activewear"},
    {"sku": "AR-WL-COAT-BLK-S", "category": "Outerwear"},
    {"sku": "NK-AM90-WHT-10", "category": "Footwear"},
    {"sku": "NK-DRI-FIT-L-BLU", "category": "Activewear"},
    {"sku": "EL-ANR-WL-30ML", "category": "Beauty"},
    {"sku": "SH-HOOD-GRY-M", "category": "Loungewear"},
    {"sku": "AZ-BLAZ-NAV-6", "category": "Outerwear"},
    {"sku": "LL-EBB-BLK-O/S", "category": "Accessories"},
    {"sku": "NK-TECH-FLEECE-M", "category": "Loungewear"},
    {"sku": "LL-DEFINE-JCK-PNK-S", "category": "Activewear"},
    {"sku": "AR-CONDOR-BLK-4", "category": "Outerwear"},
]


def main() -> None:
    print("Collecting trend signals...")
    raw = scrape_public_signals()

    print("Cleaning data...")
    cleaned = clean_trend_data(raw)

    print("Calculating trend scores...")
    trends = calculate_trend_scores(cleaned)

    print("Training forecasting models...")
    product_predictions = []
    for product in PRODUCTS:
        series = train_and_predict(product["sku"], product["category"], trends)
        product_predictions.append(
            {
                "sku": product["sku"],
                "category": product["category"],
                "series": series,
            }
        )

    print("Exporting JSON...")
    pred_path, trend_path = export_json(product_predictions, trends)
    print(json.dumps({"predictions": pred_path, "trends": trend_path}))


if __name__ == "__main__":
    main()
