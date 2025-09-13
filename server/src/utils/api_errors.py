# Simple Error Handling for Flask Backend
from flask import jsonify
import logging

logger = logging.getLogger(__name__)


class APIError(Exception):
    """Base API Exception with status code and message"""

    def __init__(self, message: str, status_code: int = 500):
        super().__init__()
        self.message = message
        self.status_code = status_code


class ValidationError(APIError):
    """400 - Bad Request"""

    def __init__(self, message: str = "Invalid input"):
        super().__init__(message, 400)


class AuthenticationError(APIError):
    """401 - Unauthorized"""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, 401)


class AuthorizationError(APIError):
    """403 - Forbidden"""

    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, 403)


class NotFoundError(APIError):
    """404 - Not Found"""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404)


def handle_api_error(error):
    """Global error handler for API errors"""
    logger.error(f"API Error: {error.message} (Status: {error.status_code})")
    return jsonify({"error": error.message}), error.status_code
