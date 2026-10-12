"""
api/skill_gap.py
==================
Purpose:
    Exposes the Skill Gap Analysis endpoint, comparing a student's
    current skills against a target job's required skills and
    returning missing/weak/strong skills plus a prioritized learning
    roadmap.

Flow of execution:
    Client -> POST /api/skill-gap/analyze (JSON body)
        -> SkillGapService.analyze()
        -> success_response(SkillGapResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.skill_gap import SkillGapRequest, SkillGapResponse
from services.skill_gap_service import SkillGapService, get_skill_gap_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/skill-gap", tags=["Skill Gap"])


@router.post("/analyze", summary="Analyze skill gap between a student and a target job")
async def analyze_skill_gap(
    request: SkillGapRequest,
    service: SkillGapService = Depends(get_skill_gap_service),
):
    """
    Compare student skills against a target job's required skills.

    Parameters:
        request: Student skills, job required skills, and target role.
        service: Injected SkillGapService singleton.

    Returns:
        Standardized success JSON envelope wrapping SkillGapResponse.
    """
    result: SkillGapResponse = service.analyze(
        student_skills=request.student_skills,
        job_required_skills=request.job_required_skills,
        target_role=request.target_role,
    )
    return success_response(data=result.model_dump(), message="Skill gap analysis completed successfully")
