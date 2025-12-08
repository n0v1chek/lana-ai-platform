"""
Structured logging configuration for LANA AI Platform
"""
import logging
import sys
import json
from datetime import datetime
from typing import Any, Dict
import uuid
from contextvars import ContextVar

# Context variable for request ID tracking
request_id_var: ContextVar[str] = ContextVar('request_id', default='')


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""

    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add request ID if available
        request_id = request_id_var.get()
        if request_id:
            log_data["request_id"] = request_id

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields
        if hasattr(record, 'extra_data'):
            log_data.update(record.extra_data)

        return json.dumps(log_data, ensure_ascii=False)


class AppLogger:
    """Application logger with context support"""

    def __init__(self, name: str = "lana-ai"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # Remove existing handlers
        self.logger.handlers.clear()

        # Console handler with JSON format
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(JSONFormatter())
        self.logger.addHandler(console_handler)

    def _log(self, level: int, message: str, **kwargs):
        """Internal log method with extra data support"""
        extra = {'extra_data': kwargs} if kwargs else {}
        self.logger.log(level, message, extra=extra)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)

    def error(self, message: str, **kwargs):
        self._log(logging.ERROR, message, **kwargs)

    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)

    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)

    def critical(self, message: str, **kwargs):
        self._log(logging.CRITICAL, message, **kwargs)


# Global logger instance
logger = AppLogger()


def generate_request_id() -> str:
    """Generate unique request ID"""
    return str(uuid.uuid4())[:8]


def set_request_id(request_id: str):
    """Set request ID in context"""
    request_id_var.set(request_id)


def get_request_id() -> str:
    """Get current request ID"""
    return request_id_var.get()


# Logging helpers for common events
def log_api_request(method: str, path: str, user_id: int = None):
    """Log API request"""
    logger.info(
        f"API Request: {method} {path}",
        method=method,
        path=path,
        user_id=user_id,
        event="api_request"
    )


def log_api_response(method: str, path: str, status_code: int, duration_ms: float):
    """Log API response"""
    logger.info(
        f"API Response: {method} {path} -> {status_code}",
        method=method,
        path=path,
        status_code=status_code,
        duration_ms=round(duration_ms, 2),
        event="api_response"
    )


def log_auth_event(event_type: str, user_id: int = None, username: str = None, success: bool = True):
    """Log authentication event"""
    level = logging.INFO if success else logging.WARNING
    logger._log(
        level,
        f"Auth: {event_type}",
        event="auth",
        event_type=event_type,
        user_id=user_id,
        username=username,
        success=success
    )


def log_payment_event(event_type: str, user_id: int, amount: float, status: str):
    """Log payment event"""
    logger.info(
        f"Payment: {event_type}",
        event="payment",
        event_type=event_type,
        user_id=user_id,
        amount=amount,
        status=status
    )


def log_ai_request(user_id: int, model: str, tokens: int, cost_rub: float):
    """Log AI API request"""
    logger.info(
        f"AI Request: {model}",
        event="ai_request",
        user_id=user_id,
        model=model,
        tokens=tokens,
        cost_rub=round(cost_rub, 4)
    )


def log_error(error: Exception, context: str = None):
    """Log error with context"""
    logger.error(
        f"Error: {str(error)}",
        event="error",
        error_type=type(error).__name__,
        context=context,
        exc_info=True
    )
