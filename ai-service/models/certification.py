"""
models/certification.py
========================
Purpose:
    Request/response schemas for the Certification Recommendation
    module (api/certification.py, services/certification_service.py).

Usage Example:
    from models.certification import CertificationRecommendationResponse
"""

from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class CertificationRecommendationRequest(BaseModel):
    """Input payload for POST /api/certification/recommend."""
    missing_skills: List[str] = Field(..., min_length=1, description="Skills the candidate needs to acquire")
    preferred_providers: List[str] = Field(
        default_factory=list,
        description="Optional filter, e.g. ['Coursera', 'AWS']",
    )


class CertificationItem(BaseModel):
    """A single recommended certification/course."""
    course_name: str
    provider: str
    related_skill: str
    level: str
    url: str


class CertificationRecommendationResponse(BaseModel):
    """Top level certification recommendation response."""
    results: List[CertificationItem]
