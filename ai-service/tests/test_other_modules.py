"""
tests/test_other_modules.py
=============================
Purpose:
    Integration tests covering the Interview, Ranking, Career,
    Certification, and Industry Trends endpoints.
"""

from __future__ import annotations


def test_interview_generation(client):
    payload = {
        "skills": ["Python", "SQL"],
        "role": "Backend Developer",
        "num_technical": 2,
        "num_hr": 2,
        "num_coding": 2,
        "num_mcq": 2,
        "num_behavioral": 2,
    }
    response = client.post("/api/interview/generate", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data["technical_questions"]) <= 2
    assert len(data["mcq_questions"][0]["options"]) >= 2 if data["mcq_questions"] else True


def test_candidate_ranking(client):
    payload = {
        "candidates": [
            {
                "candidate_id": "C1", "name": "Alice", "ats_score": 85, "projects_count": 4,
                "cgpa": 8.5, "experience_years": 1, "certifications_count": 2,
                "skill_match_percentage": 80, "communication_score": 75, "interview_score": 80,
            },
            {
                "candidate_id": "C2", "name": "Bob", "ats_score": 60, "projects_count": 1,
                "cgpa": 6.5, "experience_years": 0, "certifications_count": 0,
                "skill_match_percentage": 50, "communication_score": 60, "interview_score": 55,
            },
        ]
    }
    response = client.post("/api/ranking/rank", json=payload)
    assert response.status_code == 200
    ranked = response.json()["data"]["ranked_candidates"]
    assert ranked[0]["candidate_id"] == "C1"
    assert ranked[0]["rank"] == 1


def test_career_recommendation(client):
    payload = {"skills": ["Python", "Machine Learning", "Scikit-learn"], "top_n": 3}
    response = client.post("/api/career/recommend", json=payload)
    assert response.status_code == 200
    results = response.json()["data"]["results"]
    assert len(results) <= 3


def test_certification_recommendation(client):
    payload = {"missing_skills": ["AWS", "Docker"]}
    response = client.post("/api/certification/recommend", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_industry_trends(client):
    response = client.get("/api/trends?top_n=5")
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data["top_skills"]) <= 5
    assert len(data["top_companies"]) > 0
