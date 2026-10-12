"""
utils/config.py
================
Purpose:
    Centralized application configuration loaded once from environment
    variables / .env file using pydantic-settings. Every other module
    that needs a config value (CORS origins, upload limits, Mongo URI,
    log level, etc.) imports the singleton `settings` object from here
    instead of calling os.getenv() directly.

Architecture:
    A single Pydantic BaseSettings subclass. Instantiated once as a
    module-level singleton (`settings`) so it is loaded and validated
    exactly once at process startup and reused everywhere (no repeated
    file/env parsing).

Usage Example:
    from utils.config import settings
    print(settings.APP_PORT)
"""

from __future__ import annotations

from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application-wide configuration.

    Attributes:
        APP_NAME: Human readable name of the service.
        APP_ENV: Deployment environment (development/staging/production).
        APP_HOST: Host interface uvicorn binds to.
        APP_PORT: Port uvicorn binds to.
        DEBUG: Toggles verbose error responses / auto-reload behaviour.
        CORS_ORIGINS: Raw comma separated origins string from env.
        MONGO_URI: Connection string for MongoDB (optional persistence).
        MONGO_DB_NAME: Database name used inside MongoDB.
        MAX_UPLOAD_SIZE_MB: Maximum allowed resume upload size in MB.
        ALLOWED_RESUME_EXTENSIONS: Raw comma separated allowed extensions.
        LOG_LEVEL: Loguru log level (DEBUG/INFO/WARNING/ERROR).
        LOG_FILE: Relative path to the rotating log file.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "AI-Powered Smart Internship & Job Recommendation Portal"
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = True

    CORS_ORIGINS: str = "*"

    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "ai_job_portal"

    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_RESUME_EXTENSIONS: str = ".pdf,.docx"

    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"

    # --- Derived paths (not env driven) ---
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATASETS_DIR: Path = BASE_DIR / "datasets"
    TRAINED_MODELS_DIR: Path = BASE_DIR / "trained_models"
    UPLOADS_DIR: Path = BASE_DIR / "uploads"

    @property
    def cors_origins_list(self) -> List[str]:
        """Return CORS_ORIGINS as a parsed list of origins."""
        if self.CORS_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_resume_extensions_list(self) -> List[str]:
        """Return ALLOWED_RESUME_EXTENSIONS as a parsed list of extensions."""
        return [ext.strip().lower() for ext in self.ALLOWED_RESUME_EXTENSIONS.split(",") if ext.strip()]

    @property
    def max_upload_size_bytes(self) -> int:
        """Return the max upload size converted to bytes."""
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024


# Singleton settings instance used across the entire application.
settings = Settings()
