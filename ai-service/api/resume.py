"""
api/resume.py
==============
Purpose:
    Exposes the Resume Parsing endpoint. Accepts a PDF or DOCX resume
    upload, validates it, and returns structured extracted data (name,
    email, phone, skills, projects, education, experience,
    certifications, languages).

How it interacts with other files:
    Delegates parsing to services.resume_service.ResumeService, uses
    utils.validators for upload validation and utils.response_formatter
    for the response envelope. Errors raised as AIServiceError
    subclasses are caught by the global handler registered in app.py.

Required dependencies:
    fastapi, services.resume_service, utils.validators,
    utils.response_formatter, models.resume.

Flow of execution:
    Client -> POST /api/resume/parse (multipart file)
        -> validate_resume_file()
        -> ResumeService.parse_resume()
        -> success_response(ParsedResumeResponse)
"""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile

from models.resume import ParsedResumeResponse
from services.resume_service import ResumeService, get_resume_service
from utils.logger import logger
from utils.response_formatter import success_response
from utils.validators import validate_resume_file

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/parse", summary="Parse a resume (PDF/DOCX) into structured data")
async def parse_resume(
    file: UploadFile = File(..., description="Resume file (.pdf or .docx)"),
    service: ResumeService = Depends(get_resume_service),
):
    """
    Parse an uploaded resume file and extract structured candidate data.

    Parameters:
        file: The uploaded resume file (multipart/form-data).
        service: Injected ResumeService singleton.

    Returns:
        Standardized success JSON envelope wrapping ParsedResumeResponse.
    """
    file_bytes = await file.read()
    validate_resume_file(filename=file.filename, size_bytes=len(file_bytes))

    logger.info(f"Received resume upload: {file.filename} ({len(file_bytes)} bytes)")

    parsed_data = service.parse_resume(filename=file.filename, file_bytes=file_bytes)

    response_payload = ParsedResumeResponse(
        filename=file.filename,
        file_type=Path(file.filename).suffix.lower(),
        parsed_data=parsed_data,
    )

    return success_response(
        data=response_payload.model_dump(),
        message="Resume parsed successfully",
    )
