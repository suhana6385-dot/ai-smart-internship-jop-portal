"""
tests/conftest.py
===================
Purpose:
    Shared pytest fixtures for the test suite: a TestClient bound to
    the FastAPI app, and small sample payloads reused across tests.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app import app


@pytest.fixture(scope="session")
def client() -> TestClient:
    """Return a FastAPI TestClient bound to the application."""
    with TestClient(app) as test_client:
        yield test_client
