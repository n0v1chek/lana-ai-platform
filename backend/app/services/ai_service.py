import math
import httpx
from typing import Dict, Any, Optional
from ..core.config import settings
from .currency_service import currency_service
from .openrouter_prices import openrouter_prices_service

# ============================================
# СИСТЕМА КОИНОВ - 1 коин = 1 копейка (100 коинов = 1₽)
# Маржа ×10 (900%)
# Комиссия YooKassa 1.2% (×1.012)
# Спред курса +8%
# Курс: автоматически с ЦБ РФ
# ============================================

MARGIN_MULTIPLIER = 10.0  # 900% маржа
YOOKASSA_COMMISSION = 1.012  # 1.2% комиссия YooKassa
COINS_PER_RUB = 100


def get_usd_to_coins_multiplier(usd_rate: float) -> float:
    """Рассчитывает множитель USD -> коины с учётом маржи и комиссий"""
    return usd_rate * MARGIN_MULTIPLIER * YOOKASSA_COMMISSION * COINS_PER_RUB


# Цены OpenRouter в долларах за 1M токенов (input, output) - FALLBACK
MODEL_PRICES_USD = {
    "google/gemini-2.0-flash-001": (0.10, 0.40),
    "google/gemini-2.5-flash": (0.15, 0.60),
    "google/gemini-2.5-flash-lite": (0.075, 0.30),
    "openai/gpt-4o-mini": (0.15, 0.60),
    "deepseek/deepseek-chat": (0.14, 0.28),
    "deepseek/deepseek-r1": (0.55, 2.19),
    "qwen/qwen-plus": (0.15, 0.60),
    "mistralai/mistral-small": (0.10, 0.30),
    "openai/gpt-4o": (2.50, 10.00),
    "openai/gpt-4-turbo": (10.00, 30.00),
    "anthropic/claude-3.5-haiku": (0.80, 4.00),
    "anthropic/claude-haiku-4": (0.80, 4.00),
    "mistralai/mistral-large-2411": (2.00, 6.00),
    "google/gemini-2.5-pro": (1.25, 10.00),
    "anthropic/claude-sonnet-4": (3.00, 15.00),
    "anthropic/claude-3.5-sonnet": (3.00, 15.00),
    "anthropic/claude-3.7-sonnet": (3.00, 15.00),
    "x-ai/grok-3": (3.00, 15.00),
    "x-ai/grok-3-beta": (3.00, 15.00),
    "anthropic/claude-opus-4": (15.00, 75.00),
    "openai/o1": (15.00, 60.00),
    "openai/o1-pro": (150.00, 600.00),
    "openai/o3-mini": (1.10, 4.40),
}

DEFAULT_PRICE_USD = (5.00, 20.00)

MODEL_MAP = {
    "gpt-4o": "openai/gpt-4o",
    "gpt-4o-mini": "openai/gpt-4o-mini",
    "gpt-4-turbo": "openai/gpt-4-turbo",
    "claude-sonnet": "anthropic/claude-sonnet-4",
    "claude-haiku": "anthropic/claude-haiku-4",
    "claude-opus": "anthropic/claude-opus-4",
    "gemini-flash": "google/gemini-2.0-flash-001",
    "gemini-pro": "google/gemini-2.5-pro",
    "deepseek": "deepseek/deepseek-chat",
}


def get_model_id(model: str) -> str:
    """Получает полный ID модели"""
    return MODEL_MAP.get(model, model)


def calculate_cost_sync(input_tokens: int, output_tokens: int, model_id: str, usd_rate: float = 95.0) -> int:
    """Синхронный расчёт стоимости в коинах"""
    model_id = get_model_id(model_id)
    prices = MODEL_PRICES_USD.get(model_id, DEFAULT_PRICE_USD)
    input_price, output_price = prices
    cost_usd = (input_tokens / 1_000_000) * input_price + (output_tokens / 1_000_000) * output_price
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    cost_coins = cost_usd * multiplier
    return max(1, math.ceil(cost_coins))


async def get_model_prices_usd() -> dict:
    """Получить актуальные цены моделей в USD (с OpenRouter или fallback)"""
    openrouter_prices = await openrouter_prices_service.fetch_prices()
    if openrouter_prices:
        merged = dict(MODEL_PRICES_USD)
        merged.update(openrouter_prices)
        return merged
    return MODEL_PRICES_USD


async def calculate_cost(input_tokens: int, output_tokens: int, model_id: str) -> int:
    """Асинхронный расчёт стоимости с актуальным курсом и ценами OpenRouter"""
    usd_rate = await currency_service.get_usd_rate()
    prices_usd = await get_model_prices_usd()
    model_id_normalized = get_model_id(model_id)
    prices = prices_usd.get(model_id_normalized, DEFAULT_PRICE_USD)
    input_price, output_price = prices
    cost_usd = (input_tokens / 1_000_000) * input_price + (output_tokens / 1_000_000) * output_price
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    cost_coins = cost_usd * multiplier
    return max(1, math.ceil(cost_coins))


async def calculate_cost_detailed(input_tokens: int, output_tokens: int, model_id: str) -> dict:
    """Расчёт стоимости с полной детализацией для мониторинга"""
    usd_rate = await currency_service.get_usd_rate()
    prices_usd = await get_model_prices_usd()
    model_id_normalized = get_model_id(model_id)
    prices = prices_usd.get(model_id_normalized, DEFAULT_PRICE_USD)
    input_price, output_price = prices
    
    # Расчётная себестоимость в USD (по нашим ценам API)
    cost_usd = (input_tokens / 1_000_000) * input_price + (output_tokens / 1_000_000) * output_price
    
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    cost_coins = max(1, math.ceil(cost_usd * multiplier))
    
    return {
        "coins": cost_coins,
        "cost_usd": cost_usd,
        "usd_rate": usd_rate,
        "input_price_per_1m": input_price,
        "output_price_per_1m": output_price,
        "multiplier": multiplier
    }


async def get_current_rate_info():
    """Информация о текущем курсе для админки"""
    usd_rate = await currency_service.get_usd_rate()
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    return {
        "usd_rate": round(usd_rate, 2),
        "cbr_rate": round(currency_service.get_cbr_rate(), 2),
        "margin_percent": (MARGIN_MULTIPLIER - 1) * 100,
        "yookassa_percent": (YOOKASSA_COMMISSION - 1) * 100,
        "total_multiplier": round(multiplier, 2),
        "last_update": currency_service._last_update.isoformat() if currency_service._last_update else None,
        "example_1usd": round(multiplier, 0),
    }


MODEL_INFO = {
    "google/gemini-2.0-flash-001": {"name": "Gemini 2.0 Flash", "provider": "Google"},
    "google/gemini-2.5-flash": {"name": "Gemini 2.5 Flash", "provider": "Google"},
    "google/gemini-2.5-flash-lite": {"name": "Gemini 2.5 Flash Lite", "provider": "Google"},
    "google/gemini-2.5-pro": {"name": "Gemini 2.5 Pro", "provider": "Google"},
    "openai/gpt-4o-mini": {"name": "GPT-4o Mini", "provider": "OpenAI"},
    "openai/gpt-4o": {"name": "GPT-4o", "provider": "OpenAI"},
    "openai/gpt-4-turbo": {"name": "GPT-4 Turbo", "provider": "OpenAI"},
    "openai/o1": {"name": "O1", "provider": "OpenAI"},
    "openai/o1-pro": {"name": "O1 Pro", "provider": "OpenAI"},
    "openai/o3-mini": {"name": "O3 Mini", "provider": "OpenAI"},
    "anthropic/claude-3.5-haiku": {"name": "Claude 3.5 Haiku", "provider": "Anthropic"},
    "anthropic/claude-haiku-4": {"name": "Claude Haiku 4", "provider": "Anthropic"},
    "anthropic/claude-sonnet-4": {"name": "Claude Sonnet 4", "provider": "Anthropic"},
    "anthropic/claude-3.5-sonnet": {"name": "Claude 3.5 Sonnet", "provider": "Anthropic"},
    "anthropic/claude-3.7-sonnet": {"name": "Claude 3.7 Sonnet", "provider": "Anthropic"},
    "anthropic/claude-opus-4": {"name": "Claude Opus 4", "provider": "Anthropic"},
    "deepseek/deepseek-chat": {"name": "DeepSeek Chat", "provider": "DeepSeek"},
    "deepseek/deepseek-r1": {"name": "DeepSeek R1", "provider": "DeepSeek"},
    "qwen/qwen-plus": {"name": "Qwen Plus", "provider": "Alibaba"},
    "mistralai/mistral-small": {"name": "Mistral Small", "provider": "Mistral"},
    "mistralai/mistral-large-2411": {"name": "Mistral Large", "provider": "Mistral"},
    "x-ai/grok-3": {"name": "Grok 3", "provider": "xAI"},
    "x-ai/grok-3-beta": {"name": "Grok 3 Beta", "provider": "xAI"},
}


async def get_model_prices():
    """Получить актуальные цены моделей для фронтенда"""
    usd_rate = await currency_service.get_usd_rate()
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    prices_usd = await get_model_prices_usd()

    models = []
    for model_id, (input_usd, output_usd) in prices_usd.items():
        avg_usd = (input_usd + output_usd) / 2
        avg_coins = int(avg_usd * multiplier)

        info = MODEL_INFO.get(model_id, {"name": model_id, "provider": "Other"})

        if avg_coins < 50000:
            category = "economy"
        elif avg_coins < 250000:
            category = "standard"
        elif avg_coins < 1000000:
            category = "premium"
        else:
            category = "ultra"

        models.append({
            "model_id": model_id,
            "name": info["name"],
            "provider": info["provider"],
            "category": category,
            "input_usd": input_usd,
            "output_usd": output_usd,
            "coins": avg_coins
        })

    models.sort(key=lambda x: x["coins"])

    return {
        "usd_rate": round(usd_rate, 2),
        "multiplier": round(multiplier, 0),
        "models": models
    }


class AIService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.SITE_URL,
            "X-Title": "LANA AI Helper"
        }

    async def generate_response(
        self,
        messages: list,
        model: str = "google/gemini-2.0-flash-001",
        max_tokens: int = 4096,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """Генерация ответа через OpenRouter API"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": model,
                    "messages": messages,
                    "max_tokens": max_tokens,
                    "temperature": temperature
                }
            )

            if response.status_code != 200:
                error_text = response.text
                raise Exception(f"OpenRouter API error: {response.status_code} - {error_text}")

            return response.json()

    def estimate_tokens(self, text: str) -> int:
        """Примерная оценка количества токенов в тексте"""
        return max(1, len(text) // 3)

    def estimate_coins(self, model: str, input_tokens: int, output_tokens: int) -> int:
        """Примерная оценка стоимости в коинах"""
        usd_rate = currency_service.get_cached_rate()
        return calculate_cost_sync(input_tokens, output_tokens, model, usd_rate)

    async def send_message(self, messages: list, model: str) -> dict:
        """Отправка сообщения в AI модель с полной детализацией стоимости"""
        response = await self.generate_response(messages, model)

        # Извлекаем данные из ответа OpenRouter
        choice = response.get("choices", [{}])[0]
        content = choice.get("message", {}).get("content", "")
        usage = response.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        total_tokens = usage.get("total_tokens", input_tokens + output_tokens)

        # Рассчитываем стоимость с детализацией
        cost_details = await calculate_cost_detailed(input_tokens, output_tokens, model)

        return {
            "content": content,
            "tokens_used": total_tokens,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "coins_spent": cost_details["coins"],
            "cost_usd": cost_details["cost_usd"],
            "usd_rate": cost_details["usd_rate"],
            "model": model
        }


ai_service = AIService()
