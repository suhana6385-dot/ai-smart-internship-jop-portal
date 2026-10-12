"""
tests/test_skill_gap.py
=========================
Purpose:
    Unit/integration tests for the Skill Gap Analysis endpoint.
"""

from __future__ import annotations


def test_skill_gap_analysis(client):
    payload = {
        "student_skills": ["Python", "Git", "SQL"],
        "job_required_skills": ["Python", "FastAPI", "MongoDB", "Docker"],
        "target_role": "Backend Developer",
    }
    response = client.post("/api/skill-gap/analyze", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    data = body["data"]
    assert "Python" in data["strong_skills"]
    assert data["matched_skill_percentage"] > 0
    assert len(data["learning_roadmap"]) > 0


def test_skill_gap_requires_non_empty_lists(client):
    payload = {"student_skills": [], "job_required_skills": ["Python"]}
    response = client.post("/api/skill-gap/analyze", json=payload)
    assert response.status_code == 422
