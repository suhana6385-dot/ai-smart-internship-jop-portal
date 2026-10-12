"""
services/skill_gap_service.py
==============================
Purpose:
    Business logic for the Skill Gap Analysis module. Compares a
    student's current skills against a target job's required skills to
    identify missing/weak/strong skills and produce a prioritized
    learning roadmap with difficulty and time estimates.

Architecture:
    `SkillGapService` uses RapidFuzz (via utils.skill_extractor) for
    near-match detection (a "weak" skill is one the student has a
    partial/fuzzy match for but not an exact one) and a static
    difficulty/time-estimate lookup table keyed by skill category
    (sourced from datasets/skills.csv) as a lightweight substitute for
    a trained difficulty-prediction model.

Usage Example:
    from services.skill_gap_service import get_skill_gap_service
    service = get_skill_gap_service()
    result = service.analyze(student_skills, job_required_skills, "Backend Developer")
"""

from __future__ import annotations

from functools import lru_cache
from typing import List

import pandas as pd

from models.common import DifficultyLevel
from models.skill_gap import LearningRoadmapItem, SkillGapResponse
from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger
from utils.skill_extractor import skill_extractor
from utils.text_cleaner import normalize_skill_name

# Category -> (difficulty, estimated learning time) lookup, used to give
# realistic, deterministic estimates without needing a trained model.
_CATEGORY_DIFFICULTY = {
    "Programming": (DifficultyLevel.MEDIUM, "3-4 weeks"),
    "Database": (DifficultyLevel.EASY, "1-2 weeks"),
    "Backend": (DifficultyLevel.MEDIUM, "3-5 weeks"),
    "Frontend": (DifficultyLevel.EASY, "2-3 weeks"),
    "AI/ML": (DifficultyLevel.HARD, "6-10 weeks"),
    "Data Science": (DifficultyLevel.MEDIUM, "4-6 weeks"),
    "Cloud": (DifficultyLevel.MEDIUM, "4-6 weeks"),
    "DevOps": (DifficultyLevel.HARD, "5-8 weeks"),
    "Tools": (DifficultyLevel.EASY, "1 week"),
    "Architecture": (DifficultyLevel.HARD, "6-8 weeks"),
    "Core CS": (DifficultyLevel.MEDIUM, "4-6 weeks"),
    "Soft Skill": (DifficultyLevel.EASY, "Ongoing practice"),
}
_DEFAULT_DIFFICULTY = (DifficultyLevel.MEDIUM, "3-4 weeks")


class SkillGapService:
    """
    Computes a detailed skill gap report between a candidate's current
    skills and a target job's required skills.
    """

    def __init__(self) -> None:
        self._skill_category_map = self._load_skill_category_map()

    @staticmethod
    def _load_skill_category_map() -> dict:
        path = settings.DATASETS_DIR / "skills.csv"
        try:
            df = pd.read_csv(path)
        except FileNotFoundError as exc:
            raise DatasetNotFoundError(f"Skills dataset not found at {path}") from exc
        return {
            normalize_skill_name(row["skill"]): row["category"]
            for _, row in df.iterrows()
        }

    def analyze(
        self,
        student_skills: List[str],
        job_required_skills: List[str],
        target_role: str,
    ) -> SkillGapResponse:
        """
        Compare student skills against job-required skills and build a
        full gap analysis with a prioritized learning roadmap.

        Parameters:
            student_skills: Skills the student currently possesses.
            job_required_skills: Skills required by the target job.
            target_role: Display name of the target role.

        Returns:
            SkillGapResponse with matched percentage, categorized
            skills, and a learning roadmap sorted by priority.
        """
        student_norm = {normalize_skill_name(s): s for s in student_skills}
        required_norm = {normalize_skill_name(s): s for s in job_required_skills}

        strong_skills: List[str] = []
        weak_skills: List[str] = []
        missing_skills: List[str] = []

        for norm_req, display_req in required_norm.items():
            if norm_req in student_norm:
                strong_skills.append(display_req)
                continue

            # Check for a fuzzy/partial match to classify as "weak"
            # (student has something related but not an exact match).
            best_score = 0.0
            for norm_stu in student_norm:
                score = skill_extractor.match_score(norm_req, norm_stu)
                best_score = max(best_score, score)

            if best_score >= 60:
                weak_skills.append(display_req)
            else:
                missing_skills.append(display_req)

        matched_percentage = round(
            (len(strong_skills) / len(required_norm)) * 100 if required_norm else 0.0, 2
        )

        roadmap = self._build_roadmap(missing_skills + weak_skills)

        logger.info(
            f"Skill gap analysis for '{target_role}': "
            f"strong={len(strong_skills)} weak={len(weak_skills)} missing={len(missing_skills)}"
        )

        return SkillGapResponse(
            target_role=target_role,
            matched_skill_percentage=matched_percentage,
            missing_skills=missing_skills,
            weak_skills=weak_skills,
            strong_skills=strong_skills,
            learning_roadmap=roadmap,
        )

    def _build_roadmap(self, skills_to_learn: List[str]) -> List[LearningRoadmapItem]:
        """
        Build a prioritized learning roadmap for the given list of
        missing/weak skills. Priority is assigned by category importance
        (Core CS/Backend/AI-ML prioritized) then alphabetically.
        """
        priority_order = {
            "Backend": 1, "Programming": 1, "AI/ML": 1, "Core CS": 2,
            "Database": 2, "Frontend": 2, "Cloud": 3, "DevOps": 3,
            "Data Science": 3, "Architecture": 4, "Tools": 4, "Soft Skill": 5,
        }

        enriched = []
        for skill in skills_to_learn:
            category = self._skill_category_map.get(normalize_skill_name(skill), "General")
            difficulty, est_time = _CATEGORY_DIFFICULTY.get(category, _DEFAULT_DIFFICULTY)
            rank = priority_order.get(category, 6)
            enriched.append((rank, skill, difficulty, est_time))

        enriched.sort(key=lambda item: (item[0], item[1]))

        roadmap = [
            LearningRoadmapItem(
                skill=skill,
                difficulty=difficulty,
                estimated_learning_time=est_time,
                learning_priority=idx + 1,
            )
            for idx, (_, skill, difficulty, est_time) in enumerate(enriched)
        ]
        return roadmap


@lru_cache(maxsize=1)
def get_skill_gap_service() -> SkillGapService:
    """Return a process-wide cached SkillGapService instance."""
    return SkillGapService()
