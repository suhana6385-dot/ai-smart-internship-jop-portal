"""
utils package
==============
Purpose:
    Collection of reusable, stateless helper modules used across the
    services and api layers: file readers, text cleaning, skill/keyword
    extraction, similarity computation, validators, logging and response
    formatting.

Architecture:
    Every module in this package is dependency-light and free of business
    logic. They are pure utilities that can be unit tested in isolation.
"""
