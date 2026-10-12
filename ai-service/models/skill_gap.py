"""
models/skill_gap.py
====================
Purpose:
    Request/response schemas for the Skill Gap Analysis module
    (api/skill_gap.py, services/skill_gap_service.py).

Usage Example:
    from models.skill_gap import SkillGapRequest, SkillGapResponse
"""

from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field

from models.common import DifficultyLevel


class SkillGapRequest(BaseModel):
    """Input payload for POST /api/skill-gap/analyze."""
    student_skills: List[str] = Field(..., min_length=1, description="Skills the student currently has")
    job_required_skills: List[str] = Field(..., min_length=1, description="Skills required by the target job")
    target_role: str = Field(default="Target Role", description="Name of the target job/role")


class LearningRoadmapItem(BaseModel):
    """A single missing-skill roadmap recommendation entry."""
    skill: str
    difficulty: DifficultyLevel
    estimated_learning_time: str = Field(..., description="Estimated time to learn, e.g. '2-3 weeks'")
    learning_priority: int = Field(..., ge=1, description="Priority rank, 1 = highest priority")


class SkillGapResponse(BaseModel):
    """Full skill gap analysis result."""
    target_role: str
    matched_skill_percentage: float = Field(..., ge=0, le=100)
    missing_skills: List[str]
    weak_skills: List[str]
    strong_skills: List[str]
    learning_roadmap: List[LearningRoadmapItem]
