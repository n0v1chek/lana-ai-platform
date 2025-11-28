import httpx
import logging
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional

logger = logging.getLogger(__name__)

class OpenRouterPricesService:
    def __init__(self):
        self._prices: Dict[str, Tuple[float, float]] = {}
        self._last_update: Optional[datetime] = None
        self._cache_hours: int = 24  # Обновляем раз в сутки
        self._api_url = "https://openrouter.ai/api/v1/models"

        # Модели которые нам нужны (синхронизировано с ai_service.py)
        self._target_models = {
            # Экономичные
            "google/gemini-2.0-flash-001",
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "deepseek/deepseek-chat",
            "deepseek/deepseek-r1",
            
            # Стандартные
            "anthropic/claude-3.5-haiku",
            "openai/o3-mini",
            "mistralai/mistral-large-2411",
            
            # Премиум
            "openai/gpt-4o",
            "google/gemini-2.5-pro",
            "anthropic/claude-sonnet-4",
            "anthropic/claude-3.5-sonnet",
            "anthropic/claude-3.7-sonnet",
            "x-ai/grok-3",
            "openai/gpt-4-turbo",
            
            # Ультра
            "anthropic/claude-opus-4",
            "openai/o1",
            "openai/o1-pro",
        }

    async def fetch_prices(self) -> Dict[str, Tuple[float, float]]:
        """Получить актуальные цены с OpenRouter API"""
        now = datetime.now()

        # Возвращаем кэш если свежий
        if self._last_update and (now - self._last_update) < timedelta(hours=self._cache_hours):
            return self._prices

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(self._api_url)

                if response.status_code == 200:
                    data = response.json()
                    models = data.get("data", [])

                    new_prices = {}
                    for model in models:
                        model_id = model.get("id", "")

                        # Берём только нужные модели
                        if model_id not in self._target_models:
                            continue

                        pricing = model.get("pricing", {})

                        # Цены в долларах за токен, конвертируем в $ за 1M токенов
                        prompt_price = float(pricing.get("prompt", 0)) * 1_000_000
                        completion_price = float(pricing.get("completion", 0)) * 1_000_000

                        if prompt_price > 0 or completion_price > 0:
                            new_prices[model_id] = (prompt_price, completion_price)
                            logger.info(f"Price updated: {model_id} = ${prompt_price:.4f} / ${completion_price:.4f} per 1M")

                    if new_prices:
                        self._prices = new_prices
                        self._last_update = now
                        logger.info(f"OpenRouter prices updated: {len(new_prices)} models")

                    return self._prices
                else:
                    logger.warning(f"OpenRouter API returned {response.status_code}")

        except Exception as e:
            logger.error(f"Failed to fetch OpenRouter prices: {e}")

        return self._prices

    def get_cached_prices(self) -> Dict[str, Tuple[float, float]]:
        """Получить кэшированные цены (синхронно)"""
        return self._prices

    def get_last_update(self) -> Optional[datetime]:
        """Когда последний раз обновлялись цены"""
        return self._last_update


openrouter_prices_service = OpenRouterPricesService()
