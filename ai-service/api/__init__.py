"""
api package
============
Purpose:
    FastAPI routers, one per domain module. Each router handles HTTP
    concerns only (request parsing, status codes, response envelopes)
    and delegates all business logic to the corresponding service in
    services/*.py.
"""
