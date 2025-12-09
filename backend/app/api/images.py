"""
API endpoints для генерации изображений
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from pathlib import Path

from ..core.database import get_db
from ..models.user import User
from ..api.auth import get_current_user
from ..services.image_service import image_service, IMAGES_DIR, IMAGE_MODELS

router = APIRouter(tags=["Images"])


class ImageGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=2000, description="Описание изображения")
    model: Optional[str] = Field(default="google/gemini-2.0-flash-exp-image-generation", description="Модель генерации")
    aspect_ratio: Optional[str] = Field(default="1:1", description="Соотношение сторон")
    source: Optional[str] = Field(default="web", description="Источник запроса")


class ImageGenerateResponse(BaseModel):
    images: List[dict]
    coins_spent: int
    balance_remaining: int
    model: str
    prompt: str


@router.post("/generate", response_model=ImageGenerateResponse)
async def generate_image(
    request: ImageGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Генерация изображения по текстовому описанию"""
    user_id = current_user.id

    # Получаем баланс и бюджет пользователя
    result = await db.execute(
        text("""
            SELECT balance, budget_period, budget_coins, daily_spent, daily_spent_date
            FROM users WHERE id = :user_id
        """),
        {"user_id": user_id}
    )
    row = result.fetchone()
    current_balance = row[0] or 0
    budget_period = row[1] or "none"
    budget_coins = row[2] or 0
    daily_spent = row[3] or 0
    daily_spent_date = row[4]

    today = date.today()
    if daily_spent_date and daily_spent_date != today:
        await db.execute(
            text("UPDATE users SET daily_spent = 0, daily_spent_date = :today WHERE id = :user_id"),
            {"today": today, "user_id": user_id}
        )
        daily_spent = 0

    # Рассчитываем дневной лимит
    period_days_map = {"none": 0, "week": 7, "two_weeks": 14, "three_weeks": 21, "month": 30}
    period_days = period_days_map.get(budget_period, 0)
    daily_limit = budget_coins // period_days if period_days > 0 else 0

    # Примерная стоимость генерации (~500 коинов)
    estimated_cost = 500

    # Проверка баланса
    if current_balance <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "Недостаточно коинов. Пополните баланс.",
                "error_type": "no_balance",
                "balance": current_balance,
                "topup_url": "/pricing"
            }
        )

    if current_balance < estimated_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": f"Недостаточно коинов. Нужно ~{estimated_cost}, у вас {current_balance}.",
                "error_type": "low_balance",
                "balance": current_balance,
                "topup_url": "/pricing"
            }
        )

    # Проверка дневного лимита
    if budget_period != "none" and daily_limit > 0:
        daily_remaining = daily_limit - daily_spent
        if daily_spent >= daily_limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": f"Достигнут дневной лимит ({daily_limit} коинов).",
                    "error_type": "daily_limit",
                    "daily_limit": daily_limit,
                    "daily_spent": daily_spent
                }
            )

    try:
        # Генерация изображения
        result = await image_service.generate_image(
            prompt=request.prompt,
            model=request.model,
            aspect_ratio=request.aspect_ratio
        )

        coins_spent = result["coins_spent"]
        cost_usd = result["cost_usd"]
        usd_rate = result["usd_rate"]

        # Финальная проверка баланса
        if current_balance < coins_spent:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": f"Недостаточно коинов. Нужно {coins_spent}, у вас {current_balance}.",
                    "error_type": "low_balance",
                    "balance": current_balance
                }
            )

        # Списываем коины
        await db.execute(
            text("""
                UPDATE users SET
                    balance = balance - :coins,
                    daily_spent = daily_spent + :coins,
                    daily_spent_date = :today
                WHERE id = :user_id
            """),
            {"coins": coins_spent, "today": today, "user_id": user_id}
        )

        # Записываем в usage_logs
        await db.execute(
            text("""
                INSERT INTO usage_logs (user_id, model_id, tokens_used, cost_rub, coins_spent)
                VALUES (:user_id, :model_id, :tokens_used, :cost_rub, :coins_spent)
            """),
            {
                "user_id": user_id,
                "model_id": result["model"],
                "tokens_used": result.get("input_tokens", 0) + result.get("output_tokens", 0),
                "cost_rub": coins_spent / 100,
                "coins_spent": coins_spent
            }
        )

        # Записываем транзакцию
        await db.execute(
            text("""
                INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, model, tokens_used, cost_usd, usd_rate, source)
                VALUES (:user_id, 'spend', :amount, :before, :after, :desc, :model, :tokens, :cost_usd, :usd_rate, :source)
            """),
            {
                "user_id": user_id,
                "amount": -coins_spent,
                "before": current_balance,
                "after": current_balance - coins_spent,
                "desc": "Генерация изображения",
                "model": result["model"],
                "tokens": result.get("input_tokens", 0) + result.get("output_tokens", 0),
                "cost_usd": cost_usd,
                "usd_rate": usd_rate,
                "source": request.source or "web"
            }
        )

        await db.commit()

        # Получаем обновленный баланс
        new_result = await db.execute(
            text("SELECT balance FROM users WHERE id = :user_id"),
            {"user_id": user_id}
        )
        new_balance = new_result.scalar() or 0

        return {
            "images": result["images"],
            "coins_spent": coins_spent,
            "balance_remaining": new_balance,
            "model": result["model"],
            "prompt": request.prompt
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка генерации: {str(e)}"
        )


@router.get("/models")
async def get_image_models():
    """Получить список доступных моделей для генерации изображений"""
    models = await image_service.get_image_models()
    return {"models": models}


@router.get("/{filename}")
async def get_generated_image(filename: str):
    """Получить сгенерированное изображение"""
    # Безопасность: только имя файла без путей
    safe_filename = Path(filename).name
    filepath = IMAGES_DIR / safe_filename

    if not filepath.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )

    # Определяем content-type
    ext = filepath.suffix.lower()
    content_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif"
    }
    content_type = content_types.get(ext, "image/png")

    return FileResponse(filepath, media_type=content_type)
