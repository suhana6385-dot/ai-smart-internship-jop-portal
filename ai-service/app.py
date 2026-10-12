"""
app.py
=======
Purpose:
    Builds and configures the FastAPI application instance: CORS,
    global exception handlers (mapping every AIServiceError subclass
    and unhandled exceptions to the standardized JSON error envelope),
    startup/shutdown lifecycle hooks (pre-loading services so the first
    real request isn't slowed down by lazy dataset loading), and
    registration of every domain router.

How it interacts with other files:
    Imported by main.py, which runs it via uvicorn. Imports every
    router from api/*.py and every get_*_service() factory from
    services/*.py to warm them up at startup.

Required dependencies:
    fastapi, starlette, all api/*.py routers, all services/*.py
    factories, utils.config, utils.logger, utils.exceptions,
    utils.response_formatter.

Flow of execution:
    main.py -> app.py:create_app() -> FastAPI instance
        -> CORS middleware attached
        -> exception handlers attached
        -> routers included
        -> lifespan startup warms up all services (loads datasets once)
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from api import ats, career, certification, interview, ranking, recommendation, resume, skill_gap, trends
from models.common import HealthResponse
from services.ats_service import get_ats_service
from services.career_service import get_career_service
from services.certification_service import get_certification_service
from services.interview_service import get_interview_service
from services.ranking_service import get_ranking_service
from services.recommendation_service import get_recommendation_service
from services.resume_service import get_resume_service
from services.skill_gap_service import get_skill_gap_service
from services.trend_service import get_trend_service
from utils.config import settings
from utils.exceptions import AIServiceError
from utils.logger import logger
from utils.response_formatter import error_response

APP_VERSION = "1.0.0"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler. Warms up every service singleton
    (which loads CSV datasets and compiles skill lookups) exactly once
    at startup so ML models/datasets are loaded once and reused for
    every request, instead of lazily on the first hit to each endpoint.
    """
    logger.info(f"Starting up '{settings.APP_NAME}' [{settings.APP_ENV}]")
    get_resume_service()
    get_ats_service()
    get_skill_gap_service()
    get_recommendation_service()
    get_career_service()
    get_certification_service()
    get_interview_service()
    get_ranking_service()
    get_trend_service()
    logger.info("All services warmed up successfully. AI microservice is ready.")
    yield
    logger.info("Shutting down AI microservice.")


def create_app() -> FastAPI:
    """
    Build and fully configure the FastAPI application instance.

    Returns:
        A ready-to-serve FastAPI app with CORS, exception handlers, and
        all domain routers registered.
    """
    app = FastAPI(
        title=settings.APP_NAME,
        description=(
            "Independent AI microservice powering resume parsing, ATS analysis, "
            "skill gap analysis, job/internship/career/certification recommendation, "
            "AI interview question generation, candidate ranking, and industry trend "
            "prediction for the Smart Internship & Job Recommendation Portal."
        ),
        version=APP_VERSION,
        lifespan=lifespan,
    )

    _configure_cors(app)
    _register_exception_handlers(app)
    _register_routers(app)
    _register_core_routes(app)

    return app


def _configure_cors(app: FastAPI) -> None:
    """Attach CORS middleware using the configured allowed origins."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def _register_routers(app: FastAPI) -> None:
    """Include every domain router under the application."""
    app.include_router(resume.router)
    app.include_router(ats.router)
    app.include_router(skill_gap.router)
    app.include_router(recommendation.router)
    app.include_router(career.router)
    app.include_router(certification.router)
    app.include_router(interview.router)
    app.include_router(ranking.router)
    app.include_router(trends.router)


def _register_core_routes(app: FastAPI) -> None:
    """Register root and health-check routes."""

    @app.get("/", tags=["Core"], summary="Service root")
    async def root():
        return {
            "service": settings.APP_NAME,
            "version": APP_VERSION,
            "status": "running",
            "docs": "/docs",
        }

    @app.get("/health", tags=["Core"], response_model=HealthResponse, summary="Health check")
    async def health_check():
        return HealthResponse(status="healthy", service=settings.APP_NAME, version=APP_VERSION)


def _register_exception_handlers(app: FastAPI) -> None:
    """
    Register global exception handlers so every error response, no
    matter where it originates, follows the standardized JSON envelope.
    """

    @app.exception_handler(AIServiceError)
    async def handle_ai_service_error(request: Request, exc: AIServiceError):
        logger.warning(f"AIServiceError on {request.method} {request.url.path}: {exc.message}")
        return error_response(message=exc.message, status_code=exc.status_code)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation error on {request.method} {request.url.path}: {exc.errors()}")
        return error_response(
            message="Request validation failed",
            status_code=422,
            errors=exc.errors(),
        )

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_exception(request: Request, exc: StarletteHTTPException):
        logger.warning(f"HTTPException on {request.method} {request.url.path}: {exc.detail}")
        return error_response(message=str(exc.detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def handle_unexpected_exception(request: Request, exc: Exception):
        logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
        return error_response(
            message="An unexpected internal server error occurred",
            status_code=500,
        )


app = create_app()
