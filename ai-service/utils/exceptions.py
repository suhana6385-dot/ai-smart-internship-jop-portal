"""
utils/exceptions.py
====================
Purpose:
    Defines a hierarchy of custom, domain-specific exceptions used across
    the service layer. Raising these (instead of generic Exception) lets
    the global exception handlers in app.py map each error type to the
    correct HTTP status code and a consistent JSON error body.

Architecture:
    All exceptions derive from `AIServiceError`, which carries an
    `status_code` and a `message`. Specialized subclasses set sensible
    defaults for common failure modes (bad file, missing field, model
    error, etc.) but still allow overriding the message per-raise-site.

Usage Example:
    from utils.exceptions import InvalidFileError
    raise InvalidFileError("Only PDF and DOCX files are supported")
"""

from __future__ import annotations


class AIServiceError(Exception):
    """
    Base exception for all custom errors raised inside the AI service.

    Attributes:
        message: Human readable error description returned to the client.
        status_code: HTTP status code to be used by the global handler.
    """

    status_code: int = 500

    def __init__(self, message: str = "An unexpected error occurred", status_code: int | None = None):
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        super().__init__(self.message)


class InvalidFileError(AIServiceError):
    """Raised when an uploaded file has an unsupported type or is corrupted."""
    status_code = 415

    def __init__(self, message: str = "Unsupported or corrupted file format"):
        super().__init__(message, status_code=415)


class FileTooLargeError(AIServiceError):
    """Raised when an uploaded file exceeds the configured size limit."""
    status_code = 413

    def __init__(self, message: str = "Uploaded file exceeds the maximum allowed size"):
        super().__init__(message, status_code=413)


class MissingResumeError(AIServiceError):
    """Raised when a resume file is required but was not provided."""
    status_code = 400

    def __init__(self, message: str = "No resume file was provided"):
        super().__init__(message, status_code=400)


class InvalidRequestError(AIServiceError):
    """Raised when the incoming request payload fails business validation."""
    status_code = 422

    def __init__(self, message: str = "Invalid request payload"):
        super().__init__(message, status_code=422)


class ResumeParsingError(AIServiceError):
    """Raised when resume text/field extraction fails irrecoverably."""
    status_code = 422

    def __init__(self, message: str = "Failed to parse the resume file"):
        super().__init__(message, status_code=422)


class ModelInferenceError(AIServiceError):
    """Raised when a machine learning model fails during inference."""
    status_code = 500

    def __init__(self, message: str = "Model inference failed"):
        super().__init__(message, status_code=500)


class DatasetNotFoundError(AIServiceError):
    """Raised when a required dataset CSV file is missing or unreadable."""
    status_code = 500

    def __init__(self, message: str = "Required dataset could not be loaded"):
        super().__init__(message, status_code=500)


class DatabaseError(AIServiceError):
    """Raised when a MongoDB operation fails."""
    status_code = 503

    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, status_code=503)


class ResourceNotFoundError(AIServiceError):
    """Raised when a requested resource (job, internship, etc.) does not exist."""
    status_code = 404

    def __init__(self, message: str = "Requested resource was not found"):
        super().__init__(message, status_code=404)
