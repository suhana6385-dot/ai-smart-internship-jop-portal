"""
services/ranking_service.py
=============================
Purpose:
    Business logic for the Candidate Ranking module. Computes a
    weighted composite score (0-100) for each candidate across ATS
    score, project count, CGPA, experience, certifications, skill
    match, communication, and interview score, then ranks candidates
    in descending order of composite score.

Architecture:
    `RankingService` normalizes each raw metric onto a 0-100 scale
    before applying weights, so metrics with different natural ranges
    (e.g. CGPA out of 10 vs ATS score out of 100) contribute fairly.

Usage Example:
    from services.ranking_service import get_ranking_service
    service = get_ranking_service()
    result = service.rank(request)
"""

from __future__ import annotations

from functools import lru_cache
from typing import Dict, List

from models.ranking import CandidateInput, CandidateRankingRequest, CandidateRankingResponse, RankedCandidate
from utils.exceptions import InvalidRequestError
from utils.logger import logger

_DEFAULT_WEIGHTS: Dict[str, float] = {
    "ats": 0.20,
    "projects": 0.10,
    "cgpa": 0.10,
    "experience": 0.15,
    "certifications": 0.10,
    "skill_match": 0.20,
    "communication": 0.075,
    "interview": 0.075,
}

# Caps used to normalize count-based metrics onto a 0-100 scale.
_PROJECTS_CAP = 8
_EXPERIENCE_CAP_YEARS = 5
_CERTIFICATIONS_CAP = 6


class RankingService:
    """
    Ranks a list of candidates by a configurable weighted composite score.
    """

    def rank(self, request: CandidateRankingRequest) -> CandidateRankingResponse:
        """
        Rank all submitted candidates by composite score.

        Parameters:
            request: List of candidates and optional custom weights.

        Returns:
            CandidateRankingResponse with candidates sorted by rank.

        Raises:
            InvalidRequestError: If custom weights do not sum to ~1.0.
        """
        weights = self._resolve_weights(request.weights)

        scored: List[RankedCandidate] = []
        for candidate in request.candidates:
            breakdown = self._score_breakdown(candidate, weights)
            composite = round(sum(breakdown.values()), 2)
            scored.append(
                RankedCandidate(
                    rank=0,  # assigned after sort
                    candidate_id=candidate.candidate_id,
                    name=candidate.name,
                    composite_score=composite,
                    breakdown=breakdown,
                )
            )

        scored.sort(key=lambda c: c.composite_score, reverse=True)
        for idx, candidate in enumerate(scored):
            candidate.rank = idx + 1

        logger.info(f"Ranked {len(scored)} candidates")

        return CandidateRankingResponse(ranked_candidates=scored)

    @staticmethod
    def _resolve_weights(custom_weights: dict | None) -> Dict[str, float]:
        if not custom_weights:
            return _DEFAULT_WEIGHTS

        missing_keys = set(_DEFAULT_WEIGHTS.keys()) - set(custom_weights.keys())
        if missing_keys:
            raise InvalidRequestError(f"Missing weight keys: {', '.join(missing_keys)}")

        total = sum(custom_weights.values())
        if not (0.98 <= total <= 1.02):
            raise InvalidRequestError(f"Custom weights must sum to 1.0 (got {total})")

        return {key: float(custom_weights[key]) for key in _DEFAULT_WEIGHTS}

    @staticmethod
    def _score_breakdown(candidate: CandidateInput, weights: Dict[str, float]) -> Dict[str, float]:
        normalized = {
            "ats": candidate.ats_score,  # already 0-100
            "projects": min(candidate.projects_count / _PROJECTS_CAP, 1.0) * 100,
            "cgpa": min(candidate.cgpa / 10.0, 1.0) * 100,
            "experience": min(candidate.experience_years / _EXPERIENCE_CAP_YEARS, 1.0) * 100,
            "certifications": min(candidate.certifications_count / _CERTIFICATIONS_CAP, 1.0) * 100,
            "skill_match": candidate.skill_match_percentage,  # already 0-100
            "communication": candidate.communication_score,  # already 0-100
            "interview": candidate.interview_score,  # already 0-100
        }
        return {key: round(normalized[key] * weights[key], 2) for key in normalized}


@lru_cache(maxsize=1)
def get_ranking_service() -> RankingService:
    """Return a process-wide cached RankingService instance."""
    return RankingService()
