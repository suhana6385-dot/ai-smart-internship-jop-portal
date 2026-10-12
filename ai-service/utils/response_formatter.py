"""
utils/response_formatter.py
============================
Purpose:
    Provides a single, consistent JSON envelope for every API response
    (success and error) so the MERN frontend can rely on one shape:
        { "success": bool, "message": str, "data": Any, "errors": Any }

Architecture:
    Two small helper functions used by every router in api/*.py.

Usage Example:
    from utils.response_formatter import success_response
    return success_response(data=parsed_resume, message="Resume parsed successfully")
"""

from __future__ import annotations

from typing import Any, Optional

from fastapi.responses import JSONResponse


def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    """
    Build a standardized success JSON response.

    Parameters:
        data: Payload to return to the client.
        message: Human readable success message.
        status_code: HTTP status code (default 200).

    Returns:
        JSONResponse with a consistent envelope.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
            "errors": None,
        },
    )


def error_response(message: str = "An error occurred", status_code: int = 400, errors: Optional[Any] = None) -> JSONResponse:
    """
    Build a standardized error JSON response.

    Parameters:
        message: Human readable error message.
        status_code: HTTP status code (default 400).
        errors: Optional structured error details (validation errors, etc.).

    Returns:
        JSONResponse with a consistent envelope.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": None,
            "errors": errors,
        },
    )
