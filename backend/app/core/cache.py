"""
Redis caching service for LANA AI Platform
"""
import json
import redis.asyncio as redis
from typing import Optional, Any
from functools import wraps
from .config import settings


class CacheService:
    """Redis-based caching service"""

    def __init__(self):
        self._redis: Optional[redis.Redis] = None

    async def connect(self):
        """Initialize Redis connection"""
        if not self._redis:
            try:
                self._redis = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
            except Exception as e:
                print(f"Redis connection error: {e}")
                self._redis = None

    async def close(self):
        """Close Redis connection"""
        if self._redis:
            await self._redis.close()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self._redis:
            await self.connect()
        try:
            value = await self._redis.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception:
            return None

    async def set(self, key: str, value: Any, ttl: int = 300):
        """Set value in cache with TTL (default 5 minutes)"""
        if not self._redis:
            await self.connect()
        try:
            await self._redis.setex(key, ttl, json.dumps(value))
        except Exception:
            pass

    async def delete(self, key: str):
        """Delete key from cache"""
        if not self._redis:
            await self.connect()
        try:
            await self._redis.delete(key)
        except Exception:
            pass

    async def delete_pattern(self, pattern: str):
        """Delete all keys matching pattern"""
        if not self._redis:
            await self.connect()
        try:
            keys = await self._redis.keys(pattern)
            if keys:
                await self._redis.delete(*keys)
        except Exception:
            pass

    async def is_healthy(self) -> bool:
        """Check if Redis is healthy"""
        try:
            if not self._redis:
                await self.connect()
            if self._redis:
                await self._redis.ping()
                return True
            return False
        except Exception:
            return False


# Global cache instance
cache = CacheService()


# Cache keys
class CacheKeys:
    """Cache key patterns"""
    USER_BALANCE = "user:{user_id}:balance"
    USER_SETTINGS = "user:{user_id}:settings"
    MODELS_LIST = "models:list"
    MODELS_PRICES = "models:prices"
    USD_RATE = "currency:usd"

    @staticmethod
    def user_balance(user_id: int) -> str:
        return f"user:{user_id}:balance"

    @staticmethod
    def user_settings(user_id: int) -> str:
        return f"user:{user_id}:settings"


# Cache TTLs (in seconds)
class CacheTTL:
    SHORT = 60  # 1 minute
    MEDIUM = 300  # 5 minutes
    LONG = 3600  # 1 hour
    VERY_LONG = 86400  # 24 hours
