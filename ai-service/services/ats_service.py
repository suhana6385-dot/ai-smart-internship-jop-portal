"""
services/ats_service.py
========================
Purpose:
    Business logic for the ATS (Applicant Tracking System) Resume
    Analysis module. Computes a composite ATS score out of 100 across
    five sub-dimensions (formatting, keyword match, skill match,
    experience, education) and generates actionable suggestions.

Architecture:
    `ATSService` is stateless and pure-computation; it depends on
    `ResumeService`'s already-parsed data plus the keyword_extractor
    and skill_extractor utilities.

Flow of execution:
    api/ats.py -> ATSService.analyze(parsed_resume, raw_text, job_description)
        -> compute each sub-score
        -> weighted-sum into overall_score
        -> build suggestions list
        -> returns ATSAnalysisResponse
"""

from __future__ import annotations

from functools import lru_cache
from typing import List, Optional

from models.ats import ATSAnalysisResponse
from models.resume import ParsedResumeData
from utils.keyword_extractor import missing_keywords
from utils.logger import logger
from utils.skill_extractor import skill_extractor

# Weight distribution for the overall ATS score (must sum to 1.0).
_WEIGHTS = {
    "formatting": 0.15,
    "keyword": 0.25,
    "skill": 0.25,
    "experience": 0.20,
    "education": 0.15,
}


class ATSService:
    """
    Computes ATS compatibility scores and improvement suggestions for a
    parsed resume, optionally against a target job description.
    """

    def analyze(
        self,
        parsed_resume: ParsedResumeData,
        raw_text: str,
        job_description: Optional[str] = None,
    ) -> ATSAnalysisResponse:
        """
        Run the full ATS analysis pipeline.

        Parameters:
            parsed_resume: Already-parsed structured resume data.
            raw_text: The full cleaned resume text (for keyword scoring).
            job_description: Optional target job description for
                keyword/skill matching against a specific role.

        Returns:
            ATSAnalysisResponse with all sub-scores and suggestions.
        """
        formatting_score = self._formatting_score(parsed_resume, raw_text)
        keyword_score, missing_kw = self._keyword_score(raw_text, job_description)
        skill_score = self._skill_score(parsed_resume, job_description)
        experience_score = self._experience_score(parsed_resume)
        education_score = self._education_score(parsed_resume)

        overall = (
            formatting_score * _WEIGHTS["formatting"]
            + keyword_score * _WEIGHTS["keyword"]
            + skill_score * _WEIGHTS["skill"]
            + experience_score * _WEIGHTS["experience"]
            + education_score * _WEIGHTS["education"]
        )
        overall = round(overall, 2)

        compatibility = self._compatibility_label(overall)
        suggestions = self._build_suggestions(
            parsed_resume, formatting_score, keyword_score, skill_score,
            experience_score, education_score, missing_kw,
        )

        logger.info(f"ATS analysis complete: overall_score={overall}")

        return ATSAnalysisResponse(
            overall_score=overall,
            formatting_score=formatting_score,
            keyword_score=keyword_score,
            skill_score=skill_score,
            experience_score=experience_score,
            education_score=education_score,
            ats_compatibility=compatibility,
            missing_keywords=missing_kw,
            suggestions=suggestions,
        )

    # ------------------------------------------------------------------
    # Sub-score calculators
    # ------------------------------------------------------------------

    @staticmethod
    def _formatting_score(parsed_resume: ParsedResumeData, raw_text: str) -> float:
        """
        Score resume 'ATS-friendliness' of formatting: presence of
        contact info, reasonable length, and section coverage (more
        detectable sections = more ATS-parseable structure).
        """
        score = 40.0  # baseline
        if parsed_resume.email:
            score += 15
        if parsed_resume.phone:
            score += 15
        if parsed_resume.name:
            score += 10
        length = len(raw_text)
        if 800 <= length <= 8000:
            score += 20
        elif length > 0:
            score += 10
        return round(min(score, 100.0), 2)

    @staticmethod
    def _keyword_score(raw_text: str, job_description: Optional[str]) -> tuple[float, List[str]]:
        if not job_description:
            # Without a target JD we cannot compute keyword match; assume
            # a neutral score based on resume text richness.
            richness = min(len(raw_text) / 3000 * 100, 100)
            return round(richness, 2), []

        missing = missing_keywords(raw_text, job_description, top_n=25)
        total_considered = max(len(missing), 1)
        matched_ratio = 1 - (len(missing) / max(25, total_considered))
        score = round(max(matched_ratio, 0) * 100, 2)
        return score, missing

    @staticmethod
    def _skill_score(parsed_resume: ParsedResumeData, job_description: Optional[str]) -> float:
        if not job_description:
            # No JD: score purely by breadth of detected skills.
            return round(min(len(parsed_resume.skills) / 12 * 100, 100), 2)

        required_skills = skill_extractor.extract(job_description)
        if not required_skills:
            return round(min(len(parsed_resume.skills) / 12 * 100, 100), 2)

        resume_skill_set = {s.lower() for s in parsed_resume.skills}
        required_skill_set = {s.lower() for s in required_skills}
        matched = resume_skill_set & required_skill_set
        return round((len(matched) / len(required_skill_set)) * 100, 2)

    @staticmethod
    def _experience_score(parsed_resume: ParsedResumeData) -> float:
        count = len(parsed_resume.experience)
        if count == 0:
            return 30.0
        return round(min(30 + count * 15, 100), 2)

    @staticmethod
    def _education_score(parsed_resume: ParsedResumeData) -> float:
        count = len(parsed_resume.education)
        if count == 0:
            return 40.0
        return round(min(40 + count * 20, 100), 2)

    @staticmethod
    def _compatibility_label(overall_score: float) -> str:
        if overall_score >= 85:
            return "Excellent ATS Compatibility"
        if overall_score >= 70:
            return "Good ATS Compatibility"
        if overall_score >= 50:
            return "Moderate ATS Compatibility"
        return "Poor ATS Compatibility"

    @staticmethod
    def _build_suggestions(
        parsed_resume: ParsedResumeData,
        formatting_score: float,
        keyword_score: float,
        skill_score: float,
        experience_score: float,
        education_score: float,
        missing_keywords_list: List[str],
    ) -> List[str]:
        suggestions: List[str] = []

        if not parsed_resume.email:
            suggestions.append("Add a professional email address near the top of your resume.")
        if not parsed_resume.phone:
            suggestions.append("Add a valid phone number for recruiters to reach you.")
        if formatting_score < 70:
            suggestions.append("Use a simple, single-column layout with clear section headers for better ATS parsing.")
        if keyword_score < 60:
            suggestions.append("Incorporate more role-specific keywords from the job description into your resume.")
        if missing_keywords_list:
            top_missing = ", ".join(missing_keywords_list[:8])
            suggestions.append(f"Consider adding these missing keywords if relevant: {top_missing}.")
        if skill_score < 60:
            suggestions.append("Highlight more of your technical skills explicitly in a dedicated 'Skills' section.")
        if experience_score < 60:
            suggestions.append("Add measurable achievements and quantifiable impact to your experience section.")
        if education_score < 60:
            suggestions.append("Ensure your education section clearly lists degree, institution, and year.")
        if len(parsed_resume.skills) < 5:
            suggestions.append("List at least 8-12 relevant technical and soft skills.")
        if not suggestions:
            suggestions.append("Your resume looks strong. Keep it updated with recent projects and achievements.")

        return suggestions


@lru_cache(maxsize=1)
def get_ats_service() -> ATSService:
    """Return a process-wide cached ATSService instance."""
    return ATSService()
