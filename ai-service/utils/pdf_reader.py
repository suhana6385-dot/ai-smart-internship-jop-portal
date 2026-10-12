"""
utils/pdf_reader.py
====================
Purpose:
    Extracts raw text content from PDF resume files. Uses `pdfplumber`
    as the primary extraction engine (better layout/whitespace fidelity)
    and falls back to `PyPDF2` if pdfplumber fails to open/parse the file
    (e.g. certain malformed or scanned PDFs).

Architecture:
    Single public function `extract_text_from_pdf` consumed by
    services/resume_service.py. Never raises on partial extraction
    failures for individual pages; only raises ResumeParsingError if
    absolutely no text could be extracted from the whole document.

Usage Example:
    from utils.pdf_reader import extract_text_from_pdf
    text = extract_text_from_pdf("uploads/resume.pdf")
"""

from __future__ import annotations

import io

import pdfplumber
from PyPDF2 import PdfReader

from utils.exceptions import ResumeParsingError
from utils.logger import logger


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract all readable text from a PDF file's raw bytes.

    Parameters:
        file_bytes: Raw bytes of the uploaded PDF file.

    Returns:
        The concatenated text content of all pages.

    Raises:
        ResumeParsingError: If no text could be extracted by either engine.
    """
    text = _extract_with_pdfplumber(file_bytes)

    if not text.strip():
        logger.warning("pdfplumber extracted no text, falling back to PyPDF2")
        text = _extract_with_pypdf2(file_bytes)

    if not text.strip():
        raise ResumeParsingError(
            "Could not extract any text from the PDF. It may be a scanned "
            "image without an OCR text layer."
        )

    return text


def _extract_with_pdfplumber(file_bytes: bytes) -> str:
    """Attempt extraction using pdfplumber; returns empty string on failure."""
    try:
        pages_text = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                pages_text.append(page_text)
        return "\n".join(pages_text)
    except Exception as exc:  # noqa: BLE001 - deliberately broad, engine may raise many types
        logger.warning(f"pdfplumber extraction failed: {exc}")
        return ""


def _extract_with_pypdf2(file_bytes: bytes) -> str:
    """Attempt extraction using PyPDF2 as a fallback engine."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        pages_text = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages_text)
    except Exception as exc:  # noqa: BLE001
        logger.error(f"PyPDF2 extraction failed: {exc}")
        return ""
