from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import base64

from ..core.database import get_db
from ..models.user import User
from ..api.auth import get_current_user
from ..services.file_service import (
    save_uploaded_file,
    get_file_as_base64,
    resize_image_if_needed,
    get_image_media_type,
    delete_file,
    supports_vision,
    supports_documents,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_DOC_TYPES,
    MAX_IMAGE_SIZE,
    MAX_FILE_SIZE,
    VISION_MODELS,
)

router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Загрузка файла (изображение или документ)"""
    
    # Проверяем тип файла
    content_type = file.content_type or ""
    is_image = content_type in ALLOWED_IMAGE_TYPES
    is_doc = content_type in ALLOWED_DOC_TYPES
    
    if not is_image and not is_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неподдерживаемый тип файла: {content_type}. Разрешены: изображения (JPEG, PNG, GIF, WebP) и документы (PDF, TXT, CSV, JSON)"
        )
    
    # Читаем содержимое
    content = await file.read()
    
    # Проверяем размер
    max_size = MAX_IMAGE_SIZE if is_image else MAX_FILE_SIZE
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Файл слишком большой. Максимум: {max_size // (1024*1024)} МБ"
        )
    
    # Сохраняем файл
    file_id, file_path = await save_uploaded_file(
        content, 
        file.filename or "file",
        content_type
    )
    
    # Если изображение - оптимизируем размер
    if is_image:
        await resize_image_if_needed(file_path)
    
    return {
        "file_id": file_id,
        "filename": file.filename,
        "content_type": content_type,
        "size": len(content),
        "type": "image" if is_image else "document"
    }


@router.get("/info/{file_id}")
async def get_file_info(
    file_id: str,
    current_user: User = Depends(get_current_user)
):
    """Получить информацию о файле"""
    from pathlib import Path
    from ..services.file_service import UPLOAD_DIR
    
    # Ищем файл по ID
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.stem == file_id:
            return {
                "file_id": file_id,
                "filename": file_path.name,
                "size": file_path.stat().st_size,
                "exists": True
            }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Файл не найден"
    )


@router.delete("/{file_id}")
async def delete_uploaded_file(
    file_id: str,
    current_user: User = Depends(get_current_user)
):
    """Удалить загруженный файл"""
    from pathlib import Path
    from ..services.file_service import UPLOAD_DIR
    
    # Ищем файл по ID
    for file_path in UPLOAD_DIR.iterdir():
        if file_path.stem == file_id:
            delete_file(str(file_path))
            return {"success": True, "message": "Файл удалён"}
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Файл не найден"
    )


@router.get("/models/capabilities")
async def get_model_capabilities(
    current_user: User = Depends(get_current_user)
):
    """Получить информацию о возможностях моделей"""
    return {
        "vision_models": list(VISION_MODELS),
        "document_models": list(VISION_MODELS),  # Те же модели
        "allowed_image_types": list(ALLOWED_IMAGE_TYPES),
        "allowed_doc_types": list(ALLOWED_DOC_TYPES),
        "max_image_size_mb": MAX_IMAGE_SIZE // (1024*1024),
        "max_doc_size_mb": MAX_FILE_SIZE // (1024*1024),
    }
