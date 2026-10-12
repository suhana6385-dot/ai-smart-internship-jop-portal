"""
main.py
========
Purpose:
    The process entry point. Runs the FastAPI application (defined in
    app.py) using uvicorn with settings sourced from utils.config.

How it interacts with other files:
    Imports the pre-built `app` instance from app.py. This is the file
    you execute directly (`python main.py`) or point uvicorn/gunicorn
    at (`uvicorn main:app`) in Docker/production.

Required dependencies:
    uvicorn, app.py

Flow of execution:
    `python main.py` -> reads settings -> uvicorn.run(app, host, port)
"""

from __future__ import annotations

import uvicorn

from utils.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
