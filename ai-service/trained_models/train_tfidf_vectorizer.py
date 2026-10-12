"""
trained_models/train_tfidf_vectorizer.py
==========================================
Purpose:
    Trains and persists (via Joblib) a TF-IDF vectorizer fitted over
    the combined corpus of all job/internship descriptions and the
    skills dataset. This vectorizer can optionally be reused by
    services/recommendation_service.py and utils/keyword_extractor.py
    to avoid refitting a vectorizer on every single request when
    running at high traffic volumes (the default runtime behaviour
    fits per-request for correctness/simplicity; this pre-trained
    vectorizer is an optional performance upgrade path).

Where this model is used:
    Loaded by trained_models/inference_tfidf_vectorizer.py, which can
    be wired into utils/similarity.py's cosine_similarity_matrix() as
    a drop-in replacement for the per-request TfidfVectorizer().

How to run:
    python trained_models/train_tfidf_vectorizer.py

Output:
    trained_models/tfidf_vectorizer.joblib
"""

from __future__ import annotations

import sys
from pathlib import Path

# Allow running this script directly (adds project root to sys.path).
sys.path.append(str(Path(__file__).resolve().parent.parent))

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

from utils.config import settings
from utils.logger import logger
from utils.text_cleaner import STOPWORDS, clean_text


def build_corpus() -> list[str]:
    """Combine job and internship descriptions plus skill names into one training corpus."""
    jobs_df = pd.read_csv(settings.DATASETS_DIR / "jobs.csv")
    internships_df = pd.read_csv(settings.DATASETS_DIR / "internships.csv")
    skills_df = pd.read_csv(settings.DATASETS_DIR / "skills.csv")

    corpus = []
    corpus.extend((jobs_df["title"] + " " + jobs_df["required_skills"] + " " + jobs_df["description"]).tolist())
    corpus.extend(
        (internships_df["title"] + " " + internships_df["required_skills"] + " " + internships_df["description"]).tolist()
    )
    corpus.extend(skills_df["skill"].tolist())

    return [clean_text(doc) for doc in corpus if isinstance(doc, str) and doc.strip()]


def train_and_save() -> None:
    """Fit a TF-IDF vectorizer over the dataset corpus and persist it with Joblib."""
    corpus = build_corpus()
    logger.info(f"Training TF-IDF vectorizer on {len(corpus)} documents")

    vectorizer = TfidfVectorizer(stop_words=list(STOPWORDS), ngram_range=(1, 2), max_features=500)
    vectorizer.fit(corpus)

    settings.TRAINED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    output_path = settings.TRAINED_MODELS_DIR / "tfidf_vectorizer.joblib"
    joblib.dump(vectorizer, output_path)

    logger.info(f"Saved trained TF-IDF vectorizer to {output_path}")


if __name__ == "__main__":
    train_and_save()
