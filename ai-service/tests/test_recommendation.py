"""
tests/test_recommendation.py
==============================
Purpose:
    Unit/integration tests for the Job/Internship Recommendation
    endpoints.
"""

from __future__ import annotations


def test_recommend_jobs(client):
    payload = {
        "skills": ["Python", "FastAPI", "MongoDB", "Docker"],
        "preferred_domain": "Backend Development",
        "top_n": 5,
    }
    response = client.post("/api/recommend/jobs", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    results = body["data"]["results"]
    assert len(results) > 0
    assert results[0]["match_score"] >= results[-1]["match_score"]


def test_recommend_internships(client):
    payload = {"skills": ["React", "JavaScript", "CSS"], "top_n": 3}
    response = client.post("/api/recommend/internships", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert len(body["data"]["results"]) <= 3
