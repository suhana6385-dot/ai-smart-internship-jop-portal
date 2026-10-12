"""
services/career_service.py
============================
Purpose:
    Business logic for the Career Recommendation module. Ranks the
    career_paths.csv dataset against a candidate's skills (and optional
    interests) using skill overlap, returning full career details:
    salary range, future scope, roadmap steps, and matched course links.

Architecture:
    `CareerService` loads career_paths.csv once and cross-references
    courses.csv to attach learning resources for each career's missing
    skills.

Usage Example:
    from services.career_service import get_career_service
    service = get_career_service()
    result = service.recommend(request)
"""

from __future__ import annotations

from functools import lru_cache
from typing import List, Optional

import pandas as pd

from models.career import CareerPathItem, CareerRecommendationRequest, CareerRecommendationResponse
from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger
from utils.similarity import skill_overlap_score
from utils.text_cleaner import normalize_skill_name


class CareerService:
    """
    Recommends suitable career paths for a candidate based on skill
    overlap with each career path's required skill set.
    """

    def __init__(self) -> None:
        self.career_df = self._load_dataset("career_paths.csv")
        self.courses_df = self._load_dataset("courses.csv")

    @staticmethod
    def _load_dataset(filename: str) -> pd.DataFrame:
        path = settings.DATASETS_DIR / filename
        try:
            df = pd.read_csv(path)
        except FileNotFoundError as exc:
            raise DatasetNotFoundError(f"Dataset not found at {path}") from exc
        if "required_skills" in df.columns:
            df["required_skills_list"] = df["required_skills"].apply(
                lambda s: [skill.strip() for skill in str(s).split(",") if skill.strip()]
            )
        return df

    def recommend(self, request: CareerRecommendationRequest) -> CareerRecommendationResponse:
        """
        Recommend the top-N career paths for the given candidate skills.

        Parameters:
            request: Candidate skills, optional interests, and top_n.

        Returns:
            CareerRecommendationResponse with ranked career paths.
        """
        candidate_norm = {normalize_skill_name(s) for s in request.skills}
        results: List[CareerPathItem] = []

        for _, row in self.career_df.iterrows():
            required_skills = row["required_skills_list"]
            overlap = skill_overlap_score(request.skills, required_skills)

            domain_boost = 0.0
            if request.interests:
                interests_lower = [i.lower() for i in request.interests]
                if any(interest in str(row["domain"]).lower() for interest in interests_lower):
                    domain_boost = 0.1

            score = round(min(overlap + domain_boost, 1.0), 4)

            matched = [s for s in required_skills if normalize_skill_name(s) in candidate_norm]
            missing = [s for s in required_skills if normalize_skill_name(s) not in candidate_norm]
            resources = self._learning_resources_for(missing)
            roadmap_steps = [step.strip() for step in str(row["roadmap"]).split("->")]

            results.append(
                CareerPathItem(
                    career_name=row["career_name"],
                    domain=row["domain"],
                    match_score=score,
                    required_skills=required_skills,
                    matched_skills=matched,
                    missing_skills=missing,
                    salary_range=row["salary_range"],
                    future_scope=row["future_scope"],
                    roadmap=roadmap_steps,
                    learning_resources=resources,
                )
            )

        results.sort(key=lambda item: item.match_score, reverse=True)
        top_results = results[: request.top_n]

        logger.info(f"Career recommendation generated {len(top_results)} results")

        return CareerRecommendationResponse(results=top_results)

    def _learning_resources_for(self, missing_skills: List[str], limit_per_skill: int = 1) -> List[str]:
        resources: List[str] = []
        missing_norm = {normalize_skill_name(s) for s in missing_skills}
        for _, course in self.courses_df.iterrows():
            if normalize_skill_name(course["skill"]) in missing_norm:
                resources.append(f"{course['course_name']} ({course['provider']}) - {course['url']}")
            if len(resources) >= len(missing_skills) * limit_per_skill:
                break
        return resources[:8]


@lru_cache(maxsize=1)
def get_career_service() -> CareerService:
    """Return a process-wide cached CareerService instance."""
    return CareerService()
