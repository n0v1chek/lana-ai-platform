import os
import uuid
import base64
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Tuple
import aiofiles
from PIL import Image
import io

# Директория для загрузок
UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Настройки
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB
FILE_EXPIRY_HOURS = 12
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_DOC_TYPES = {"application/pdf", "text/plain", "text/csv", "application/json"}

# Модели с поддержкой Vision
VISION_MODELS = {
    "openai/gpt-4o",
    "openai/gpt-4o-mini",
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-sonnet-4",
    "anthropic/claude-opus-4",
    "anthropic/claude-3.5-haiku",
    "anthropic/claude-haiku-4",
    "google/gemini-2.0-flash-001",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-flash-lite",
    "google/gemini-2.5-pro",
    "x-ai/grok-3",
    "x-ai/grok-3-beta",
}

# Модели с поддержкой документов (через текст)
DOC_MODELS = VISION_MODELS  # Те же модели могут анализировать текст из документов


def supports_vision(model_id: str) -> bool:
    """Проверяет поддерживает ли модель изображения"""
    return model_id in VISION_MODELS


def supports_documents(model_id: str) -> bool:
    """Проверяет поддерживает ли модель документы"""
    return model_id in DOC_MODELS


async def save_uploaded_file(
    file_content: bytes,
    filename: str,
    content_type: str
) -> Tuple[str, str]:
    """
    Сохраняет загруженный файл
    Возвращает (file_id, file_path)
    """
    # Генерируем уникальный ID
    file_id = str(uuid.uuid4())
    
    # Определяем расширение
    ext = Path(filename).suffix.lower() or _get_extension(content_type)
    
    # Полный путь
    file_path = UPLOAD_DIR / f"{file_id}{ext}"
    
    # Сохраняем файл
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_content)
    
    return file_id, str(file_path)


def _get_extension(content_type: str) -> str:
    """Получает расширение по MIME типу"""
    extensions = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "application/pdf": ".pdf",
        "text/plain": ".txt",
        "text/csv": ".csv",
        "application/json": ".json",
    }
    return extensions.get(content_type, ".bin")


async def get_file_as_base64(file_path: str) -> Optional[str]:
    """Читает файл и возвращает base64"""
    try:
        async with aiofiles.open(file_path, 'rb') as f:
            content = await f.read()
        return base64.b64encode(content).decode('utf-8')
    except Exception:
        return None


async def resize_image_if_needed(file_path: str, max_size: int = 2048) -> str:
    """Уменьшает изображение если оно слишком большое"""
    try:
        with Image.open(file_path) as img:
            # Если изображение больше max_size, уменьшаем
            if max(img.size) > max_size:
                ratio = max_size / max(img.size)
                new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                
                # Сохраняем обратно
                img.save(file_path, quality=85, optimize=True)
        
        return file_path
    except Exception as e:
        print(f"Error resizing image: {e}")
        return file_path


def get_image_media_type(file_path: str) -> str:
    """Определяет MIME тип изображения"""
    ext = Path(file_path).suffix.lower()
    types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    return types.get(ext, "image/jpeg")


async def cleanup_old_files():
    """Удаляет файлы старше FILE_EXPIRY_HOURS"""
    expiry_time = datetime.now() - timedelta(hours=FILE_EXPIRY_HOURS)
    deleted_count = 0
    
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.is_file():
            file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            if file_time < expiry_time:
                try:
                    file_path.unlink()
                    deleted_count += 1
                except Exception as e:
                    print(f"Error deleting {file_path}: {e}")
    
    return deleted_count


async def start_cleanup_scheduler():
    """Запускает фоновую задачу очистки каждый час"""
    while True:
        await asyncio.sleep(3600)  # Каждый час
        deleted = await cleanup_old_files()
        if deleted > 0:
            print(f"🧹 Cleaned up {deleted} old files")


def delete_file(file_path: str) -> bool:
    """Удаляет файл"""
    try:
        Path(file_path).unlink()
        return True
    except Exception:
        return False
