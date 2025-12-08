"""
Retry decorator for external API calls
"""
import asyncio
from functools import wraps
from typing import Type, Tuple, Callable
import random
from .logging import logger, log_error


def async_retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: Tuple[Type[Exception], ...] = (Exception,),
    jitter: bool = True
):
    """
    Async retry decorator with exponential backoff

    Args:
        max_attempts: Maximum number of retry attempts
        delay: Initial delay between retries (seconds)
        backoff: Multiplier for delay after each retry
        exceptions: Tuple of exceptions to catch and retry
        jitter: Add random jitter to delay
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            last_exception = None
            current_delay = delay

            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e

                    if attempt == max_attempts:
                        logger.error(
                            f"Retry exhausted for {func.__name__}",
                            function=func.__name__,
                            attempts=attempt,
                            error=str(e)
                        )
                        raise

                    # Calculate delay with optional jitter
                    wait_time = current_delay
                    if jitter:
                        wait_time += random.uniform(0, current_delay * 0.5)

                    logger.warning(
                        f"Retry attempt {attempt}/{max_attempts} for {func.__name__}",
                        function=func.__name__,
                        attempt=attempt,
                        max_attempts=max_attempts,
                        error=str(e),
                        next_delay=round(wait_time, 2)
                    )

                    await asyncio.sleep(wait_time)
                    current_delay *= backoff

            raise last_exception

        return wrapper
    return decorator


class RetryableError(Exception):
    """Error that should trigger a retry"""
    pass


class NonRetryableError(Exception):
    """Error that should not trigger a retry"""
    pass


# Common HTTP errors that should be retried
RETRYABLE_HTTP_CODES = {408, 429, 500, 502, 503, 504}


def should_retry_http(status_code: int) -> bool:
    """Check if HTTP status code should trigger retry"""
    return status_code in RETRYABLE_HTTP_CODES
