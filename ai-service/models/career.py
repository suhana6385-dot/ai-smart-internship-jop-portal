"""
models/career.py
=================
Purpose:
    Request/response schemas for the Career Recommendation module
    (api/career.py, services/career_service.py).

Usage Example:
    from models.career import CareerRecommendationResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class CareerRecommendationRequest(BaseModel):
    """Input payload for POST /api/career/recommend."""
    skills: List[str] = Field(..., min_length=1, description="Candidate's current skills")
    interests: Optional[List[str]] = Field(default=None, description="Optional domains of interest")
    top_n: int = Field(default=5, ge=1, le=10)


class CareerPathItem(BaseModel):
    """A single recommended career path."""
    career_name: str
    domain: str
    match_score: float = Field(..., ge=0, le=1)
    required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    salary_range: str
    future_scope: str
    roadmap: List[str]
    learning_resources: List[str] = Field(default_factory=list)


class CareerRecommendationResponse(BaseModel):
    """Top level career recommendation response."""
    results: List[CareerPathItem]
