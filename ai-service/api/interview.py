"""
api/interview.py
==================
Purpose:
    Exposes the AI Interview Question Generation endpoint. Generates
    technical, HR, coding, MCQ, and behavioral questions (with answers)
    tailored to a candidate's skills and target role.

Flow of execution:
    Client -> POST /api/interview/generate (JSON body)
        -> InterviewService.generate()
        -> success_response(InterviewGenerationResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.interview import InterviewGenerationRequest, InterviewGenerationResponse
from services.interview_service import InterviewService, get_interview_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/interview", tags=["Interview"])


@router.post("/generate", summary="Generate tailored interview questions")
async def generate_interview_questions(
    request: InterviewGenerationRequest,
    service: InterviewService = Depends(get_interview_service),
):
    """
    Generate a full interview question set for the given skills/role.

    Parameters:
        request: Skills, target role, difficulty filter, and per-category counts.
        service: Injected InterviewService singleton.

    Returns:
        Standardized success JSON envelope wrapping InterviewGenerationResponse.
    """
    result: InterviewGenerationResponse = service.generate(request)
    return success_response(data=result.model_dump(), message="Interview questions generated successfully")
