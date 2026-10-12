"""
utils/keyword_extractor.py
===========================
Purpose:
    Extracts the most significant keywords from a document using TF-IDF
    term weighting. Used by the ATS module to compare resume keywords
    against a target job description and surface missing keywords.

Architecture:
    Thin wrapper around scikit-learn's TfidfVectorizer, instantiated
    fresh per-call since the vocabulary depends on the specific pair of
    documents being compared (resume vs job description), so caching a
    single fitted vectorizer would be incorrect here.

Usage Example:
    from utils.keyword_extractor import extract_top_keywords, missing_keywords
    top = extract_top_keywords(job_description_text, top_n=15)
    missing = missing_keywords(resume_text, job_description_text)
"""

from __future__ import annotations

from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer

from utils.text_cleaner import STOPWORDS, clean_text


def extract_top_keywords(text: str, top_n: int = 20) -> List[str]:
    """
    Extract the top-N highest TF-IDF weighted keywords/phrases from a
    single document.

    Parameters:
        text: Source text (e.g. a job description).
        top_n: Number of top keywords to return.

    Returns:
        List of keyword strings ordered by descending TF-IDF weight.
    """
    cleaned = clean_text(text)
    if not cleaned:
        return []

    vectorizer = TfidfVectorizer(
        stop_words=list(STOPWORDS),
        ngram_range=(1, 2),
        max_features=200,
        lowercase=True,
    )
    try:
        tfidf_matrix = vectorizer.fit_transform([cleaned])
    except ValueError:
        # Happens when the document has no usable vocabulary after cleaning.
        return []

    scores = tfidf_matrix.toarray()[0]
    feature_names = vectorizer.get_feature_names_out()
    ranked = sorted(zip(feature_names, scores), key=lambda pair: pair[1], reverse=True)
    return [term for term, score in ranked[:top_n] if score > 0]


def missing_keywords(resume_text: str, job_description_text: str, top_n: int = 25) -> List[str]:
    """
    Compute keywords that appear as important in the job description but
    are absent from the resume text.

    Parameters:
        resume_text: Candidate's resume text.
        job_description_text: Target job description text.
        top_n: Number of top job-description keywords to consider.

    Returns:
        List of keywords present in the job description but missing
        from the resume.
    """
    jd_keywords = extract_top_keywords(job_description_text, top_n=top_n)
    resume_lower = clean_text(resume_text).lower()
    return [kw for kw in jd_keywords if kw.lower() not in resume_lower]
