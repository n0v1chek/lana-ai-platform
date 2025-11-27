from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

from ..core.database import get_db
from ..models.user import User
from ..api.auth import get_current_user

router = APIRouter(prefix="/budget", tags=["Budget"])


class BudgetSettings(BaseModel):
    period: str  # none, week, two_weeks, three_weeks, month
    coins: int   # Бюджет коинов на период


class BudgetResponse(BaseModel):
    budget_period: str
    budget_coins: int
    daily_limit: int
    daily_spent: int
    daily_remaining: int
    period_days: int
    balance: int
    can_send: bool
    message: str


@router.get("", response_model=BudgetResponse)
async def get_budget(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить текущие настройки бюджета"""
    
    # Получаем актуальные данные
    result = await db.execute(
        text("""
            SELECT balance, budget_period, budget_coins, budget_start_date, 
                   daily_spent, daily_spent_date 
            FROM users WHERE id = :user_id
        """),
        {"user_id": current_user.id}
    )
    row = result.fetchone()
    
    balance = row[0] or 0
    budget_period = row[1] or "none"
    budget_coins = row[2] or 0
    daily_spent = row[4] or 0
    daily_spent_date = row[5]
    
    # Сбрасываем daily_spent если новый день
    today = date.today()
    if daily_spent_date and daily_spent_date != today:
        await db.execute(
            text("UPDATE users SET daily_spent = 0, daily_spent_date = :today WHERE id = :user_id"),
            {"today": today, "user_id": current_user.id}
        )
        await db.commit()
        daily_spent = 0
    
    # Рассчитываем лимиты
    period_days_map = {"none": 0, "week": 7, "two_weeks": 14, "three_weeks": 21, "month": 30}
    period_days = period_days_map.get(budget_period, 0)
    
    daily_limit = budget_coins // period_days if period_days > 0 else 0
    daily_remaining = max(0, daily_limit - daily_spent) if daily_limit > 0 else balance
    
    # Проверяем можно ли отправлять
    can_send = True
    message = "OK"
    
    if balance <= 0:
        can_send = False
        message = "Недостаточно коинов. Пожалуйста, пополните баланс."
    elif budget_period != "none" and daily_limit > 0 and daily_spent >= daily_limit:
        can_send = False
        message = f"Достигнут дневной лимит ({daily_limit} коинов). Попробуйте завтра."
    
    return {
        "budget_period": budget_period,
        "budget_coins": budget_coins,
        "daily_limit": daily_limit,
        "daily_spent": daily_spent,
        "daily_remaining": daily_remaining,
        "period_days": period_days,
        "balance": balance,
        "can_send": can_send,
        "message": message
    }


@router.post("", response_model=BudgetResponse)
async def set_budget(
    settings: BudgetSettings,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Установить настройки бюджета"""
    
    valid_periods = ["none", "week", "two_weeks", "three_weeks", "month"]
    if settings.period not in valid_periods:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неверный период. Допустимые: {', '.join(valid_periods)}"
        )
    
    if settings.period != "none" and settings.coins <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Бюджет должен быть больше 0"
        )
    
    # Получаем текущий баланс
    result = await db.execute(
        text("SELECT balance FROM users WHERE id = :user_id"),
        {"user_id": current_user.id}
    )
    balance = result.scalar() or 0
    
    # Проверяем что бюджет не больше баланса
    if settings.period != "none" and settings.coins > balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Бюджет ({settings.coins}) не может превышать баланс ({balance})"
        )
    
    # Обновляем настройки
    await db.execute(
        text("""
            UPDATE users SET 
                budget_period = :period,
                budget_coins = :coins,
                budget_start_date = :start_date,
                daily_spent = 0,
                daily_spent_date = :today
            WHERE id = :user_id
        """),
        {
            "period": settings.period,
            "coins": settings.coins if settings.period != "none" else 0,
            "start_date": datetime.utcnow() if settings.period != "none" else None,
            "today": date.today(),
            "user_id": current_user.id
        }
    )
    await db.commit()
    
    # Возвращаем обновлённые данные
    return await get_budget(current_user, db)


@router.delete("")
async def disable_budget(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Отключить бюджетирование"""
    
    await db.execute(
        text("""
            UPDATE users SET 
                budget_period = 'none',
                budget_coins = 0,
                budget_start_date = NULL,
                daily_spent = 0
            WHERE id = :user_id
        """),
        {"user_id": current_user.id}
    )
    await db.commit()
    
    return {"status": "ok", "message": "Бюджетирование отключено"}


@router.get("/estimate")
async def estimate_budget(
    period: str,
    model: str = "google/gemini-2.0-flash-001",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Оценить сколько сообщений в день при данном бюджете"""
    
    from ..services.ai_service import MODEL_PRICES_USD, USD_TO_COINS
    
    result = await db.execute(
        text("SELECT balance FROM users WHERE id = :user_id"),
        {"user_id": current_user.id}
    )
    balance = result.scalar() or 0
    
    period_days_map = {"none": 0, "week": 7, "two_weeks": 14, "three_weeks": 21, "month": 30}
    period_days = period_days_map.get(period, 0)
    
    if period_days == 0:
        return {
            "period": period,
            "model": model,
            "message": "Без лимита - используйте весь баланс как хотите"
        }
    
    # Цена за ~500 токенов (среднее сообщение)
    input_usd, output_usd = MODEL_PRICES_USD.get(model, (0.10, 0.40))
    model_price = int(((input_usd + output_usd) / 2) * USD_TO_COINS)
    avg_tokens = 500
    cost_per_message = max(1, int((avg_tokens / 1_000_000) * model_price))
    
    daily_coins = balance // period_days
    messages_per_day = daily_coins // cost_per_message if cost_per_message > 0 else 0
    
    return {
        "period": period,
        "period_days": period_days,
        "model": model,
        "balance": balance,
        "daily_coins": daily_coins,
        "cost_per_message": cost_per_message,
        "messages_per_day": messages_per_day,
        "total_messages": messages_per_day * period_days
    }
