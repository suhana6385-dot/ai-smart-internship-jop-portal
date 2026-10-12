"""
models/ranking.py
==================
Purpose:
    Request/response schemas for the Candidate Ranking module
    (api/ranking.py, services/ranking_service.py).

Usage Example:
    from models.ranking import CandidateRankingRequest, CandidateRankingResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class CandidateInput(BaseModel):
    """A single candidate's evaluation data submitted for ranking."""
    candidate_id: str
    name: str
    ats_score: float = Field(..., ge=0, le=100)
    projects_count: int = Field(..., ge=0)
    cgpa: float = Field(..., ge=0, le=10)
    experience_years: float = Field(..., ge=0)
    certifications_count: int = Field(..., ge=0)
    skill_match_percentage: float = Field(..., ge=0, le=100)
    communication_score: float = Field(default=70, ge=0, le=100)
    interview_score: float = Field(default=70, ge=0, le=100)


class CandidateRankingRequest(BaseModel):
    """Input payload for POST /api/ranking/rank."""
    candidates: List[CandidateInput] = Field(..., min_length=1)
    weights: Optional[dict] = Field(
        default=None,
        description=(
            "Optional custom weights for each parameter, keys: ats, projects, "
            "cgpa, experience, certifications, skill_match, communication, interview. "
            "Must sum to 1.0 if provided."
        ),
    )


class RankedCandidate(BaseModel):
    """A single candidate with its computed composite score and rank."""
    rank: int
    candidate_id: str
    name: str
    composite_score: float = Field(..., ge=0, le=100)
    breakdown: dict


class CandidateRankingResponse(BaseModel):
    """Top level candidate ranking response."""
    ranked_candidates: List[RankedCandidate]
