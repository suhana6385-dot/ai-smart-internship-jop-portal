"""
services/certification_service.py
===================================
Purpose:
    Business logic for the Certification Recommendation module. Maps a
    list of missing skills to relevant certifications/courses from
    datasets/courses.csv and datasets/certifications.csv, optionally
    filtered by preferred providers.

Usage Example:
    from services.certification_service import get_certification_service
    service = get_certification_service()
    result = service.recommend(request)
"""

from __future__ import annotations

from functools import lru_cache
from typing import List

import pandas as pd

from models.certification import (
    CertificationItem,
    CertificationRecommendationRequest,
    CertificationRecommendationResponse,
)
from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger
from utils.text_cleaner import normalize_skill_name


class CertificationService:
    """
    Recommends certifications/courses that address a candidate's
    missing skills.
    """

    def __init__(self) -> None:
        self.courses_df = self._load_dataset("courses.csv")

    @staticmethod
    def _load_dataset(filename: str) -> pd.DataFrame:
        path = settings.DATASETS_DIR / filename
        try:
            return pd.read_csv(path)
        except FileNotFoundError as exc:
            raise DatasetNotFoundError(f"Dataset not found at {path}") from exc

    def recommend(self, request: CertificationRecommendationRequest) -> CertificationRecommendationResponse:
        """
        Recommend certifications/courses that teach the given missing
        skills, optionally filtered by preferred providers.

        Parameters:
            request: Missing skills and optional provider filter.

        Returns:
            CertificationRecommendationResponse with matched courses.
        """
        missing_norm = {normalize_skill_name(s) for s in request.missing_skills}
        preferred_providers_lower = {p.lower() for p in request.preferred_providers}

        results: List[CertificationItem] = []
        for _, course in self.courses_df.iterrows():
            if normalize_skill_name(course["skill"]) not in missing_norm:
                continue
            if preferred_providers_lower and course["provider"].lower() not in preferred_providers_lower:
                continue
            results.append(
                CertificationItem(
                    course_name=course["course_name"],
                    provider=course["provider"],
                    related_skill=course["skill"],
                    level=course["level"],
                    url=course["url"],
                )
            )

        logger.info(f"Certification recommendation matched {len(results)} courses")

        return CertificationRecommendationResponse(results=results)


@lru_cache(maxsize=1)
def get_certification_service() -> CertificationService:
    """Return a process-wide cached CertificationService instance."""
    return CertificationService()
