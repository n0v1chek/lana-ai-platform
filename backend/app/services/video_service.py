"""
Сервис генерации видео через Replicate API
Модели: Wan, Kling, MiniMax и др.
Ценообразование: динамическое с маржой 900% + курс ЦБ РФ
"""

import math
import httpx
import uuid
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime
import aiofiles

from ..core.config import settings
from .currency_service import currency_service

# Маржа и комиссии (как в ai_service и image_service)
MARGIN_MULTIPLIER = 10.0  # 900% маржа
YOOKASSA_COMMISSION = 1.012  # 1.2% комиссия YooKassa
COINS_PER_RUB = 100


def get_usd_to_coins_multiplier(usd_rate: float) -> float:
    """Рассчитывает множитель USD -> коины с учётом маржи и комиссий"""
    return usd_rate * MARGIN_MULTIPLIER * YOOKASSA_COMMISSION * COINS_PER_RUB


# Модели генерации видео через Replicate
VIDEO_MODELS = {
    "wan-video/wan-2.5-t2v": {
        "name": "Wan 2.5 Text-to-Video",
        "provider": "Alibaba",
        "desc": "Быстрая и дешевая генерация видео",
        "cost_per_second": 0.02,  # ~$0.02/сек
        "default_duration": 5,
        "max_duration": 10,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["16:9", "9:16", "1:1"]
    },
    "wan-video/wan-2.5-t2v-fast": {
        "name": "Wan 2.5 Fast",
        "provider": "Alibaba",
        "desc": "Ускоренная генерация видео",
        "cost_per_second": 0.015,
        "default_duration": 5,
        "max_duration": 10,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["16:9", "9:16", "1:1"]
    },
    "minimax/hailuo-2.3-fast": {
        "name": "Hailuo 2.3 Fast",
        "provider": "MiniMax",
        "desc": "Качественное видео от MiniMax",
        "cost_per_second": 0.08,
        "default_duration": 5,
        "max_duration": 10,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["16:9", "9:16", "1:1"]
    },
    "kwaivgi/kling-v2.5-turbo-pro": {
        "name": "Kling 2.5 Turbo Pro",
        "provider": "Kuaishou",
        "desc": "Премиум качество видео",
        "cost_per_second": 0.28,
        "default_duration": 5,
        "max_duration": 10,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["16:9", "9:16", "1:1"]
    },
    "google/veo-3.1-fast": {
        "name": "Google Veo 3.1 Fast",
        "provider": "Google",
        "desc": "Видео от Google",
        "cost_per_second": 0.10,
        "default_duration": 5,
        "max_duration": 8,
        "supports_aspect_ratio": True,
        "aspect_ratios": ["16:9", "9:16", "1:1"]
    },
}

# Минимальная стоимость генерации (в коинах)
MIN_VIDEO_COST_COINS = 500  # ~5 рублей минимум

# Директория для сохранения видео
VIDEOS_DIR = Path("/home/deploy/lana-ai-platform/backend/generated_videos")
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)


class VideoGenerationService:
    def __init__(self):
        self.api_token = settings.REPLICATE_API_TOKEN
        self.base_url = "https://api.replicate.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    async def generate_video(
        self,
        prompt: str,
        model: str = "wan-video/wan-2.5-t2v-fast",
        aspect_ratio: str = "16:9",
        duration: int = 5
    ) -> Dict[str, Any]:
        """
        Генерация видео через Replicate API

        Returns:
            {
                "video_url": "...",
                "filename": "...",
                "coins_spent": int,
                "cost_usd": float,
                "model": str,
                "duration": int
            }
        """
        model_info = VIDEO_MODELS.get(model)
        if not model_info:
            model = "wan-video/wan-2.5-t2v-fast"
            model_info = VIDEO_MODELS[model]

        # Ограничиваем длительность
        duration = min(duration, model_info.get("max_duration", 10))
        duration = max(1, duration)

        # Формируем запрос для Replicate
        input_data = {
            "prompt": prompt,
        }

        # Добавляем aspect_ratio если поддерживается
        if model_info.get("supports_aspect_ratio") and aspect_ratio:
            if aspect_ratio in model_info.get("aspect_ratios", []):
                input_data["aspect_ratio"] = aspect_ratio

        # Добавляем длительность если модель поддерживает
        if "duration" not in input_data:
            input_data["duration"] = duration

        async with httpx.AsyncClient(timeout=300.0) as client:
            # Создаем prediction
            response = await client.post(
                f"{self.base_url}/predictions",
                headers=self.headers,
                json={
                    "version": await self._get_model_version(client, model),
                    "input": input_data
                }
            )

            if response.status_code != 201:
                error_text = response.text
                raise Exception(f"Replicate API error: {response.status_code} - {error_text}")

            prediction = response.json()
            prediction_id = prediction.get("id")

            # Ждем завершения (polling)
            video_url = await self._wait_for_prediction(client, prediction_id)

        # Скачиваем и сохраняем видео
        filename = await self._save_video(video_url)

        # Расчет стоимости
        cost_per_second = model_info.get("cost_per_second", 0.05)
        cost_usd = cost_per_second * duration

        usd_rate = await currency_service.get_usd_rate()
        multiplier = get_usd_to_coins_multiplier(usd_rate)
        coins_spent = max(MIN_VIDEO_COST_COINS, math.ceil(cost_usd * multiplier))

        return {
            "video_url": f"/api/videos/{filename}",
            "filename": filename,
            "coins_spent": coins_spent,
            "cost_usd": cost_usd,
            "usd_rate": usd_rate,
            "model": model,
            "prompt": prompt,
            "duration": duration
        }

    async def _get_model_version(self, client: httpx.AsyncClient, model: str) -> str:
        """Получает последнюю версию модели"""
        response = await client.get(
            f"{self.base_url}/models/{model}/versions",
            headers=self.headers
        )

        if response.status_code != 200:
            raise Exception(f"Failed to get model version: {response.text}")

        versions = response.json().get("results", [])
        if not versions:
            raise Exception(f"No versions found for model {model}")

        return versions[0]["id"]

    async def _wait_for_prediction(
        self,
        client: httpx.AsyncClient,
        prediction_id: str,
        max_wait: int = 300
    ) -> str:
        """Ожидает завершения prediction и возвращает URL видео"""
        import asyncio

        start_time = datetime.now()

        while True:
            response = await client.get(
                f"{self.base_url}/predictions/{prediction_id}",
                headers=self.headers
            )

            if response.status_code != 200:
                raise Exception(f"Failed to get prediction status: {response.text}")

            prediction = response.json()
            status = prediction.get("status")

            if status == "succeeded":
                output = prediction.get("output")
                if isinstance(output, str):
                    return output
                elif isinstance(output, list) and len(output) > 0:
                    return output[0]
                else:
                    raise Exception("No video URL in output")

            elif status == "failed":
                error = prediction.get("error", "Unknown error")
                raise Exception(f"Video generation failed: {error}")

            elif status == "canceled":
                raise Exception("Video generation was canceled")

            # Проверяем таймаут
            elapsed = (datetime.now() - start_time).total_seconds()
            if elapsed > max_wait:
                raise Exception("Video generation timeout")

            # Ждем 2 секунды перед следующей проверкой
            await asyncio.sleep(2)

    async def _save_video(self, video_url: str) -> str:
        """Скачивает и сохраняет видео"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.get(video_url)

            if response.status_code != 200:
                raise Exception(f"Failed to download video: {response.status_code}")

            video_bytes = response.content

            # Определяем формат
            ext = "mp4"
            if video_url.endswith(".webm"):
                ext = "webm"

            filename = f"{uuid.uuid4().hex}.{ext}"
            filepath = VIDEOS_DIR / filename

            async with aiofiles.open(filepath, 'wb') as f:
                await f.write(video_bytes)

            return filename

    async def get_video_models(self) -> List[Dict[str, Any]]:
        """Получить список доступных моделей для генерации видео"""
        usd_rate = await currency_service.get_usd_rate()
        multiplier = get_usd_to_coins_multiplier(usd_rate)

        models = []
        for model_id, info in VIDEO_MODELS.items():
            # Примерная стоимость за 5-секундное видео
            default_duration = info.get("default_duration", 5)
            cost_per_video_usd = info.get("cost_per_second", 0.05) * default_duration
            coins_per_video = max(MIN_VIDEO_COST_COINS, math.ceil(cost_per_video_usd * multiplier))

            models.append({
                "model_id": model_id,
                "name": info["name"],
                "provider": info["provider"],
                "desc": info["desc"],
                "coins_per_5sec": coins_per_video,
                "cost_usd_per_5sec": round(cost_per_video_usd, 4),
                "cost_per_second_usd": info.get("cost_per_second", 0.05),
                "max_duration": info.get("max_duration", 10),
                "aspect_ratios": info.get("aspect_ratios", ["16:9"]),
                "supports_aspect_ratio": info.get("supports_aspect_ratio", False)
            })

        return models

    async def check_api_available(self) -> bool:
        """Проверяет доступность Replicate API"""
        if not self.api_token:
            return False

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/models",
                    headers=self.headers
                )
                return response.status_code == 200
        except:
            return False


# Синглтон сервиса
video_service = VideoGenerationService()
