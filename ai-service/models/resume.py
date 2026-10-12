"""
models/resume.py
=================
Purpose:
    Request/response schemas for the Resume Parsing module
    (api/resume.py, services/resume_service.py).

Usage Example:
    from models.resume import ParsedResumeResponse
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class EducationEntry(BaseModel):
    """A single education record extracted from a resume."""
    degree: Optional[str] = Field(default=None, description="Degree/qualification, e.g. B.Tech")
    institution: Optional[str] = Field(default=None, description="Institution/university name")
    year: Optional[str] = Field(default=None, description="Year or duration of study")
    raw_line: str = Field(..., description="Original text line this entry was extracted from")


class ExperienceEntry(BaseModel):
    """A single work-experience record extracted from a resume."""
    role_or_company: Optional[str] = Field(default=None, description="Role and/or company text")
    duration: Optional[str] = Field(default=None, description="Duration mentioned, if detected")
    raw_line: str = Field(..., description="Original text line this entry was extracted from")


class ProjectEntry(BaseModel):
    """A single project record extracted from a resume."""
    title: Optional[str] = Field(default=None, description="Project title, if detected")
    description: str = Field(..., description="Project description text")


class ParsedResumeData(BaseModel):
    """Structured data extracted from a resume file."""
    name: Optional[str] = Field(default=None, description="Candidate's full name")
    email: Optional[str] = Field(default=None, description="Candidate's email address")
    phone: Optional[str] = Field(default=None, description="Candidate's phone number")
    skills: List[str] = Field(default_factory=list, description="Skills detected in the resume")
    projects: List[ProjectEntry] = Field(default_factory=list, description="Projects detected in the resume")
    education: List[EducationEntry] = Field(default_factory=list, description="Education entries detected")
    experience: List[ExperienceEntry] = Field(default_factory=list, description="Experience entries detected")
    certifications: List[str] = Field(default_factory=list, description="Certifications detected")
    languages: List[str] = Field(default_factory=list, description="Spoken/programming languages detected")
    raw_text_length: int = Field(..., description="Length of the raw extracted text, for diagnostics")


class ParsedResumeResponse(BaseModel):
    """Top level response returned by POST /api/resume/parse."""
    filename: str
    file_type: str
    parsed_data: ParsedResumeData
