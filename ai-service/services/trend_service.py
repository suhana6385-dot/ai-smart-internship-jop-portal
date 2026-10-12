"""
services/trend_service.py
===========================
Purpose:
    Business logic for the Industry Trend Prediction module. Reads the
    industry_trends.csv and companies.csv datasets to surface top
    skills, trending technologies, growing domains, top hiring
    companies, and projected future careers.

Architecture:
    `TrendService` loads both datasets once at construction. "Prediction"
    here is implemented as a deterministic ranking over the curated
    trends dataset (growth_rate/demand_level), which is the standard,
    explainable approach for a labeled trends dataset of this size —
    it avoids the overfitting risk of training a model on <20 rows
    while still satisfying the "Use datasets" requirement from the spec.

Usage Example:
    from services.trend_service import get_trend_service
    service = get_trend_service()
    result = service.get_trends(domain=None, top_n=10)
"""

from __future__ import annotations

from functools import lru_cache
from typing import List, Optional

import pandas as pd

from models.trends import IndustryTrendResponse, TopCompanyItem, TrendItem
from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger

_DEMAND_RANK = {"Very High": 4, "High": 3, "Medium": 2, "Low": 1}
_GROWTH_RANK = {"High": 3, "Medium": 2, "Low": 1}

_FUTURE_CAREER_MAP = {
    "AI/ML": ["Machine Learning Engineer", "AI Research Scientist", "MLOps Engineer"],
    "Cloud": ["Cloud Architect", "Cloud Security Engineer", "Site Reliability Engineer"],
    "DevOps": ["DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"],
    "Data Science": ["Data Scientist", "Data Analyst", "Business Intelligence Analyst"],
    "Frontend": ["Frontend Engineer", "UI Engineer"],
    "Security": ["Cybersecurity Analyst", "Security Engineer", "Penetration Tester"],
    "Architecture": ["Solutions Architect", "Systems Architect"],
    "Programming": ["Software Engineer", "Backend Engineer"],
}


class TrendService:
    """
    Surfaces industry hiring trends and future career projections from
    the curated trends and companies datasets.
    """

    def __init__(self) -> None:
        self.trends_df = self._load_dataset("industry_trends.csv")
        self.companies_df = self._load_dataset("companies.csv")

    @staticmethod
    def _load_dataset(filename: str) -> pd.DataFrame:
        path = settings.DATASETS_DIR / filename
        try:
            return pd.read_csv(path)
        except FileNotFoundError as exc:
            raise DatasetNotFoundError(f"Dataset not found at {path}") from exc

    def get_trends(self, domain: Optional[str] = None, top_n: int = 10) -> IndustryTrendResponse:
        """
        Build the full industry trend report, optionally filtered by domain.

        Parameters:
            domain: Optional domain filter, e.g. 'AI/ML'.
            top_n: Number of top skills to return.

        Returns:
            IndustryTrendResponse with skills, domains, companies, and
            projected future careers.
        """
        df = self.trends_df.copy()
        if domain:
            df = df[df["domain"].str.lower() == domain.lower()]

        df["_rank_score"] = (
            df["demand_level"].map(_DEMAND_RANK).fillna(0)
            + df["growth_rate"].map(_GROWTH_RANK).fillna(0)
        )
        df = df.sort_values("_rank_score", ascending=False)

        top_skills = [
            TrendItem(
                skill=row["skill"],
                domain=row["domain"],
                growth_rate=row["growth_rate"],
                demand_level=row["demand_level"],
                year=int(row["year"]),
            )
            for _, row in df.head(top_n).iterrows()
        ]

        trending_technologies = df.head(top_n)["skill"].tolist()
        growing_domains = df[df["growth_rate"] == "High"]["domain"].unique().tolist()

        top_companies = [
            TopCompanyItem(
                company_name=row["company_name"],
                industry=row["industry"],
                location=row["location"],
                hiring_domains=[d.strip() for d in str(row["hiring_domains"]).split(",")],
            )
            for _, row in self.companies_df.iterrows()
        ]

        future_careers = self._project_future_careers(growing_domains)

        logger.info(f"Trend report generated: skills={len(top_skills)} domains={len(growing_domains)}")

        return IndustryTrendResponse(
            top_skills=top_skills,
            trending_technologies=trending_technologies,
            growing_domains=growing_domains,
            top_companies=top_companies,
            future_careers=future_careers,
        )

    @staticmethod
    def _project_future_careers(growing_domains: List[str]) -> List[str]:
        careers = set()
        for domain in growing_domains:
            careers.update(_FUTURE_CAREER_MAP.get(domain, []))
        if not careers:
            careers.update(["Software Engineer", "Data Analyst", "Cloud Engineer"])
        return sorted(careers)


@lru_cache(maxsize=1)
def get_trend_service() -> TrendService:
    """Return a process-wide cached TrendService instance."""
    return TrendService()
