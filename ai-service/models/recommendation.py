"""
models/recommendation.py
=========================
Purpose:
    Request/response schemas for the Internship & Job Recommendation
    module (api/recommendation.py, services/recommendation_service.py).

Usage Example:
    from models.recommendation import RecommendationRequest, JobRecommendationResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    """Input payload for POST /api/recommend/jobs and /api/recommend/internships."""
    skills: List[str] = Field(..., min_length=1, description="Candidate's skills")
    education: Optional[str] = Field(default=None, description="Highest qualification, e.g. 'B.Tech Computer Science'")
    resume_text: Optional[str] = Field(default=None, description="Full resume text, used for semantic matching")
    preferred_location: Optional[str] = Field(default=None, description="Preferred job/internship location")
    preferred_domain: Optional[str] = Field(default=None, description="Preferred domain, e.g. 'AI/ML'")
    experience_years: float = Field(default=0, ge=0, description="Years of professional experience")
    top_n: int = Field(default=10, ge=1, le=50, description="Number of recommendations to return")


class RecommendedItem(BaseModel):
    """A single recommended job or internship with its match score."""
    id: str
    title: str
    company: str
    location: str
    domain: str
    required_skills: List[str]
    match_score: float = Field(..., ge=0, le=1, description="Combined similarity score in [0, 1]")
    matched_skills: List[str]
    missing_skills: List[str]
    extra: Optional[dict] = Field(default=None, description="Item-specific extra fields (salary, stipend, etc.)")


class RecommendationResponse(BaseModel):
    """Top level recommendation response."""
    total_candidates_considered: int
    results: List[RecommendedItem]
