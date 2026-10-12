"""
api/ranking.py
================
Purpose:
    Exposes the Candidate Ranking endpoint. Accepts a list of
    candidates with their evaluation metrics and returns them ranked by
    a weighted composite score.

Flow of execution:
    Client -> POST /api/ranking/rank (JSON body)
        -> RankingService.rank()
        -> success_response(CandidateRankingResponse)
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from models.ranking import CandidateRankingRequest, CandidateRankingResponse
from services.ranking_service import RankingService, get_ranking_service
from utils.response_formatter import success_response

router = APIRouter(prefix="/api/ranking", tags=["Ranking"])


@router.post("/rank", summary="Rank multiple candidates by composite score")
async def rank_candidates(
    request: CandidateRankingRequest,
    service: RankingService = Depends(get_ranking_service),
):
    """
    Rank a list of candidates by a weighted composite score.

    Parameters:
        request: List of candidates with evaluation metrics, optional custom weights.
        service: Injected RankingService singleton.

    Returns:
        Standardized success JSON envelope wrapping CandidateRankingResponse.
    """
    result: CandidateRankingResponse = service.rank(request)
    return success_response(data=result.model_dump(), message="Candidates ranked successfully")
