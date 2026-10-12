"""
tests/test_core.py
====================
Purpose:
    Smoke tests for the root and health-check endpoints.
"""

from __future__ import annotations


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "running"


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "healthy"
