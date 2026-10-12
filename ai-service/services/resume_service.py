"""
services/resume_service.py
===========================
Purpose:
    Business logic for the Resume Parsing module. Coordinates file-type
    detection, text extraction (PDF/DOCX), and field-level extraction
    (name, email, phone, skills, projects, education, experience,
    certifications, languages) into a structured ParsedResumeData model.

Architecture:
    `ResumeService` is stateless per-request but holds compiled regex
    patterns and dataset-driven skill matching as instance attributes so
    they are compiled/loaded only once (at singleton construction time).

Flow of execution:
    api/resume.py -> ResumeService.parse_resume(filename, file_bytes)
        -> utils.pdf_reader / utils.docx_reader (raw text extraction)
        -> utils.text_cleaner (normalize)
        -> internal regex/heuristic extractors (name/email/phone/etc.)
        -> utils.skill_extractor (dataset-driven skill matching)
        -> returns ParsedResumeData

Usage Example:
    from services.resume_service import get_resume_service
    service = get_resume_service()
    result = service.parse_resume("resume.pdf", raw_bytes)
"""

from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path
from typing import List, Optional

from models.resume import EducationEntry, ExperienceEntry, ParsedResumeData, ProjectEntry
from utils.docx_reader import extract_text_from_docx
from utils.exceptions import InvalidFileError, ResumeParsingError
from utils.logger import logger
from utils.pdf_reader import extract_text_from_pdf
from utils.skill_extractor import skill_extractor
from utils.text_cleaner import clean_text
from utils.validators import is_valid_email, is_valid_phone

_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?(\d{10}|\d{5}[-.\s]\d{5}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})")

_SECTION_HEADERS = {
    "education": ["education", "academic background", "academic qualification", "qualifications"],
    "experience": ["experience", "work experience", "professional experience", "employment history", "internship"],
    "projects": ["projects", "academic projects", "personal projects", "key projects"],
    "certifications": ["certifications", "certificates", "licenses & certifications"],
    "languages": ["languages", "language proficiency"],
    "skills": ["skills", "technical skills", "core competencies", "skill set"],
}

_COMMON_LANGUAGES = {
    "english", "hindi", "tamil", "telugu", "kannada", "malayalam", "marathi",
    "bengali", "gujarati", "punjabi", "urdu", "french", "german", "spanish",
    "japanese", "chinese", "mandarin", "korean", "arabic", "russian",
}

_DEGREE_KEYWORDS = [
    "b.tech", "btech", "b.e", "be", "bachelor", "m.tech", "mtech", "master",
    "msc", "m.sc", "bsc", "b.sc", "mba", "bca", "mca", "phd", "diploma",
    "12th", "10th", "hsc", "ssc",
]


class ResumeService:
    """
    Parses resume files (PDF/DOCX) into structured candidate data.
    """

    def parse_resume(self, filename: str, file_bytes: bytes) -> ParsedResumeData:
        """
        Parse an uploaded resume file into structured data.

        Parameters:
            filename: Original filename, used to determine file type.
            file_bytes: Raw file content.

        Returns:
            ParsedResumeData with all extracted fields populated.

        Raises:
            InvalidFileError: If the file extension is unsupported.
            ResumeParsingError: If text extraction fails entirely.
        """
        extension = Path(filename).suffix.lower()
        logger.info(f"Parsing resume '{filename}' (type={extension})")

        if extension == ".pdf":
            raw_text = extract_text_from_pdf(file_bytes)
        elif extension == ".docx":
            raw_text = extract_text_from_docx(file_bytes)
        else:
            raise InvalidFileError(f"Unsupported resume file type: {extension}")

        cleaned = clean_text(raw_text)
        if not cleaned:
            raise ResumeParsingError("Resume text could not be extracted or is empty")

        name = self._extract_name(cleaned)
        email = self._extract_email(cleaned)
        phone = self._extract_phone(cleaned)
        skills = skill_extractor.extract(cleaned)
        sections = self._split_sections(cleaned)
        education = self._extract_education(sections.get("education", cleaned))
        experience = self._extract_experience(sections.get("experience", ""))
        projects = self._extract_projects(sections.get("projects", ""))
        certifications = self._extract_certifications(sections.get("certifications", ""))
        languages = self._extract_languages(sections.get("languages", cleaned))

        logger.info(
            f"Resume parsed: name={bool(name)} email={bool(email)} "
            f"phone={bool(phone)} skills={len(skills)} education={len(education)} "
            f"experience={len(experience)} projects={len(projects)}"
        )

        return ParsedResumeData(
            name=name,
            email=email,
            phone=phone,
            skills=skills,
            projects=projects,
            education=education,
            experience=experience,
            certifications=certifications,
            languages=languages,
            raw_text_length=len(cleaned),
        )

    # ------------------------------------------------------------------
    # Field-level extractors
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_email(text: str) -> Optional[str]:
        match = _EMAIL_RE.search(text)
        if match and is_valid_email(match.group(0)):
            return match.group(0)
        return None

    @staticmethod
    def _extract_phone(text: str) -> Optional[str]:
        match = _PHONE_RE.search(text)
        if match and is_valid_phone(match.group(0)):
            return match.group(0).strip()
        return None

    @staticmethod
    def _extract_name(text: str) -> Optional[str]:
        """
        Heuristic: the candidate's name is usually the first non-empty
        line that does not look like an email, phone number, URL, or a
        section header, and is reasonably short (<= 5 words).
        """
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        for line in lines[:8]:
            lower = line.lower()
            if _EMAIL_RE.search(line) or _PHONE_RE.search(line):
                continue
            if any(header in lower for headers in _SECTION_HEADERS.values() for header in headers):
                continue
            if "http" in lower or "www." in lower:
                continue
            words = line.split()
            if 1 <= len(words) <= 5 and all(w.replace(".", "").isalpha() or w.isupper() for w in words):
                return line.title() if line.isupper() else line
        return lines[0] if lines else None

    @staticmethod
    def _split_sections(text: str) -> dict:
        """
        Split resume text into sections based on common header keywords.
        Returns a dict of section_name -> section_text.
        """
        lines = text.split("\n")
        sections: dict = {}
        current_section = "general"
        buffer: List[str] = []

        for line in lines:
            lower = line.strip().lower()
            matched_section = None
            for section_name, headers in _SECTION_HEADERS.items():
                if any(lower == h or lower.startswith(h) for h in headers) and len(line.strip()) < 40:
                    matched_section = section_name
                    break
            if matched_section:
                if buffer:
                    sections[current_section] = sections.get(current_section, "") + "\n".join(buffer) + "\n"
                current_section = matched_section
                buffer = []
            else:
                buffer.append(line)

        if buffer:
            sections[current_section] = sections.get(current_section, "") + "\n".join(buffer)

        return sections

    @staticmethod
    def _extract_education(section_text: str) -> List[EducationEntry]:
        entries: List[EducationEntry] = []
        for line in section_text.split("\n"):
            stripped = line.strip()
            if not stripped or len(stripped) < 4:
                continue
            lower = stripped.lower()
            if any(keyword in lower for keyword in _DEGREE_KEYWORDS):
                year_match = re.search(r"(19|20)\d{2}(\s?-\s?(19|20)\d{2})?", stripped)
                degree_match = next((kw for kw in _DEGREE_KEYWORDS if kw in lower), None)
                entries.append(
                    EducationEntry(
                        degree=degree_match.title() if degree_match else None,
                        institution=None,
                        year=year_match.group(0) if year_match else None,
                        raw_line=stripped,
                    )
                )
        return entries[:10]

    @staticmethod
    def _extract_experience(section_text: str) -> List[ExperienceEntry]:
        entries: List[ExperienceEntry] = []
        for line in section_text.split("\n"):
            stripped = line.strip()
            if not stripped or len(stripped) < 4:
                continue
            duration_match = re.search(
                r"(\d{1,2}\s?(months?|years?|yrs?))|((19|20)\d{2}\s?-\s?((19|20)\d{2}|present|current))",
                stripped,
                re.IGNORECASE,
            )
            entries.append(
                ExperienceEntry(
                    role_or_company=stripped[:120],
                    duration=duration_match.group(0) if duration_match else None,
                    raw_line=stripped,
                )
            )
        return entries[:15]

    @staticmethod
    def _extract_projects(section_text: str) -> List[ProjectEntry]:
        entries: List[ProjectEntry] = []
        current_title = None
        current_desc: List[str] = []

        def flush():
            if current_desc:
                entries.append(
                    ProjectEntry(title=current_title, description=" ".join(current_desc).strip()[:500])
                )

        for line in section_text.split("\n"):
            stripped = line.strip()
            if not stripped:
                continue
            if len(stripped) < 60 and stripped[0].isupper() and not stripped.endswith("."):
                flush()
                current_title = stripped
                current_desc = []
            else:
                current_desc.append(stripped)
        flush()
        return entries[:10]

    @staticmethod
    def _extract_certifications(section_text: str) -> List[str]:
        certs = [ln.strip() for ln in section_text.split("\n") if ln.strip() and len(ln.strip()) > 3]
        return certs[:15]

    @staticmethod
    def _extract_languages(text: str) -> List[str]:
        found = set()
        text_lower = text.lower()
        for lang in _COMMON_LANGUAGES:
            if re.search(rf"\b{lang}\b", text_lower):
                found.add(lang.title())
        return sorted(found)


@lru_cache(maxsize=1)
def get_resume_service() -> ResumeService:
    """Return a process-wide cached ResumeService instance."""
    return ResumeService()
