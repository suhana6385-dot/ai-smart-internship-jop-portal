"""
trained_models/inference_tfidf_vectorizer.py
==============================================
Purpose:
    Loads the Joblib-persisted TF-IDF vectorizer produced by
    train_tfidf_vectorizer.py and exposes a small helper to transform
    new text into TF-IDF vectors using the frozen, pre-trained
    vocabulary, instead of refitting per request.

Where this model is used:
    Can be imported by services/recommendation_service.py or
    utils/keyword_extractor.py as a performance optimization once
    trained_models/tfidf_vectorizer.joblib exists on disk (run
    train_tfidf_vectorizer.py first). Falls back gracefully with a
    clear error if the model file has not been trained yet.

How to run (as a smoke test):
    python trained_models/inference_tfidf_vectorizer.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

import joblib

from utils.config import settings
from utils.exceptions import ModelInferenceError
from utils.logger import logger
from utils.text_cleaner import clean_text

_VECTORIZER_PATH = settings.TRAINED_MODELS_DIR / "tfidf_vectorizer.joblib"
_vectorizer_cache = None


def load_vectorizer():
    """
    Load (and cache) the pre-trained TF-IDF vectorizer from disk.

    Returns:
        A fitted sklearn TfidfVectorizer instance.

    Raises:
        ModelInferenceError: If the model file has not been trained yet.
    """
    global _vectorizer_cache
    if _vectorizer_cache is not None:
        return _vectorizer_cache

    if not _VECTORIZER_PATH.exists():
        raise ModelInferenceError(
            f"TF-IDF vectorizer not found at {_VECTORIZER_PATH}. "
            f"Run 'python trained_models/train_tfidf_vectorizer.py' first."
        )

    logger.info(f"Loading trained TF-IDF vectorizer from {_VECTORIZER_PATH}")
    _vectorizer_cache = joblib.load(_VECTORIZER_PATH)
    return _vectorizer_cache


def transform(texts: list[str]):
    """
    Transform a list of raw texts into TF-IDF vectors using the
    pre-trained vocabulary.

    Parameters:
        texts: List of raw text documents.

    Returns:
        A scipy sparse matrix of shape (len(texts), vocab_size).
    """
    vectorizer = load_vectorizer()
    cleaned = [clean_text(t) for t in texts]
    return vectorizer.transform(cleaned)


if __name__ == "__main__":
    sample_texts = ["Python FastAPI backend developer with MongoDB experience"]
    try:
        vectors = transform(sample_texts)
        logger.info(f"Transformed {len(sample_texts)} sample text(s) into shape {vectors.shape}")
    except ModelInferenceError as exc:
        logger.warning(str(exc))
