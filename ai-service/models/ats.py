"""
models/ats.py
==============
Purpose:
    Request/response schemas for the ATS Resume Analysis module
    (api/ats.py, services/ats_service.py).

Usage Example:
    from models.ats import ATSAnalysisResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ATSAnalysisRequest(BaseModel):
    """
    Optional accompanying metadata for an ATS analysis request. The
    resume file itself is supplied as multipart form-data; this model
    covers the optional target job description used to compute keyword
    match against a specific job.
    """
    job_description: Optional[str] = Field(
        default=None,
        description="Target job description text to score keyword match against",
    )
    target_role: Optional[str] = Field(default=None, description="Target job title/role")


class ATSAnalysisResponse(BaseModel):
    """Full ATS analysis result returned by POST /api/ats/analyze."""
    overall_score: float = Field(..., ge=0, le=100, description="Overall ATS score out of 100")
    formatting_score: float = Field(..., ge=0, le=100)
    keyword_score: float = Field(..., ge=0, le=100)
    skill_score: float = Field(..., ge=0, le=100)
    experience_score: float = Field(..., ge=0, le=100)
    education_score: float = Field(..., ge=0, le=100)
    ats_compatibility: str = Field(..., description="Qualitative compatibility label")
    missing_keywords: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
