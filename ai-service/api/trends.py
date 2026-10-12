"""
api/trends.py
===============
Purpose:
    Exposes the Industry Trend Prediction endpoint. Returns top skills,
    trending technologies, growing domains, top hiring companies, and
    projected future careers.

Flow of execution:
    Client -> GET /api/trends?domain=AI/ML&top_n=10
        -> TrendService.get_trends()
        -> success_response(IndustryTrendResponse)
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query

from models.trends import IndustryTrendResponse
from services.trend_service import TrendService, get_trend_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/trends", tags=["Trends"])


@router.get("", summary="Get industry hiring trends and future career projections")
async def get_industry_trends(
    domain: Optional[str] = Query(default=None, description="Filter trends by domain, e.g. 'AI/ML'"),
    top_n: int = Query(default=10, ge=1, le=50, description="Number of top skills to return"),
    service: TrendService = Depends(get_trend_service),
):
    """
    Retrieve current industry hiring trends and projected future careers.

    Parameters:
        domain: Optional domain filter.
        top_n: Number of top skills to return.
        service: Injected TrendService singleton.

    Returns:
        Standardized success JSON envelope wrapping IndustryTrendResponse.
    """
    result: IndustryTrendResponse = service.get_trends(domain=domain, top_n=top_n)
    return success_response(data=result.model_dump(), message="Industry trends retrieved successfully")
