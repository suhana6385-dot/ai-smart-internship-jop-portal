"""
utils/logger.py
================
Purpose:
    Centralized logging configuration for the entire microservice using
    Loguru. Every module imports `logger` from here instead of creating
    its own logger, guaranteeing consistent formatting, log levels and
    file rotation across the whole codebase.

Architecture:
    Configured once at import time. Adds two sinks:
        1. stderr  - human readable, colourized, for local development.
        2. rotating file sink - JSON-free plain text, rotated daily and
           retained for 14 days, for production debugging.

Usage Example:
    from utils.logger import logger
    logger.info("Resume parsed successfully")
    logger.error(f"Failed to parse resume: {exc}")
"""

from __future__ import annotations

import sys
from pathlib import Path

from loguru import logger

from utils.config import settings

# Remove default handler to avoid duplicate console output.
logger.remove()

# --- Console sink (human friendly, colourized) ---
logger.add(
    sys.stderr,
    level=settings.LOG_LEVEL,
    format=(
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    ),
    backtrace=False,
    diagnose=False,
)

# --- File sink (rotating, for production/debugging) ---
log_path = Path(settings.LOG_FILE)
log_path.parent.mkdir(parents=True, exist_ok=True)

logger.add(
    str(log_path),
    level=settings.LOG_LEVEL,
    rotation="1 day",
    retention="14 days",
    compression="zip",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    backtrace=False,
    diagnose=False,
    enqueue=True,
)

logger.info(f"Logger initialized for '{settings.APP_NAME}' [{settings.APP_ENV}]")

__all__ = ["logger"]
