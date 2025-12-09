"""
Сервис генерации изображений через OpenRouter API
Модели: Gemini (Nano Banana), Flux и др.
Ценообразование: динамическое с маржой 900% + курс ЦБ РФ
"""

import math
import httpx
import base64
import re
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime
import aiofiles
import uuid

from ..core.config import settings
from .currency_service import currency_service
from .openrouter_prices import openrouter_prices_service

# Маржа и комиссии (как в ai_service)
MARGIN_MULTIPLIER = 10.0  # 900% маржа
YOOKASSA_COMMISSION = 1.012  # 1.2% комиссия YooKassa
COINS_PER_RUB = 100


def get_usd_to_coins_multiplier(usd_rate: float) -> float:
    """Рассчитывает множитель USD -> коины с учётом маржи и комиссий"""
    return usd_rate * MARGIN_MULTIPLIER * YOOKASSA_COMMISSION * COINS_PER_RUB


# Модели генерации изображений через OpenRouter (fallback цены)
IMAGE_MODELS = {
    "google/gemini-2.5-flash-preview-image-generation": {
        "name": "Gemini Flash Image",
        "provider": "Google",
        "desc": "Быстрая генерация от Google",
        "input_price": 0.15,  # $/1M tokens (fallback)
        "output_price": 0.60,
        "image_price": 0.02,  # ~$0.02 за изображение
        "supports_aspect_ratio": True,
        "aspect_ratios": ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]
    },
    "google/gemini-2.0-flash-exp-image-generation": {
        "name": "Gemini 2.0 Flash Image",
        "provider": "Google",
        "desc": "Экспериментальная Gemini для изображений",
        "input_price": 0.10,
        "output_price": 0.40,
        "image_price": 0.02,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]
    }
}

# Минимальная стоимость генерации (в коинах)
MIN_IMAGE_COST_COINS = 100  # ~1 рубль минимум

# Директория для сохранения изображений
IMAGES_DIR = Path("/home/deploy/lana-ai-platform/backend/generated_images")
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


class ImageGenerationService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.SITE_URL,
            "X-Title": "LANA AI Helper"
        }

    async def generate_image(
        self,
        prompt: str,
        model: str = "google/gemini-2.0-flash-exp-image-generation",
        aspect_ratio: str = "1:1",
        num_images: int = 1
    ) -> Dict[str, Any]:
        """
        Генерация изображения через OpenRouter API

        Returns:
            {
                "images": [{"url": "...", "filename": "..."}, ...],
                "coins_spent": int,
                "cost_usd": float,
                "model": str
            }
        """
        model_info = IMAGE_MODELS.get(model)
        if not model_info:
            # Используем дефолтную модель
            model = "google/gemini-2.0-flash-exp-image-generation"
            model_info = IMAGE_MODELS[model]

        # Формируем запрос
        request_body = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": f"Generate an image: {prompt}"
                }
            ],
            "modalities": ["image", "text"],
            "max_tokens": 4096
        }

        # Добавляем aspect_ratio если модель поддерживает
        if model_info.get("supports_aspect_ratio") and aspect_ratio:
            if aspect_ratio in model_info.get("aspect_ratios", []):
                request_body["image_config"] = {
                    "aspect_ratio": aspect_ratio
                }

        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=request_body
            )

            if response.status_code != 200:
                error_text = response.text
                raise Exception(f"OpenRouter API error: {response.status_code} - {error_text}")

            result = response.json()

        # Извлекаем изображения из ответа
        images = []
        choice = result.get("choices", [{}])[0]
        message = choice.get("message", {})
        content = message.get("content", [])

        # OpenRouter может вернуть content как строку или как массив
        if isinstance(content, str):
            # Пробуем найти base64 в тексте
            base64_match = re.search(r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)', content)
            if base64_match:
                image_data = base64_match.group(1)
                filename = await self._save_image(image_data)
                images.append({
                    "url": f"/api/images/{filename}",
                    "filename": filename
                })
        elif isinstance(content, list):
            for item in content:
                if item.get("type") == "image_url":
                    image_url = item.get("image_url", {}).get("url", "")
                    if image_url.startswith("data:image"):
                        # Base64 encoded
                        base64_data = image_url.split(",", 1)[1] if "," in image_url else ""
                        if base64_data:
                            filename = await self._save_image(base64_data)
                            images.append({
                                "url": f"/api/images/{filename}",
                                "filename": filename
                            })
                    else:
                        # Direct URL
                        images.append({
                            "url": image_url,
                            "filename": None
                        })

        # Расчет стоимости с динамическими ценами
        usage = result.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)

        # Используем реальную стоимость от OpenRouter если есть
        openrouter_cost = usage.get("cost")
        usd_rate = await currency_service.get_usd_rate()

        # Получаем актуальные цены с OpenRouter
        openrouter_prices = openrouter_prices_service.get_image_prices()

        if openrouter_cost is not None:
            cost_usd = float(openrouter_cost)
        else:
            # Fallback: расчет по токенам с динамическими ценами
            if model in openrouter_prices:
                input_price, output_price = openrouter_prices[model]
            else:
                input_price = model_info["input_price"]
                output_price = model_info["output_price"]

            cost_usd = (
                (input_tokens / 1_000_000) * input_price +
                (output_tokens / 1_000_000) * output_price +
                model_info.get("image_price", 0.02) * len(images)
            )

        multiplier = get_usd_to_coins_multiplier(usd_rate)
        coins_spent = max(MIN_IMAGE_COST_COINS, math.ceil(cost_usd * multiplier))

        return {
            "images": images,
            "coins_spent": coins_spent,
            "cost_usd": cost_usd,
            "usd_rate": usd_rate,
            "model": model,
            "prompt": prompt,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens
        }

    async def _save_image(self, base64_data: str) -> str:
        """Сохраняет base64 изображение в файл"""
        try:
            image_bytes = base64.b64decode(base64_data)

            # Определяем формат (обычно PNG)
            ext = "png"
            if image_bytes[:3] == b'\xff\xd8\xff':
                ext = "jpg"
            elif image_bytes[:4] == b'RIFF':
                ext = "webp"

            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = IMAGES_DIR / filename

            async with aiofiles.open(filepath, 'wb') as f:
                await f.write(image_bytes)

            return filename
        except Exception as e:
            raise Exception(f"Failed to save image: {str(e)}")

    async def get_image_models(self) -> List[Dict[str, Any]]:
        """Получить список доступных моделей для генерации изображений с динамическими ценами"""
        usd_rate = await currency_service.get_usd_rate()
        multiplier = get_usd_to_coins_multiplier(usd_rate)

        # Получаем актуальные цены с OpenRouter
        openrouter_prices = openrouter_prices_service.get_image_prices()

        models = []
        for model_id, info in IMAGE_MODELS.items():
            # Используем цены OpenRouter если есть, иначе fallback
            if model_id in openrouter_prices:
                input_price, output_price = openrouter_prices[model_id]
            else:
                input_price = info["input_price"]
                output_price = info["output_price"]

            # Примерная стоимость за 1 изображение:
            # ~500 input tokens (промпт) + ~1000 output tokens (ответ с base64)
            est_input_tokens = 500
            est_output_tokens = 1000
            cost_per_image_usd = (
                (est_input_tokens / 1_000_000) * input_price +
                (est_output_tokens / 1_000_000) * output_price +
                info.get("image_price", 0.02)  # Дополнительная плата за генерацию
            )
            coins_per_image = max(MIN_IMAGE_COST_COINS, math.ceil(cost_per_image_usd * multiplier))

            models.append({
                "model_id": model_id,
                "name": info["name"],
                "provider": info["provider"],
                "desc": info["desc"],
                "coins_per_image": coins_per_image,
                "cost_usd_per_image": round(cost_per_image_usd, 4),
                "aspect_ratios": info.get("aspect_ratios", ["1:1"]),
                "supports_aspect_ratio": info.get("supports_aspect_ratio", False),
                "input_price_1m": input_price,
                "output_price_1m": output_price
            })

        return models


# Синглтон сервиса
image_service = ImageGenerationService()
