from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List

from app.core.database import get_db
from ..api.auth import get_current_user
from app.models.user import User
from app.schemas.subscription import (
    SubscriptionPlanResponse,
    UserSubscriptionInfo,
    UpgradeRequest,
    UpgradeResponse,
    UsageStatsResponse
)
from app.core.config import SubscriptionConfig

router = APIRouter()


@router.get("/plans", response_model=List[SubscriptionPlanResponse])
async def get_subscription_plans():
    """Получить все доступные тарифные планы v2.4"""
    plans = SubscriptionConfig.get_all_plans()
    result = []
    
    for plan in plans:
        plan_data = {
            "name": plan["name"],
            "display_name": plan["display_name"],
            "price": plan["price"],
            "tokens_limit": plan["tokens_limit"],
            "tokens_monthly": plan.get("tokens_monthly", plan["tokens_limit"]),
            "allowed_models": plan["allowed_models"],
            "features": plan["features"],
            "description": plan["description"],
            "popular": plan.get("popular", False),
            "premium_tokens_percent": plan.get("premium_tokens_percent", 0)
        }
        result.append(plan_data)
    
    return result


@router.get("/my-subscription", response_model=UserSubscriptionInfo)
async def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить информацию о текущей подписке v2.4"""
    
    plan_name = current_user.subscription_plan or "FREE"
    plan = SubscriptionConfig.get_plan(plan_name)
    
    # Расчет лимита премиум токенов
    premium_percent = plan.get("premium_tokens_percent", 0)
    premium_limit = int(current_user.tokens_limit * premium_percent / 100)
    
    return UserSubscriptionInfo(
        subscription_plan=plan_name.upper(),
        tokens_used=current_user.tokens_used or 0,
        tokens_limit=current_user.tokens_limit or 10000,
        tokens_remaining=max(0, (current_user.tokens_limit or 10000) - (current_user.tokens_used or 0)),
        premium_tokens_used=current_user.premium_tokens_used or 0,
        premium_tokens_limit=premium_limit,
        subscription_expires=current_user.subscription_expires,
        preferred_model=current_user.preferred_model,
        can_upgrade=plan_name.upper() != "BUSINESS"
    )


@router.post("/upgrade", response_model=UpgradeResponse)
async def upgrade_subscription(
    request: UpgradeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Обновить подписку v2.4"""
    
    new_plan = SubscriptionConfig.get_plan(request.new_plan)
    if not new_plan:
        raise HTTPException(status_code=400, detail="Некорректный тарифный план")
    
    # Иерархия тарифов v2.4
    plan_hierarchy = {
        "free": 0, 
        "mini": 1, 
        "starter": 2, 
        "basic": 2,  # legacy
        "pro": 3, 
        "business": 4,
        "unlimited": 4  # legacy
    }
    
    current_plan_name = (current_user.subscription_plan or "free").lower()
    current_level = plan_hierarchy.get(current_plan_name, 0)
    new_level = plan_hierarchy.get(request.new_plan.lower(), 0)
    
    if new_level <= current_level:
        raise HTTPException(
            status_code=400,
            detail="Можно только повысить тарифный план"
        )
    
    # TODO: Интеграция с YooKassa для создания платежа
    return UpgradeResponse(
        success=True,
        message=f"Для активации тарифа {new_plan['display_name']} необходимо оплатить {new_plan['price']}₽",
        payment_url=None,  # Будет добавлен после интеграции YooKassa
        new_plan=request.new_plan.upper(),
        new_tokens_limit=new_plan["tokens_limit"]
    )


@router.get("/usage-stats", response_model=UsageStatsResponse)
async def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить статистику использования v2.4"""
    
    plan_name = current_user.subscription_plan or "FREE"
    plan = SubscriptionConfig.get_plan(plan_name)
    
    tokens_used = current_user.tokens_used or 0
    tokens_limit = current_user.tokens_limit or 10000
    
    # Расчет лимита премиум токенов
    premium_percent = plan.get("premium_tokens_percent", 0)
    premium_limit = int(tokens_limit * premium_percent / 100)
    
    return UsageStatsResponse(
        plan=plan_name.upper(),
        tokens_used=tokens_used,
        tokens_limit=tokens_limit,
        tokens_remaining=max(0, tokens_limit - tokens_used),
        usage_percent=round((tokens_used / max(tokens_limit, 1)) * 100, 1),
        premium_tokens_used=current_user.premium_tokens_used or 0,
        premium_tokens_limit=premium_limit,
        preferred_model=current_user.preferred_model,
        tokens_reset_at=current_user.tokens_reset_at
    )


@router.put("/preferred-model")
async def set_preferred_model(
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Установить предпочитаемую модель v2.4"""
    
    # Проверяем доступ к модели
    can_use, reason = current_user.can_use_model(model_id)
    if not can_use:
        raise HTTPException(
            status_code=403,
            detail=reason
        )
    
    # Обновляем preferred_model
    await db.execute(
        text("UPDATE users SET preferred_model = :model WHERE id = :user_id"),
        {"model": model_id, "user_id": current_user.id}
    )
    await db.commit()
    
    return {
        "success": True,
        "preferred_model": model_id,
        "message": f"Модель успешно изменена на {model_id}"
    }
