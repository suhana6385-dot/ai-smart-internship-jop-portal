"""
utils/validators.py
====================
Purpose:
    Reusable validation helpers: file extension/MIME/size checks, email
    and phone validation, and filename sanitisation to prevent path
    traversal attacks on uploaded files.

Architecture:
    Pure functions, no side effects other than raising the appropriate
    exception from utils.exceptions on failure.

Usage Example:
    from utils.validators import validate_resume_file, sanitize_filename
    validate_resume_file(filename="resume.pdf", size_bytes=204800)
    safe_name = sanitize_filename("../../etc/passwd.pdf")
"""

from __future__ import annotations

import os
import re
from pathlib import Path

from utils.config import settings
from utils.exceptions import FileTooLargeError, InvalidFileError

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"(\+?\d{1,3}[-.\s]?)?(\d{10}|\d{5}[-.\s]\d{5}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})")


def validate_resume_file(filename: str, size_bytes: int) -> None:
    """
    Validate that an uploaded resume file has an allowed extension and
    does not exceed the configured maximum size.

    Parameters:
        filename: Original uploaded filename.
        size_bytes: Size of the uploaded file content in bytes.

    Raises:
        InvalidFileError: If the extension is not allowed.
        FileTooLargeError: If the file exceeds the configured limit.
    """
    if not filename:
        raise InvalidFileError("Uploaded file has no filename")

    extension = Path(filename).suffix.lower()
    if extension not in settings.allowed_resume_extensions_list:
        raise InvalidFileError(
            f"Unsupported file type '{extension}'. Allowed types: "
            f"{', '.join(settings.allowed_resume_extensions_list)}"
        )

    if size_bytes <= 0:
        raise InvalidFileError("Uploaded file is empty")

    if size_bytes > settings.max_upload_size_bytes:
        raise FileTooLargeError(
            f"File size {size_bytes / (1024 * 1024):.2f}MB exceeds the "
            f"{settings.MAX_UPLOAD_SIZE_MB}MB limit"
        )


def sanitize_filename(filename: str) -> str:
    """
    Strip directory components and dangerous characters from a filename
    to prevent path traversal when saving uploaded files to disk.

    Parameters:
        filename: The raw, user-supplied filename.

    Returns:
        A sanitized filename safe to use with os.path.join().
    """
    base_name = os.path.basename(filename)
    safe_name = re.sub(r"[^A-Za-z0-9._-]", "_", base_name)
    return safe_name or "uploaded_file"


def is_valid_email(email: str) -> bool:
    """Return True if the given string matches a basic email pattern."""
    return bool(email and EMAIL_REGEX.match(email.strip()))


def is_valid_phone(phone: str) -> bool:
    """Return True if the given string matches a basic phone number pattern."""
    return bool(phone and PHONE_REGEX.search(phone.strip()))
