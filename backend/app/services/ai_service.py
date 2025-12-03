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
# Актуальные цены загружаются автоматически с OpenRouter API
MODEL_PRICES_USD = {
    # Экономичные
    "google/gemini-2.0-flash-001": (0.10, 0.40),
    "google/gemini-2.5-flash": (0.30, 2.50),
    "openai/gpt-4o-mini": (0.15, 0.60),
    "deepseek/deepseek-chat": (0.30, 1.20),
    "deepseek/deepseek-r1": (0.30, 1.20),
    
    # Стандартные
    "anthropic/claude-3.5-haiku": (0.80, 4.00),
    "openai/o3-mini": (1.10, 4.40),
    "mistralai/mistral-large-2411": (2.00, 6.00),
    
    # Премиум
    "openai/gpt-4o": (2.50, 10.00),
    "google/gemini-2.5-pro": (1.25, 10.00),
    "anthropic/claude-sonnet-4": (3.00, 15.00),
    "anthropic/claude-3.5-sonnet": (3.00, 15.00),
    "anthropic/claude-3.7-sonnet": (3.00, 15.00),
    "x-ai/grok-3": (3.00, 15.00),
    "openai/gpt-4-turbo": (10.00, 30.00),
    
    # Ультра
    "anthropic/claude-opus-4": (15.00, 75.00),
    "openai/o1": (15.00, 60.00),
    "openai/o1-pro": (150.00, 600.00),
}

DEFAULT_PRICE_USD = (5.00, 20.00)

MODEL_MAP = {
    "gpt-4o": "openai/gpt-4o",
    "gpt-4o-mini": "openai/gpt-4o-mini",
    "gpt-4-turbo": "openai/gpt-4-turbo",
    "claude-sonnet": "anthropic/claude-sonnet-4",
    "claude-haiku": "anthropic/claude-3.5-haiku",
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


# Информация о моделях для отображения
MODEL_INFO = {
    # Экономичные
    "google/gemini-2.0-flash-001": {"name": "Gemini 2.0 Flash", "provider": "Google", "desc": "Быстрая и дешёвая", "best": "Простые вопросы, чат"},
    "google/gemini-2.5-flash": {"name": "Gemini 2.5 Flash", "provider": "Google", "desc": "Улучшенная Flash", "best": "Повседневные задачи"},
    "openai/gpt-4o-mini": {"name": "GPT-4o Mini", "provider": "OpenAI", "desc": "Мини-версия GPT-4o", "best": "Быстрые ответы, код"},
    "deepseek/deepseek-chat": {"name": "DeepSeek Chat", "provider": "DeepSeek", "desc": "Китайская модель", "best": "Общение, анализ"},
    "deepseek/deepseek-r1": {"name": "DeepSeek R1", "provider": "DeepSeek", "desc": "С рассуждениями", "best": "Логические задачи"},
    
    # Стандартные
    "anthropic/claude-3.5-haiku": {"name": "Claude 3.5 Haiku", "provider": "Anthropic", "desc": "Быстрый Claude", "best": "Код, анализ, Vision"},
    "openai/o3-mini": {"name": "O3 Mini", "provider": "OpenAI", "desc": "Мини-рассуждения", "best": "Логика, математика"},
    "mistralai/mistral-large-2411": {"name": "Mistral Large", "provider": "Mistral", "desc": "Большой Mistral", "best": "Сложные тексты"},
    
    # Премиум
    "openai/gpt-4o": {"name": "GPT-4o", "provider": "OpenAI", "desc": "Флагман OpenAI", "best": "⭐ Универсальная, код, Vision"},
    "google/gemini-2.5-pro": {"name": "Gemini 2.5 Pro", "provider": "Google", "desc": "Топ от Google", "best": "⭐ Анализ, Vision, код"},
    "anthropic/claude-sonnet-4": {"name": "Claude Sonnet 4", "provider": "Anthropic", "desc": "Новый Claude", "best": "⭐ Код, тексты, анализ"},
    "anthropic/claude-3.5-sonnet": {"name": "Claude 3.5 Sonnet", "provider": "Anthropic", "desc": "Популярный Claude", "best": "⭐ Универсальная"},
    "anthropic/claude-3.7-sonnet": {"name": "Claude 3.7 Sonnet", "provider": "Anthropic", "desc": "Улучшенный Claude", "best": "⭐ Рассуждения, код"},
    "x-ai/grok-3": {"name": "Grok 3", "provider": "xAI", "desc": "От Илона Маска", "best": "Креатив, юмор"},
    "openai/gpt-4-turbo": {"name": "GPT-4 Turbo", "provider": "OpenAI", "desc": "Мощный GPT-4", "best": "Длинные документы"},
    
    # Ультра
    "anthropic/claude-opus-4": {"name": "Claude Opus 4", "provider": "Anthropic", "desc": "Топ Claude", "best": "🏆 Сложнейшие задачи"},
    "openai/o1": {"name": "O1", "provider": "OpenAI", "desc": "Рассуждающий", "best": "🏆 Наука, математика"},
    "openai/o1-pro": {"name": "O1 Pro", "provider": "OpenAI", "desc": "Максимум OpenAI", "best": "🏆 Исследования"},
}


async def get_model_prices():
    """Получить актуальные цены моделей для фронтенда"""
    usd_rate = await currency_service.get_usd_rate()
    multiplier = get_usd_to_coins_multiplier(usd_rate)
    prices_usd = await get_model_prices_usd()

    # Фильтруем только наши модели
    allowed_models = set(MODEL_INFO.keys())

    models = []
    for model_id, (input_usd, output_usd) in prices_usd.items():
        if model_id not in allowed_models:
            continue
            
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
            "desc": info.get("desc", ""),
            "best": info.get("best", ""),
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

        # Используем реальную стоимость от OpenRouter если есть
        openrouter_cost = usage.get("cost")
        usd_rate = await currency_service.get_usd_rate()
        
        if openrouter_cost is not None:
            # OpenRouter вернул реальную стоимость - используем её
            cost_usd = float(openrouter_cost)
            multiplier = get_usd_to_coins_multiplier(usd_rate)
            cost_coins = max(1, math.ceil(cost_usd * multiplier))
        else:
            # Fallback на наш расчёт
            cost_details = await calculate_cost_detailed(input_tokens, output_tokens, model)
            cost_usd = cost_details["cost_usd"]
            cost_coins = cost_details["coins"]
        
        return {
            "content": content,
            "tokens_used": total_tokens,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "coins_spent": cost_coins,
            "cost_usd": cost_usd,
            "usd_rate": usd_rate,
            "model": model
        }


ai_service = AIService()


# === MULTIMODAL SUPPORT ===

async def prepare_multimodal_message(content: str, file_path: str = None, file_type: str = None) -> dict:
    """
    Подготавливает сообщение с изображением для OpenRouter API
    """
    from .file_service import get_file_as_base64, get_image_media_type

    if not file_path:
        return {"role": "user", "content": content}

    # Получаем base64 изображения
    base64_data = await get_file_as_base64(file_path)
    if not base64_data:
        return {"role": "user", "content": content}

    media_type = get_image_media_type(file_path)

    message_content = []

    # Сначала текст (если есть)
    if content:
        message_content.append({
            "type": "text",
            "text": content
        })

    # Затем изображение
    message_content.append({
        "type": "image_url",
        "image_url": {
            "url": f"data:{media_type};base64,{base64_data}"
        }
    })

    return {
        "role": "user",
        "content": message_content
    }


async def extract_text_from_document(file_path: str) -> str:
    """Извлекает текст из документа для анализа"""
    import aiofiles
    from pathlib import Path

    ext = Path(file_path).suffix.lower()

    try:
        if ext in ['.txt', '.csv', '.json']:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                text = await f.read()
            return text[:50000]  # Ограничиваем 50K символов

        elif ext == '.pdf':
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(file_path)
                text = ""
                for page in doc:
                    text += page.get_text()
                doc.close()
                return text[:50000]
            except ImportError:
                return "[PDF файл загружен, но библиотека PyMuPDF не установлена]"

        else:
            return f"[Файл {ext} загружен]"

    except Exception as e:
        return f"[Ошибка чтения файла: {str(e)}]"
