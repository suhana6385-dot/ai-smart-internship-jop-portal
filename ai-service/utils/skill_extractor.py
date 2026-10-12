"""
utils/skill_extractor.py
=========================
Purpose:
    Extracts a normalized list of technical/soft skills present in a
    block of free text (resume text or job description) by matching
    against the canonical skills dataset (datasets/skills.csv) using
    exact substring matching plus RapidFuzz fuzzy matching to catch
    minor spelling variations (e.g. "Java Script" -> "JavaScript").

Architecture:
    `SkillExtractor` loads and caches the skills dataset once (singleton
    pattern via module-level instance) and exposes `extract()`. This
    keeps the CSV parsed only once per process lifetime for performance.

Usage Example:
    from utils.skill_extractor import skill_extractor
    found_skills = skill_extractor.extract(resume_text)
"""

from __future__ import annotations

from functools import lru_cache
from typing import List, Set

import pandas as pd
from rapidfuzz import fuzz, process

from utils.config import settings
from utils.exceptions import DatasetNotFoundError
from utils.logger import logger
from utils.text_cleaner import normalize_skill_name


class SkillExtractor:
    """
    Loads the canonical skills taxonomy and extracts matching skills
    from arbitrary text using exact and fuzzy matching.

    Attributes:
        skills_df: DataFrame loaded from datasets/skills.csv.
        canonical_skills: List of canonical skill display names.
        _normalized_lookup: Dict mapping normalized skill name -> canonical name.
    """

    def __init__(self) -> None:
        self.skills_df = self._load_skills_dataset()
        self.canonical_skills: List[str] = self.skills_df["skill"].tolist()
        self._normalized_lookup = {
            normalize_skill_name(skill): skill for skill in self.canonical_skills
        }

    @staticmethod
    def _load_skills_dataset() -> pd.DataFrame:
        """Load the skills.csv dataset, raising a clear error if missing."""
        path = settings.DATASETS_DIR / "skills.csv"
        try:
            return pd.read_csv(path)
        except FileNotFoundError as exc:
            logger.error(f"Skills dataset not found at {path}")
            raise DatasetNotFoundError(f"Skills dataset not found at {path}") from exc

    def extract(self, text: str, fuzzy_threshold: int = 88) -> List[str]:
        """
        Extract canonical skill names present in the given text.

        Parameters:
            text: Free text to scan (resume content, job description, etc.).
            fuzzy_threshold: Minimum RapidFuzz similarity score (0-100) to
                accept a fuzzy match for multi-word skills.

        Returns:
            Sorted list of unique canonical skill names found in the text.
        """
        if not text:
            return []

        text_lower = f" {text.lower()} "
        found: Set[str] = set()

        # 1. Exact substring pass (fast, precise).
        for normalized, canonical in self._normalized_lookup.items():
            pattern = f" {normalized} "
            if pattern in text_lower or f" {normalized}," in text_lower or f" {normalized}." in text_lower:
                found.add(canonical)

        # 2. Fuzzy pass over individual text chunks for skills not
        #    already found exactly, to catch minor typos/variants.
        remaining_candidates = [s for s in self.canonical_skills if s not in found]
        text_chunks = set(
            chunk.strip() for chunk in text.replace("\n", ",").replace("|", ",").split(",") if chunk.strip()
        )
        for chunk in text_chunks:
            if len(chunk) > 40:
                continue
            match = process.extractOne(
                chunk, remaining_candidates, scorer=fuzz.token_sort_ratio
            )
            if match and match[1] >= fuzzy_threshold:
                found.add(match[0])

        return sorted(found)

    def match_score(self, skill_a: str, skill_b: str) -> float:
        """Return a 0-100 fuzzy similarity score between two skill strings."""
        return fuzz.token_sort_ratio(skill_a, skill_b)


@lru_cache(maxsize=1)
def get_skill_extractor() -> SkillExtractor:
    """Return a process-wide cached SkillExtractor instance (loaded once)."""
    return SkillExtractor()


# Module-level singleton for convenient direct import.
skill_extractor = get_skill_extractor()
