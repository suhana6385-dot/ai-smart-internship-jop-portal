"""
services package
==================
Purpose:
    Business logic layer. Every domain (resume, ats, skill_gap,
    recommendation, career, certification, interview, ranking, trend)
    has one service module here. API routers in api/*.py stay thin and
    only handle HTTP concerns (validation, status codes), delegating all
    actual computation to these services.

Architecture:
    Each service is implemented as a class instantiated once as a
    module-level singleton and exposed via a `get_<name>_service()`
    factory (used for FastAPI Dependency Injection in the routers).
"""
