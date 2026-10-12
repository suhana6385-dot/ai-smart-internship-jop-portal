"""
api/ats.py
===========
Purpose:
    Exposes the ATS Resume Analysis endpoint. Accepts a resume file plus
    an optional target job description and returns a full ATS score
    breakdown with actionable suggestions.

How it interacts with other files:
    Reuses services.resume_service.ResumeService to parse the resume
    first, then passes the parsed data into services.ats_service.ATSService
    for scoring.

Flow of execution:
    Client -> POST /api/ats/analyze (multipart file + optional job_description)
        -> ResumeService.parse_resume()
        -> ATSService.analyze()
        -> success_response(ATSAnalysisResponse)
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile

from models.ats import ATSAnalysisResponse
from services.ats_service import ATSService, get_ats_service
from services.resume_service import ResumeService, get_resume_service
from utils.docx_reader import extract_text_from_docx
from utils.logger import logger
from utils.pdf_reader import extract_text_from_pdf
from utils.response_formatter import success_response
from utils.text_cleaner import clean_text
from utils.validators import validate_resume_file
from pathlib import Path

router = APIRouter(prefix="/api/ats", tags=["ATS"])


@router.post("/analyze", summary="Compute ATS compatibility score for a resume")
async def analyze_resume(
    file: UploadFile = File(..., description="Resume file (.pdf or .docx)"),
    job_description: Optional[str] = Form(default=None, description="Target job description text"),
    resume_service: ResumeService = Depends(get_resume_service),
    ats_service: ATSService = Depends(get_ats_service),
):
    """
    Analyze an uploaded resume and compute its ATS compatibility score.

    Parameters:
        file: The uploaded resume file (multipart/form-data).
        job_description: Optional target job description for keyword/skill matching.
        resume_service: Injected ResumeService singleton.
        ats_service: Injected ATSService singleton.

    Returns:
        Standardized success JSON envelope wrapping ATSAnalysisResponse.
    """
    file_bytes = await file.read()
    validate_resume_file(filename=file.filename, size_bytes=len(file_bytes))

    extension = Path(file.filename).suffix.lower()
    raw_text = extract_text_from_pdf(file_bytes) if extension == ".pdf" else extract_text_from_docx(file_bytes)
    cleaned_text = clean_text(raw_text)

    parsed_data = resume_service.parse_resume(filename=file.filename, file_bytes=file_bytes)

    logger.info(f"Running ATS analysis for {file.filename} (JD provided={bool(job_description)})")

    result: ATSAnalysisResponse = ats_service.analyze(
        parsed_resume=parsed_data,
        raw_text=cleaned_text,
        job_description=job_description,
    )

    return success_response(data=result.model_dump(), message="ATS analysis completed successfully")
