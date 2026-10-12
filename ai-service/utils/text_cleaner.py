"""
utils/text_cleaner.py
======================
Purpose:
    Normalizes raw extracted resume/job text before it is fed into the
    extraction, similarity, or ATS scoring pipelines: collapses
    whitespace, strips bullet/control characters, and provides a
    tokenizer used by the keyword/skill extractors.

Architecture:
    Pure functions with no external state or I/O.

Usage Example:
    from utils.text_cleaner import clean_text, tokenize
    cleaned = clean_text(raw_resume_text)
    tokens = tokenize(cleaned)
"""

from __future__ import annotations

import re
from typing import List

_WHITESPACE_RE = re.compile(r"[ \t]+")
_MULTI_NEWLINE_RE = re.compile(r"\n{2,}")
_BULLET_RE = re.compile(r"^[\u2022\u25CF\u25AA\-\*\u2023\u2043]\s*", re.MULTILINE)
_NON_PRINTABLE_RE = re.compile(r"[^\x20-\x7E\n]")
_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z0-9+.#/-]*")

# A minimal English stopword list (kept local to avoid an nltk download
# dependency at runtime, per the lightweight-by-default design decision).
STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "then", "so", "for", "to",
    "of", "in", "on", "at", "by", "with", "from", "as", "is", "are", "was",
    "were", "be", "been", "being", "this", "that", "these", "those", "it",
    "its", "i", "we", "you", "he", "she", "they", "them", "our", "your",
    "their", "have", "has", "had", "will", "would", "can", "could", "should",
    "not", "no", "yes", "do", "does", "did", "about", "into", "over", "than",
    "also", "such", "using", "used", "use", "etc",
}


def clean_text(raw_text: str) -> str:
    """
    Normalize whitespace, strip non-printable characters and bullet
    markers from raw extracted text.

    Parameters:
        raw_text: Text extracted from a PDF/DOCX file.

    Returns:
        A cleaned, normalized string.
    """
    if not raw_text:
        return ""

    text = _NON_PRINTABLE_RE.sub(" ", raw_text)
    text = _BULLET_RE.sub("", text)
    text = _WHITESPACE_RE.sub(" ", text)
    text = _MULTI_NEWLINE_RE.sub("\n", text)
    return text.strip()


def tokenize(text: str, remove_stopwords: bool = True) -> List[str]:
    """
    Tokenize cleaned text into lowercase word tokens, optionally
    removing common English stopwords.

    Parameters:
        text: Cleaned text to tokenize.
        remove_stopwords: Whether to filter out stopwords.

    Returns:
        List of lowercase tokens.
    """
    tokens = [match.group(0).lower() for match in _TOKEN_RE.finditer(text)]
    if remove_stopwords:
        tokens = [tok for tok in tokens if tok not in STOPWORDS and len(tok) > 1]
    return tokens


def normalize_skill_name(skill: str) -> str:
    """Lowercase and strip a skill name for consistent dictionary lookups."""
    return re.sub(r"\s+", " ", skill.strip().lower())
