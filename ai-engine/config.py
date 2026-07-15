"""Shared paths and constants for the AI prediction engine."""

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT_DIR / "output"
PREDICTIONS_FILE = OUTPUT_DIR / "predictions.json"
TRENDS_FILE = OUTPUT_DIR / "trends.json"

HORIZON_DAYS = 30
TREND_SOURCES = ("social_scrape", "search_index", "runway_signals")
