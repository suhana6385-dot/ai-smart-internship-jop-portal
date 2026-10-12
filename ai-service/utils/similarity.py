"""
utils/similarity.py
====================
Purpose:
    Provides text similarity primitives used by the recommendation and
    ranking engines: TF-IDF vectorization + cosine similarity for
    comparing free-text profiles (resumes, job descriptions) and a
    simple Jaccard/overlap score for comparing structured skill sets.

    Note on architecture choice: the master spec lists Sentence
    Transformers for semantic embeddings. To keep this service
    lightweight, dependency-conflict-free and runnable without
    downloading large transformer weights, the default similarity
    engine here is TF-IDF + cosine similarity from scikit-learn, which
    is fully offline and fast. `services/recommendation_service.py` is
    written so this engine can be swapped for a sentence-transformers
    embedding model with a one-line change if that optional dependency
    is installed (see requirements.txt).

Usage Example:
    from utils.similarity import cosine_similarity_matrix, skill_overlap_score
    scores = cosine_similarity_matrix(query_text, corpus_texts)
    overlap = skill_overlap_score(candidate_skills, required_skills)
"""

from __future__ import annotations

from typing import Iterable, List

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from utils.text_cleaner import STOPWORDS, clean_text, normalize_skill_name


def cosine_similarity_matrix(query_text: str, corpus_texts: List[str]) -> np.ndarray:
    """
    Compute cosine similarity between a query document and a corpus of
    documents using TF-IDF vectorization fitted jointly over all texts.

    Parameters:
        query_text: The text to compare against the corpus (e.g. resume).
        corpus_texts: List of candidate documents (e.g. job descriptions).

    Returns:
        1D numpy array of similarity scores in [0, 1], one per corpus item,
        aligned by index with `corpus_texts`. Returns zeros if vectorization
        is not possible (e.g. all texts empty).
    """
    if not corpus_texts:
        return np.array([])

    documents = [clean_text(query_text)] + [clean_text(t) for t in corpus_texts]

    vectorizer = TfidfVectorizer(stop_words=list(STOPWORDS), ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
    except ValueError:
        return np.zeros(len(corpus_texts))

    query_vector = tfidf_matrix[0:1]
    corpus_matrix = tfidf_matrix[1:]
    similarities = cosine_similarity(query_vector, corpus_matrix)[0]
    return similarities


def skill_overlap_score(candidate_skills: Iterable[str], required_skills: Iterable[str]) -> float:
    """
    Compute the fraction of required skills that the candidate possesses
    (a directional overlap score, not symmetric Jaccard), useful for
    ranking how well a candidate matches a specific job's requirements.

    Parameters:
        candidate_skills: Skills the candidate has.
        required_skills: Skills required by the job/internship.

    Returns:
        A float in [0, 1] representing the proportion of required
        skills matched. Returns 0.0 if `required_skills` is empty.
    """
    required_set = {normalize_skill_name(s) for s in required_skills}
    candidate_set = {normalize_skill_name(s) for s in candidate_skills}

    if not required_set:
        return 0.0

    matched = required_set & candidate_set
    return round(len(matched) / len(required_set), 4)


def combined_match_score(
    text_similarity: float,
    skill_overlap: float,
    text_weight: float = 0.4,
    skill_weight: float = 0.6,
) -> float:
    """
    Blend a free-text similarity score with a structured skill-overlap
    score into a single weighted match score.

    Parameters:
        text_similarity: Cosine similarity score in [0, 1].
        skill_overlap: Skill overlap score in [0, 1].
        text_weight: Weight applied to the text similarity component.
        skill_weight: Weight applied to the skill overlap component.

    Returns:
        Weighted combined score in [0, 1], rounded to 4 decimals.
    """
    score = (text_similarity * text_weight) + (skill_overlap * skill_weight)
    return round(min(max(score, 0.0), 1.0), 4)
