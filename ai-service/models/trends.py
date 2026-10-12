"""
models/trends.py
=================
Purpose:
    Request/response schemas for the Industry Trend Prediction module
    (api/trends.py, services/trend_service.py).

Usage Example:
    from models.trends import IndustryTrendResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class TrendQueryParams(BaseModel):
    """Optional query filters for GET /api/trends."""
    domain: Optional[str] = Field(default=None, description="Filter trends by domain, e.g. 'AI/ML'")
    top_n: int = Field(default=10, ge=1, le=50)


class TrendItem(BaseModel):
    """A single industry trend record."""
    skill: str
    domain: str
    growth_rate: str
    demand_level: str
    year: int


class TopCompanyItem(BaseModel):
    """A single top hiring company record."""
    company_name: str
    industry: str
    location: str
    hiring_domains: List[str]


class IndustryTrendResponse(BaseModel):
    """Top level industry trend prediction response."""
    top_skills: List[TrendItem]
    trending_technologies: List[str]
    growing_domains: List[str]
    top_companies: List[TopCompanyItem]
    future_careers: List[str]
