from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from typing import Optional

from ..core.database import get_db
from ..models.api_usage import APIUsage
from ..models.user import User
from ..api.auth import get_current_user


def require_admin(user: User):
    """Проверка прав администратора"""
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ запрещён. Требуются права администратора.")

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/my-usage")
async def get_my_usage(
    days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Статистика использования API за последние N дней"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    result = await db.execute(
        select(APIUsage).where(
            APIUsage.user_id == current_user.id,
            APIUsage.created_at >= start_date
        ).order_by(APIUsage.created_at.desc())
    )
    usage_records = result.scalars().all()
    
    # Агрегированная статистика
    total_requests = len(usage_records)
    total_tokens = sum(r.total_tokens for r in usage_records)
    total_cost = sum(r.cost_rub for r in usage_records)
    
    # По моделям
    by_model = {}
    for record in usage_records:
        if record.ai_model not in by_model:
            by_model[record.ai_model] = {
                "requests": 0,
                "tokens": 0,
                "cost": 0.0
            }
        by_model[record.ai_model]["requests"] += 1
        by_model[record.ai_model]["tokens"] += record.total_tokens
        by_model[record.ai_model]["cost"] += record.cost_rub
    
    return {
        "period_days": days,
        "total_requests": total_requests,
        "total_tokens": total_tokens,
        "total_cost_rub": round(total_cost, 2),
        "by_model": by_model,
        "recent_requests": [
            {
                "date": r.created_at.isoformat(),
                "model": r.ai_model,
                "tokens": r.total_tokens,
                "cost": round(r.cost_rub, 2)
            }
            for r in usage_records[:20]  # Последние 20
        ]
    }

@router.get("/admin/total-usage")
async def get_total_usage(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """ADMIN: Общая статистика по всем пользователям"""

    require_admin(current_user)

    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Общие цифры
    total_result = await db.execute(
        select(
            func.count(APIUsage.id),
            func.sum(APIUsage.total_tokens),
            func.sum(APIUsage.cost_rub)
        ).where(APIUsage.created_at >= start_date)
    )
    
    total_requests, total_tokens, total_cost = total_result.first()
    
    # По моделям
    model_result = await db.execute(
        select(
            APIUsage.ai_model,
            func.count(APIUsage.id).label("requests"),
            func.sum(APIUsage.total_tokens).label("tokens"),
            func.sum(APIUsage.cost_rub).label("cost")
        ).where(
            APIUsage.created_at >= start_date
        ).group_by(APIUsage.ai_model)
    )
    
    by_model = {}
    for row in model_result:
        by_model[row.ai_model] = {
            "requests": row.requests,
            "tokens": row.tokens or 0,
            "cost": round(row.cost or 0, 2)
        }
    
    return {
        "period_days": days,
        "total_requests": total_requests or 0,
        "total_tokens": total_tokens or 0,
        "total_cost_rub": round(total_cost or 0, 2),
        "average_cost_per_request": round((total_cost or 0) / max(total_requests or 1, 1), 2),
        "by_model": by_model
    }
