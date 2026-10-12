"""
api/certification.py
======================
Purpose:
    Exposes the Certification Recommendation endpoint, mapping a
    candidate's missing skills to relevant certifications/courses from
    providers like Coursera, Udemy, AWS, Google, Microsoft, IBM,
    NPTEL, SWAYAM, and Infosys Springboard.

Flow of execution:
    Client -> POST /api/certification/recommend (JSON body)
        -> CertificationService.recommend()
        -> success_response(CertificationRecommendationResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.certification import CertificationRecommendationRequest, CertificationRecommendationResponse
from services.certification_service import CertificationService, get_certification_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/certification", tags=["Certification"])


@router.post("/recommend", summary="Recommend certifications/courses for missing skills")
async def recommend_certifications(
    request: CertificationRecommendationRequest,
    service: CertificationService = Depends(get_certification_service),
):
    """
    Recommend certifications/courses that address the candidate's
    missing skills.

    Parameters:
        request: Missing skills and optional preferred providers.
        service: Injected CertificationService singleton.

    Returns:
        Standardized success JSON envelope wrapping CertificationRecommendationResponse.
    """
    result: CertificationRecommendationResponse = service.recommend(request)
    return success_response(data=result.model_dump(), message="Certification recommendations generated successfully")
