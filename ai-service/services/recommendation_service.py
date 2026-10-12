"""
services/recommendation_service.py
====================================
Purpose:
    Business logic for the Internship & Job Recommendation module.
    Ranks the jobs/internships datasets against a candidate's profile
    using a blend of TF-IDF cosine similarity (semantic/text match) and
    structured skill overlap, then filters/boosts by location, domain
    and experience.

Architecture:
    `RecommendationService` loads the jobs.csv and internships.csv
    datasets once at construction time. `recommend_jobs()` and
    `recommend_internships()` share a private `_recommend()` core.

    Swapping to sentence-transformers: replace the call to
    `utils.similarity.cosine_similarity_matrix` with a
    SentenceTransformer.encode() + cosine_similarity call if the
    optional dependency is installed; the rest of the ranking/blending
    logic is engine-agnostic.

Usage Example:
    from services.recommendation_service import get_recommendation_service
    service = get_recommendation_service()
    result = service.recommend_jobs(request)
"""

from __future__ import annotations

from functools import lru_cache
from typing import List, Optional

import numpy as np
import pandas as pd

from models.recommendation import RecommendationRequest, RecommendedItem, RecommendationResponse
from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger
from utils.similarity import combined_match_score, cosine_similarity_matrix, skill_overlap_score
from utils.text_cleaner import normalize_skill_name


class RecommendationService:
    """
    Recommends jobs and internships to a candidate using a hybrid
    TF-IDF similarity + skill overlap ranking model.
    """

    def __init__(self) -> None:
        self.jobs_df = self._load_dataset("jobs.csv")
        self.internships_df = self._load_dataset("internships.csv")

    @staticmethod
    def _load_dataset(filename: str) -> pd.DataFrame:
        path = settings.DATASETS_DIR / filename
        try:
            df = pd.read_csv(path)
        except FileNotFoundError as exc:
            raise DatasetNotFoundError(f"Dataset not found at {path}") from exc
        df["required_skills_list"] = df["required_skills"].apply(
            lambda s: [skill.strip() for skill in str(s).split(",") if skill.strip()]
        )
        return df

    def recommend_jobs(self, request: RecommendationRequest) -> RecommendationResponse:
        """Recommend jobs for the given candidate profile."""
        return self._recommend(
            request=request,
            df=self.jobs_df,
            id_col="job_id",
            extra_fields=["experience_required", "salary_range", "description"],
        )

    def recommend_internships(self, request: RecommendationRequest) -> RecommendationResponse:
        """Recommend internships for the given candidate profile."""
        return self._recommend(
            request=request,
            df=self.internships_df,
            id_col="internship_id",
            extra_fields=["duration", "stipend", "description"],
        )

    def _recommend(
        self,
        request: RecommendationRequest,
        df: pd.DataFrame,
        id_col: str,
        extra_fields: List[str],
    ) -> RecommendationResponse:
        if df.empty:
            return RecommendationResponse(total_candidates_considered=0, results=[])

        candidate_profile_text = self._build_candidate_text(request)
        corpus_texts = (
            df["title"] + " " + df["domain"] + " " + df["required_skills"] + " " + df["description"]
        ).tolist()

        text_similarities = cosine_similarity_matrix(candidate_profile_text, corpus_texts)
        if text_similarities.size == 0:
            text_similarities = np.zeros(len(df))

        results: List[RecommendedItem] = []
        for idx, row in df.reset_index(drop=True).iterrows():
            required_skills = row["required_skills_list"]
            overlap = skill_overlap_score(request.skills, required_skills)
            text_sim = float(text_similarities[idx]) if idx < len(text_similarities) else 0.0
            score = combined_match_score(text_sim, overlap)

            # Location/domain soft-boosts (do not hard-filter, since a
            # remote-friendly or adjacent-domain match may still be relevant).
            if request.preferred_location and request.preferred_location.strip().lower() in str(row["location"]).lower():
                score = min(score + 0.05, 1.0)
            if request.preferred_domain and request.preferred_domain.strip().lower() in str(row["domain"]).lower():
                score = min(score + 0.05, 1.0)

            candidate_norm = {normalize_skill_name(s) for s in request.skills}
            matched = [s for s in required_skills if normalize_skill_name(s) in candidate_norm]
            missing = [s for s in required_skills if normalize_skill_name(s) not in candidate_norm]

            extra = {field: row[field] for field in extra_fields if field in row}

            results.append(
                RecommendedItem(
                    id=str(row[id_col]),
                    title=row["title"],
                    company=row["company"],
                    location=row["location"],
                    domain=row["domain"],
                    required_skills=required_skills,
                    match_score=round(score, 4),
                    matched_skills=matched,
                    missing_skills=missing,
                    extra=extra,
                )
            )

        results.sort(key=lambda item: item.match_score, reverse=True)
        top_results = results[: request.top_n]

        logger.info(
            f"Generated {len(top_results)} recommendations "
            f"(top score={top_results[0].match_score if top_results else 0})"
        )

        return RecommendationResponse(
            total_candidates_considered=len(df),
            results=top_results,
        )

    @staticmethod
    def _build_candidate_text(request: RecommendationRequest) -> str:
        parts = [
            " ".join(request.skills),
            request.education or "",
            request.preferred_domain or "",
            request.resume_text or "",
        ]
        return " ".join(p for p in parts if p)


@lru_cache(maxsize=1)
def get_recommendation_service() -> RecommendationService:
    """Return a process-wide cached RecommendationService instance."""
    return RecommendationService()
