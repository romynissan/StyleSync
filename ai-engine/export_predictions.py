"""Export pipeline artifacts as JSON for the Next.js backend."""

from __future__ import annotations

import json
from datetime import datetime

import pandas as pd

from config import OUTPUT_DIR, PREDICTIONS_FILE, TRENDS_FILE


def export_json(
    predictions: list[dict],
    trends: pd.DataFrame,
) -> tuple[str, str]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "horizon_days": 30,
        "products": predictions,
    }

    trends_payload = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "rows": trends.to_dict(orient="records"),
    }

    for row in trends_payload["rows"]:
        if hasattr(row.get("recorded_at"), "isoformat"):
            row["recorded_at"] = row["recorded_at"].isoformat()

    PREDICTIONS_FILE.write_text(json.dumps(payload, indent=2))
    TRENDS_FILE.write_text(json.dumps(trends_payload, indent=2))

    return str(PREDICTIONS_FILE), str(TRENDS_FILE)
