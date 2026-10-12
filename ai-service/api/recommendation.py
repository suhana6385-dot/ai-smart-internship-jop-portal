"""
api/recommendation.py
=======================
Purpose:
    Exposes the Internship & Job Recommendation endpoints. Given a
    candidate profile (skills, education, location, domain,
    experience), returns the top-N best matching jobs and/or
    internships ranked by a hybrid similarity score.

Flow of execution:
    Client -> POST /api/recommend/jobs (JSON body)
        -> RecommendationService.recommend_jobs()
        -> success_response(RecommendationResponse)
    Client -> POST /api/recommend/internships (JSON body)
        -> RecommendationService.recommend_internships()
        -> success_response(RecommendationResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.recommendation import RecommendationRequest, RecommendationResponse
from services.recommendation_service import RecommendationService, get_recommendation_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/recommend", tags=["Recommendation"])


@router.post("/jobs", summary="Recommend top matching jobs for a candidate")
async def recommend_jobs(
    request: RecommendationRequest,
    service: RecommendationService = Depends(get_recommendation_service),
):
    """
    Recommend the top-N best matching jobs for a candidate profile.

    Parameters:
        request: Candidate skills, education, location, domain preferences.
        service: Injected RecommendationService singleton.

    Returns:
        Standardized success JSON envelope wrapping RecommendationResponse.
    """
    result: RecommendationResponse = service.recommend_jobs(request)
    return success_response(data=result.model_dump(), message="Job recommendations generated successfully")


@router.post("/internships", summary="Recommend top matching internships for a candidate")
async def recommend_internships(
    request: RecommendationRequest,
    service: RecommendationService = Depends(get_recommendation_service),
):
    """
    Recommend the top-N best matching internships for a candidate profile.

    Parameters:
        request: Candidate skills, education, location, domain preferences.
        service: Injected RecommendationService singleton.

    Returns:
        Standardized success JSON envelope wrapping RecommendationResponse.
    """
    result: RecommendationResponse = service.recommend_internships(request)
    return success_response(data=result.model_dump(), message="Internship recommendations generated successfully")
