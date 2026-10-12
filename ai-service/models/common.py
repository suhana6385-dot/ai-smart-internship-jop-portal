"""
models/common.py
=================
Purpose:
    Shared Pydantic models and enums reused across multiple domain
    modules: standardized error body, generic success wrapper, and
    common enums (difficulty level, domain).

Usage Example:
    from models.common import ErrorResponse, DifficultyLevel
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class DifficultyLevel(str, Enum):
    """Difficulty levels used by interview questions and skill-gap roadmap."""
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"


class ErrorResponse(BaseModel):
    """Standard error envelope returned by global exception handlers."""
    success: bool = Field(default=False, description="Always false for errors")
    message: str = Field(..., description="Human readable error message")
    data: Optional[Any] = Field(default=None, description="Always null for errors")
    errors: Optional[Any] = Field(default=None, description="Structured error details, if any")


class SuccessResponse(BaseModel):
    """Generic success envelope shape (used for OpenAPI documentation)."""
    success: bool = Field(default=True)
    message: str = Field(default="Success")
    data: Optional[Any] = None
    errors: Optional[Any] = None


class HealthResponse(BaseModel):
    """Response returned by the /health endpoint."""
    status: str = Field(..., description="Overall service status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
