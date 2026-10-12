"""
models/interview.py
====================
Purpose:
    Request/response schemas for the AI Interview Question Generation
    module (api/interview.py, services/interview_service.py).

Usage Example:
    from models.interview import InterviewGenerationResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from models.common import DifficultyLevel


class InterviewGenerationRequest(BaseModel):
    """Input payload for POST /api/interview/generate."""
    skills: List[str] = Field(..., min_length=1, description="Skills to generate questions for")
    role: Optional[str] = Field(default=None, description="Target job role, e.g. 'Backend Developer'")
    difficulty: Optional[DifficultyLevel] = Field(
        default=None, description="If omitted, questions across all difficulties are returned"
    )
    num_technical: int = Field(default=5, ge=0, le=20)
    num_hr: int = Field(default=3, ge=0, le=10)
    num_coding: int = Field(default=3, ge=0, le=10)
    num_mcq: int = Field(default=5, ge=0, le=20)
    num_behavioral: int = Field(default=3, ge=0, le=10)


class QuestionItem(BaseModel):
    """A single generated interview question with its answer."""
    question: str
    answer: str
    difficulty: DifficultyLevel
    category: str = Field(..., description="technical | hr | coding | mcq | behavioral")
    options: Optional[List[str]] = Field(default=None, description="Choices, only populated for MCQs")


class InterviewGenerationResponse(BaseModel):
    """Top level interview question generation response."""
    role: Optional[str]
    technical_questions: List[QuestionItem]
    hr_questions: List[QuestionItem]
    coding_questions: List[QuestionItem]
    mcq_questions: List[QuestionItem]
    behavioral_questions: List[QuestionItem]
