"""
api/career.py
===============
Purpose:
    Exposes the Career Recommendation endpoint, suggesting suitable
    career paths for a candidate based on their skills and interests,
    including salary range, future scope, roadmap, and learning
    resources.

Flow of execution:
    Client -> POST /api/career/recommend (JSON body)
        -> CareerService.recommend()
        -> success_response(CareerRecommendationResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.career import CareerRecommendationRequest, CareerRecommendationResponse
from services.career_service import CareerService, get_career_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/career", tags=["Career"])


@router.post("/recommend", summary="Recommend suitable career paths for a candidate")
async def recommend_career(
    request: CareerRecommendationRequest,
    service: CareerService = Depends(get_career_service),
):
    """
    Recommend the top-N best matching career paths for a candidate.

    Parameters:
        request: Candidate skills and optional domain interests.
        service: Injected CareerService singleton.

    Returns:
        Standardized success JSON envelope wrapping CareerRecommendationResponse.
    """
    result: CareerRecommendationResponse = service.recommend(request)
    return success_response(data=result.model_dump(), message="Career recommendations generated successfully")
