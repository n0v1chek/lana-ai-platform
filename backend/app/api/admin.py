from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, func
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import json

from ..core.database import get_db
from .auth import get_current_user
from ..models.user import User
from ..services.ai_service import ai_service, get_current_rate_info

router = APIRouter(prefix="/admin", tags=["Admin"])

# === Schemas ===

class UserUpdate(BaseModel):
    balance: Optional[int] = None
    is_blocked: Optional[bool] = None
    block_reason: Optional[str] = None
    is_active: Optional[bool] = None
    budget_period: Optional[str] = None
    budget_coins: Optional[int] = None

class RefundRequest(BaseModel):
    amount: int
    reason: str

class BannerUpdate(BaseModel):
    enabled: bool
    text: str
    type: str = "info"  # info, warning, error

class AdjustBalanceRequest(BaseModel):
    amount: int  # positive or negative
    reason: str

class SetCurrencyRateRequest(BaseModel):
    rate: float  # курс USD/RUB

# === Helpers ===

async def require_admin(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Проверка что пользователь - админ"""
    result = await db.execute(
        text("SELECT is_admin FROM users WHERE id = :id"),
        {"id": current_user.id}
    )
    is_admin = result.scalar()
    if not is_admin:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    return current_user

async def log_admin_action(db: AsyncSession, admin_id: int, action: str, target_user_id: int = None, details: dict = None, ip: str = None):
    """Логирование действий админа"""
    await db.execute(
        text("""
            INSERT INTO admin_logs (admin_id, action, target_user_id, details, ip_address)
            VALUES (:admin_id, :action, :target_user_id, :details, :ip)
        """),
        {
            "admin_id": admin_id,
            "action": action,
            "target_user_id": target_user_id,
            "details": json.dumps(details) if details else None,
            "ip": ip
        }
    )

# === Dashboard ===

@router.get("/currency")
async def get_currency_info(
    admin: User = Depends(require_admin)
):
    """Получить информацию о курсе валют"""
    return await get_current_rate_info()


@router.post("/currency")
async def set_currency_rate(
    request: SetCurrencyRateRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    req: Request = None
):
    """Установить курс USD/RUB вручную"""
    from ..services.currency_service import currency_service

    old_rate = currency_service.get_cached_rate()

    if request.rate < 50 or request.rate > 500:
        raise HTTPException(status_code=400, detail="Курс должен быть от 50 до 500")

    currency_service.set_rate(request.rate)

    # Логируем действие
    await log_admin_action(
        db, admin.id, "set_currency_rate",
        details={"old_rate": old_rate, "new_rate": request.rate},
        ip=req.client.host if req else None
    )
    await db.commit()

    return {
        "success": True,
        "old_rate": old_rate,
        "new_rate": request.rate,
        "message": f"Курс изменён с {old_rate}₽ на {request.rate}₽"
    }


@router.get("/dashboard")
async def get_dashboard(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Общая статистика для дашборда"""

    # Общее количество пользователей
    users_count = await db.execute(text("SELECT COUNT(*) FROM users"))
    total_users = users_count.scalar()

    # Активные пользователи (за последние 7 дней)
    active_users = await db.execute(
        text("SELECT COUNT(*) FROM users WHERE updated_at > NOW() - INTERVAL '7 days'")
    )
    active_count = active_users.scalar()

    # Общий баланс всех пользователей
    total_balance = await db.execute(text("SELECT COALESCE(SUM(balance), 0) FROM users"))
    all_balance = total_balance.scalar()

    # Общие депозиты
    total_deposits = await db.execute(
        text("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'deposit'")
    )
    deposits = total_deposits.scalar()

    # Общие расходы (spend)
    total_spent = await db.execute(
        text("SELECT COALESCE(SUM(ABS(amount)), 0) FROM transactions WHERE type = 'spend'")
    )
    spent = total_spent.scalar()

    # Токены использовано
    total_tokens = await db.execute(
        text("SELECT COALESCE(SUM(tokens_used), 0) FROM transactions WHERE type = 'spend'")
    )
    tokens = total_tokens.scalar()

    # Статистика за сегодня
    today_deposits = await db.execute(
        text("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'deposit' AND created_at::date = CURRENT_DATE")
    )
    today_spent = await db.execute(
        text("SELECT COALESCE(SUM(ABS(amount)), 0) FROM transactions WHERE type = 'spend' AND created_at::date = CURRENT_DATE")
    )

    # Новые пользователи сегодня
    new_users_today = await db.execute(
        text("SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE")
    )

    # Заблокированные пользователи
    blocked_users = await db.execute(
        text("SELECT COUNT(*) FROM users WHERE is_blocked = TRUE")
    )

    return {
        "total_users": total_users,
        "active_users_7d": active_count,
        "blocked_users": blocked_users.scalar(),
        "new_users_today": new_users_today.scalar(),
        "total_balance_coins": all_balance,
        "total_balance_rub": all_balance / 100,
        "total_deposits_coins": deposits,
        "total_deposits_rub": deposits / 100,
        "total_spent_coins": spent,
        "total_spent_rub": spent / 100,
        "total_tokens_used": tokens,
        "profit_coins": spent,  # Маржа ~80% заложена в ценах
        "profit_rub": spent / 100,
        "today_deposits_coins": today_deposits.scalar(),
        "today_spent_coins": today_spent.scalar(),
    }


# === Margin Monitoring ===

@router.get("/monitoring/margin")
async def get_margin_monitoring(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(7, ge=1, le=90)
):
    """Мониторинг маржи по моделям"""
    
    from ..services.currency_service import currency_service
    
    # Получаем статистику по моделям за последние N дней (только транзакции с cost_usd)
    result = await db.execute(
        text("""
            SELECT
                model,
                COUNT(*) as requests,
                SUM(tokens_used) as total_tokens,
                SUM(ABS(amount)) as total_coins,
                SUM(cost_usd) as total_cost_usd,
                AVG(usd_rate) as avg_usd_rate,
                SUM(cost_usd * COALESCE(usd_rate, :default_rate)) as cost_rub_actual,
                MIN(created_at) as first_request,
                MAX(created_at) as last_request
            FROM transactions
            WHERE type = 'spend'
                AND model IS NOT NULL
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY model
            ORDER BY total_coins DESC
        """),
        {"days": days, "default_rate": currency_service.get_cached_rate()}
    )

    models_data = result.fetchall()

    # Текущий курс
    current_rate = currency_service.get_cached_rate()
    cbr_rate = currency_service.get_cbr_rate()

    models_stats = []
    total_revenue_coins = 0
    total_cost_rub = 0
    total_cost_usd = 0
    alerts = []

    for row in models_data:
        model_id = row.model
        requests = row.requests
        total_tokens = row.total_tokens or 0
        coins_charged = row.total_coins or 0
        cost_usd = float(row.total_cost_usd) if row.total_cost_usd else 0
        avg_rate = float(row.avg_usd_rate) if row.avg_usd_rate else current_rate
        # Используем фактическую себестоимость из транзакций
        cost_rub = float(row.cost_rub_actual) if row.cost_rub_actual else 0

        # Расчёт маржи
        revenue_rub = coins_charged / 100  # коины в рубли

        if cost_rub > 0:
            margin_percent = ((revenue_rub - cost_rub) / cost_rub) * 100
        else:
            margin_percent = 0

        profit_rub = revenue_rub - cost_rub
        
        # Проверка на аномалии
        if margin_percent < 500 and cost_usd > 0:  # Маржа меньше 500% - предупреждение
            alerts.append({
                "type": "low_margin",
                "model": model_id,
                "margin_percent": round(margin_percent, 1),
                "message": f"Низкая маржа {margin_percent:.1f}% для {model_id}"
            })
        
        if margin_percent > 2000 and cost_usd > 0:  # Маржа больше 2000% - возможно ошибка в ценах
            alerts.append({
                "type": "high_margin",
                "model": model_id,
                "margin_percent": round(margin_percent, 1),
                "message": f"Аномально высокая маржа {margin_percent:.1f}% для {model_id}"
            })
        
        models_stats.append({
            "model": model_id,
            "requests": requests,
            "total_tokens": total_tokens,
            "coins_charged": coins_charged,
            "revenue_rub": round(revenue_rub, 2),
            "cost_usd": round(cost_usd, 6),
            "cost_rub": round(cost_rub, 2),
            "profit_rub": round(profit_rub, 2),
            "margin_percent": round(margin_percent, 1),
            "avg_usd_rate": round(avg_rate, 2),
            "avg_tokens_per_request": round(total_tokens / requests, 0) if requests > 0 else 0,
            "avg_coins_per_request": round(coins_charged / requests, 1) if requests > 0 else 0,
        })

        total_revenue_coins += coins_charged
        total_cost_rub += cost_rub
        total_cost_usd += cost_usd

    # Общая статистика (используем накопленную фактическую себестоимость)
    total_revenue_rub = total_revenue_coins / 100
    total_profit_rub = total_revenue_rub - total_cost_rub
    total_margin = ((total_revenue_rub - total_cost_rub) / total_cost_rub * 100) if total_cost_rub > 0 else 0
    
    return {
        "period_days": days,
        "current_usd_rate": round(current_rate, 2),
        "cbr_rate": round(cbr_rate, 2),
        "summary": {
            "total_requests": sum(m["requests"] for m in models_stats),
            "total_tokens": sum(m["total_tokens"] for m in models_stats),
            "total_revenue_coins": total_revenue_coins,
            "total_revenue_rub": round(total_revenue_rub, 2),
            "total_cost_usd": round(total_cost_usd, 4),
            "total_cost_rub": round(total_cost_rub, 2),
            "total_profit_rub": round(total_profit_rub, 2),
            "average_margin_percent": round(total_margin, 1),
        },
        "models": models_stats,
        "alerts": alerts,
        "alerts_count": len(alerts)
    }


@router.get("/monitoring/transactions")
async def get_recent_transactions_monitoring(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=200)
):
    """Последние транзакции с детализацией себестоимости"""
    
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()
    
    result = await db.execute(
        text("""
            SELECT 
                t.id,
                t.created_at,
                t.model,
                t.tokens_used,
                ABS(t.amount) as coins_charged,
                t.cost_usd,
                t.usd_rate,
                u.username
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'spend' AND t.model IS NOT NULL
            ORDER BY t.created_at DESC
            LIMIT :limit
        """),
        {"limit": limit}
    )
    
    transactions = []
    for row in result.fetchall():
        cost_usd = float(row.cost_usd) if row.cost_usd else 0
        coins_charged = row.coins_charged or 0
        revenue_rub = coins_charged / 100
        cost_rub = cost_usd * cbr_rate
        margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0
        
        transactions.append({
            "id": row.id,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "username": row.username,
            "model": row.model,
            "tokens": row.tokens_used,
            "coins_charged": coins_charged,
            "revenue_rub": round(revenue_rub, 2),
            "cost_usd": round(cost_usd, 6) if cost_usd else None,
            "cost_rub": round(cost_rub, 4) if cost_usd else None,
            "margin_percent": round(margin, 1) if cost_usd else None,
            "usd_rate": float(row.usd_rate) if row.usd_rate else None,
        })
    
    return {
        "transactions": transactions,
        "cbr_rate": round(cbr_rate, 2)
    }


# === Users Management ===

@router.get("/users")
async def get_users(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    only_blocked: bool = False
):
    """Список всех пользователей"""
    offset = (page - 1) * limit

    # Базовый запрос
    where_clause = "WHERE 1=1"
    params = {"limit": limit, "offset": offset}

    if search:
        where_clause += " AND (username ILIKE :search OR email ILIKE :search)"
        params["search"] = f"%{search}%"

    if only_blocked:
        where_clause += " AND is_blocked = TRUE"

    # Валидация sort_by
    allowed_sorts = ["created_at", "balance", "username", "total_spent", "updated_at"]
    if sort_by not in allowed_sorts:
        sort_by = "created_at"

    order = "DESC" if sort_order == "desc" else "ASC"

    # Получаем пользователей
    query = f"""
        SELECT
            u.id, u.username, u.email, u.balance, u.is_admin, u.is_blocked,
            u.block_reason, u.is_active, u.created_at, u.updated_at,
            u.budget_period, u.budget_coins, u.daily_spent,
            u.total_deposited, u.total_spent,
            COALESCE((SELECT SUM(tokens_used) FROM transactions WHERE user_id = u.id AND type = 'spend'), 0) as tokens_used,
            COALESCE((SELECT COUNT(*) FROM transactions WHERE user_id = u.id AND type = 'spend'), 0) as messages_count
        FROM users u
        {where_clause}
        ORDER BY {sort_by} {order}
        LIMIT :limit OFFSET :offset
    """

    result = await db.execute(text(query), params)
    users = result.fetchall()

    # Общее количество
    count_query = f"SELECT COUNT(*) FROM users u {where_clause}"
    count_params = {k: v for k, v in params.items() if k not in ["limit", "offset"]}
    total_result = await db.execute(text(count_query), count_params)
    total = total_result.scalar()

    return {
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "balance": u.balance,
                "balance_rub": u.balance / 100,
                "is_admin": u.is_admin,
                "is_blocked": u.is_blocked,
                "block_reason": u.block_reason,
                "is_active": u.is_active,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "updated_at": u.updated_at.isoformat() if u.updated_at else None,
                "budget_period": u.budget_period,
                "budget_coins": u.budget_coins,
                "daily_spent": u.daily_spent,
                "total_deposited": u.total_deposited or 0,
                "total_spent": u.total_spent or 0,
                "tokens_used": u.tokens_used,
                "messages_count": u.messages_count,
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }

@router.get("/users/{user_id}")
async def get_user_detail(
    user_id: int,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Детальная информация о пользователе"""

    # Основная информация
    result = await db.execute(
        text("""
            SELECT id, username, email, balance, is_admin, is_blocked, block_reason,
                   is_active, created_at, updated_at, budget_period, budget_coins,
                   daily_spent, daily_spent_date, total_deposited, total_spent
            FROM users WHERE id = :id
        """),
        {"id": user_id}
    )
    user = result.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Статистика транзакций
    stats = await db.execute(
        text("""
            SELECT
                type,
                COUNT(*) as count,
                COALESCE(SUM(ABS(amount)), 0) as total_amount,
                COALESCE(SUM(tokens_used), 0) as total_tokens
            FROM transactions
            WHERE user_id = :id
            GROUP BY type
        """),
        {"id": user_id}
    )
    stats_data = {row.type: {"count": row.count, "amount": row.total_amount, "tokens": row.total_tokens} for row in stats.fetchall()}

    # Последние транзакции
    transactions = await db.execute(
        text("""
            SELECT id, type, amount, balance_before, balance_after, description,
                   model, tokens_used, cost_usd, usd_rate, created_at
            FROM transactions
            WHERE user_id = :id
            ORDER BY created_at DESC
            LIMIT 50
        """),
        {"id": user_id}
    )

    # Количество диалогов
    convs = await db.execute(
        text("SELECT COUNT(*) FROM conversations WHERE user_id = :id"),
        {"id": user_id}
    )

    # Количество сообщений
    msgs = await db.execute(
        text("""
            SELECT COUNT(*) FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.user_id = :id
        """),
        {"id": user_id}
    )

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "balance": user.balance,
            "balance_rub": user.balance / 100,
            "is_admin": user.is_admin,
            "is_blocked": user.is_blocked,
            "block_reason": user.block_reason,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "updated_at": user.updated_at.isoformat() if user.updated_at else None,
            "budget_period": user.budget_period,
            "budget_coins": user.budget_coins,
            "daily_spent": user.daily_spent,
            "total_deposited": user.total_deposited or 0,
            "total_spent": user.total_spent or 0,
        },
        "stats": stats_data,
        "conversations_count": convs.scalar(),
        "messages_count": msgs.scalar(),
        "transactions": [
            {
                "id": t.id,
                "type": t.type,
                "amount": t.amount,
                "balance_before": t.balance_before,
                "balance_after": t.balance_after,
                "description": t.description,
                "model": t.model,
                "tokens_used": t.tokens_used,
                "cost_usd": float(t.cost_usd) if t.cost_usd else None,
                "usd_rate": float(t.usd_rate) if t.usd_rate else None,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in transactions.fetchall()
        ]
    }

@router.patch("/users/{user_id}")
async def update_user(
    user_id: int,
    data: UserUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Обновление данных пользователя"""

    # Проверяем существование
    result = await db.execute(text("SELECT id, balance FROM users WHERE id = :id"), {"id": user_id})
    user = result.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    updates = []
    params = {"id": user_id}
    details = {}

    if data.balance is not None:
        updates.append("balance = :balance")
        params["balance"] = data.balance
        details["balance_change"] = {"from": user.balance, "to": data.balance}

    if data.is_blocked is not None:
        updates.append("is_blocked = :is_blocked")
        params["is_blocked"] = data.is_blocked
        details["is_blocked"] = data.is_blocked

    if data.block_reason is not None:
        updates.append("block_reason = :block_reason")
        params["block_reason"] = data.block_reason
        details["block_reason"] = data.block_reason

    if data.is_active is not None:
        updates.append("is_active = :is_active")
        params["is_active"] = data.is_active
        details["is_active"] = data.is_active

    if data.budget_period is not None:
        updates.append("budget_period = :budget_period")
        params["budget_period"] = data.budget_period
        details["budget_period"] = data.budget_period

    if data.budget_coins is not None:
        updates.append("budget_coins = :budget_coins")
        params["budget_coins"] = data.budget_coins
        details["budget_coins"] = data.budget_coins

    if updates:
        updates.append("updated_at = NOW()")
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = :id"
        await db.execute(text(query), params)
        await db.commit()

        # Логируем
        await log_admin_action(
            db, admin.id, "update_user", user_id, details,
            request.client.host if request.client else None
        )
        await db.commit()

    return {"success": True, "message": "Пользователь обновлён"}

@router.post("/users/{user_id}/adjust-balance")
async def adjust_balance(
    user_id: int,
    data: AdjustBalanceRequest,
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Изменение баланса пользователя (для тестирования/корректировок)"""

    # Получаем текущий баланс
    result = await db.execute(text("SELECT balance FROM users WHERE id = :id"), {"id": user_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    old_balance = row.balance
    new_balance = old_balance + data.amount

    if new_balance < 0:
        raise HTTPException(status_code=400, detail="Баланс не может быть отрицательным")

    # Обновляем баланс
    await db.execute(
        text("UPDATE users SET balance = :balance, updated_at = NOW() WHERE id = :id"),
        {"balance": new_balance, "id": user_id}
    )

    # Записываем транзакцию
    await db.execute(
        text("""
            INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, admin_id)
            VALUES (:user_id, 'admin_adjust', :amount, :before, :after, :desc, :admin_id)
        """),
        {
            "user_id": user_id,
            "amount": data.amount,
            "before": old_balance,
            "after": new_balance,
            "desc": data.reason,
            "admin_id": admin.id
        }
    )

    # Логируем
    await log_admin_action(
        db, admin.id, "adjust_balance", user_id,
        {"amount": data.amount, "reason": data.reason, "old_balance": old_balance, "new_balance": new_balance},
        request.client.host if request.client else None
    )

    await db.commit()

    return {
        "success": True,
        "old_balance": old_balance,
        "new_balance": new_balance,
        "change": data.amount
    }

@router.post("/users/{user_id}/refund")
async def refund_user(
    user_id: int,
    data: RefundRequest,
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Возврат средств пользователю"""

    result = await db.execute(text("SELECT balance FROM users WHERE id = :id"), {"id": user_id})
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    old_balance = row.balance
    new_balance = old_balance + data.amount

    # Обновляем баланс
    await db.execute(
        text("UPDATE users SET balance = :balance, updated_at = NOW() WHERE id = :id"),
        {"balance": new_balance, "id": user_id}
    )

    # Записываем транзакцию
    await db.execute(
        text("""
            INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, admin_id)
            VALUES (:user_id, 'refund', :amount, :before, :after, :desc, :admin_id)
        """),
        {
            "user_id": user_id,
            "amount": data.amount,
            "before": old_balance,
            "after": new_balance,
            "desc": data.reason,
            "admin_id": admin.id
        }
    )

    # Логируем
    await log_admin_action(
        db, admin.id, "refund", user_id,
        {"amount": data.amount, "reason": data.reason},
        request.client.host if request.client else None
    )

    await db.commit()

    return {"success": True, "refunded": data.amount, "new_balance": new_balance}

@router.post("/users/{user_id}/block")
async def block_user(
    user_id: int,
    request: Request,
    reason: str = "",
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Блокировка пользователя"""

    await db.execute(
        text("UPDATE users SET is_blocked = TRUE, block_reason = :reason, updated_at = NOW() WHERE id = :id"),
        {"id": user_id, "reason": reason}
    )

    await log_admin_action(db, admin.id, "block_user", user_id, {"reason": reason}, request.client.host if request.client else None)
    await db.commit()

    return {"success": True, "message": "Пользователь заблокирован"}

@router.post("/users/{user_id}/unblock")
async def unblock_user(
    user_id: int,
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Разблокировка пользователя"""

    await db.execute(
        text("UPDATE users SET is_blocked = FALSE, block_reason = NULL, updated_at = NOW() WHERE id = :id"),
        {"id": user_id}
    )

    await log_admin_action(db, admin.id, "unblock_user", user_id, {}, request.client.host if request.client else None)
    await db.commit()

    return {"success": True, "message": "Пользователь разблокирован"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Нет прав администратора")

    result = await db.execute(
        text("SELECT id, username FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    )
    user = result.fetchone()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя удалить самого себя")

    username = user.username

    try:
        await db.execute(text("DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE user_id = :user_id)"), {"user_id": user_id})
        await db.execute(text("DELETE FROM conversations WHERE user_id = :user_id"), {"user_id": user_id})
        await db.execute(text("DELETE FROM transactions WHERE user_id = :user_id"), {"user_id": user_id})
        await db.execute(text("UPDATE admin_logs SET target_user_id = NULL WHERE target_user_id = :user_id"), {"user_id": user_id})
        await db.execute(text("DELETE FROM users WHERE id = :user_id"), {"user_id": user_id})
        await db.commit()

        await db.execute(text("INSERT INTO admin_logs (admin_id, action, details, created_at) VALUES (:admin_id, :action, :details, NOW())"), {"admin_id": current_user.id, "action": "delete_user", "details": json.dumps({"deleted_username": username, "deleted_user_id": user_id})})
        await db.commit()

        return {"message": "Пользователь " + username + " удален"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Ошибка: " + str(e))

# === System Settings ===

@router.get("/settings")
async def get_settings(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Получить системные настройки"""

    result = await db.execute(text("SELECT key, value FROM system_settings"))
    settings = {row.key: row.value for row in result.fetchall()}

    return settings

@router.post("/settings/banner")
async def update_banner(
    data: BannerUpdate,
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Обновить информационный баннер"""

    await db.execute(
        text("UPDATE system_settings SET value = :value, updated_at = NOW(), updated_by = :admin_id WHERE key = 'banner_enabled'"),
        {"value": str(data.enabled).lower(), "admin_id": admin.id}
    )
    await db.execute(
        text("UPDATE system_settings SET value = :value, updated_at = NOW(), updated_by = :admin_id WHERE key = 'banner_text'"),
        {"value": data.text, "admin_id": admin.id}
    )
    await db.execute(
        text("UPDATE system_settings SET value = :value, updated_at = NOW(), updated_by = :admin_id WHERE key = 'banner_type'"),
        {"value": data.type, "admin_id": admin.id}
    )

    await log_admin_action(db, admin.id, "update_banner", None, {"enabled": data.enabled, "text": data.text, "type": data.type}, request.client.host if request.client else None)
    await db.commit()

    return {"success": True}

@router.get("/settings/banner")
async def get_banner(db: AsyncSession = Depends(get_db)):
    """Получить баннер (публичный endpoint)"""

    result = await db.execute(text("SELECT key, value FROM system_settings WHERE key LIKE 'banner_%'"))
    settings = {row.key: row.value for row in result.fetchall()}

    return {
        "enabled": settings.get("banner_enabled", "false") == "true",
        "text": settings.get("banner_text", ""),
        "type": settings.get("banner_type", "info")
    }

# === Logs ===

@router.get("/logs")
async def get_admin_logs(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):
    """Логи действий администраторов"""

    offset = (page - 1) * limit

    result = await db.execute(
        text("""
            SELECT l.id, l.action, l.target_user_id, l.details, l.ip_address, l.created_at,
                   a.username as admin_username,
                   t.username as target_username
            FROM admin_logs l
            LEFT JOIN users a ON l.admin_id = a.id
            LEFT JOIN users t ON l.target_user_id = t.id
            ORDER BY l.created_at DESC
            LIMIT :limit OFFSET :offset
        """),
        {"limit": limit, "offset": offset}
    )

    logs = result.fetchall()

    total_result = await db.execute(text("SELECT COUNT(*) FROM admin_logs"))
    total = total_result.scalar()

    return {
        "logs": [
            {
                "id": log.id,
                "action": log.action,
                "admin_username": log.admin_username,
                "target_user_id": log.target_user_id,
                "target_username": log.target_username,
                "details": log.details if isinstance(log.details, dict) else (json.loads(log.details) if log.details else None),
                "ip_address": log.ip_address,
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }

# === Database Management ===

@router.post("/database/cleanup-old-messages")
async def cleanup_old_messages(
    days: int = Query(90, ge=30, le=365),
    request: Request = None,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Удалить сообщения старше N дней"""

    # Используем параметризованный запрос для защиты от SQL injection
    result = await db.execute(
        text("DELETE FROM messages WHERE created_at < NOW() - INTERVAL '1 day' * :days RETURNING id"),
        {"days": days}
    )
    deleted = len(result.fetchall())

    await log_admin_action(db, admin.id, "cleanup_messages", None, {"days": days, "deleted": deleted}, request.client.host if request.client else None)
    await db.commit()

    return {"success": True, "deleted_messages": deleted}

@router.post("/database/cleanup-empty-conversations")
async def cleanup_empty_conversations(
    request: Request,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Удалить пустые диалоги"""

    result = await db.execute(
        text("""
            DELETE FROM conversations
            WHERE id NOT IN (SELECT DISTINCT conversation_id FROM messages)
            RETURNING id
        """)
    )
    deleted = len(result.fetchall())

    await log_admin_action(db, admin.id, "cleanup_conversations", None, {"deleted": deleted}, request.client.host if request.client else None)
    await db.commit()

    return {"success": True, "deleted_conversations": deleted}

@router.get("/database/stats")
async def get_database_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Статистика базы данных"""

    users = await db.execute(text("SELECT COUNT(*) FROM users"))
    conversations = await db.execute(text("SELECT COUNT(*) FROM conversations"))
    messages = await db.execute(text("SELECT COUNT(*) FROM messages"))
    transactions = await db.execute(text("SELECT COUNT(*) FROM transactions"))

    # Размер таблиц (приблизительно)
    sizes = await db.execute(
        text("""
            SELECT
                relname as table_name,
                pg_size_pretty(pg_total_relation_size(relid)) as total_size
            FROM pg_catalog.pg_statio_user_tables
            ORDER BY pg_total_relation_size(relid) DESC
        """)
    )

    return {
        "counts": {
            "users": users.scalar(),
            "conversations": conversations.scalar(),
            "messages": messages.scalar(),
            "transactions": transactions.scalar(),
        },
        "table_sizes": [{"table": s.table_name, "size": s.total_size} for s in sizes.fetchall()]
    }


# === Analytics - Registration Sources ===

@router.get("/analytics/sources")
async def get_registration_sources(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Статистика регистраций по источникам"""
    
    # Регистрации по источникам
    sources = await db.execute(
        text("""
            SELECT 
                COALESCE(registration_source, 'unknown') as source,
                COUNT(*) as registrations,
                COUNT(CASE WHEN total_deposited > 0 THEN 1 END) as paid_users,
                COALESCE(SUM(total_deposited), 0) as total_deposited,
                COALESCE(SUM(total_spent), 0) as total_spent
            FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY registration_source
            ORDER BY registrations DESC
        """),
        {"days": days}
    )
    
    sources_data = []
    total_registrations = 0
    total_paid = 0
    total_revenue = 0
    
    for row in sources.fetchall():
        registrations = row.registrations
        paid_users = row.paid_users
        conversion = (paid_users / registrations * 100) if registrations > 0 else 0
        
        sources_data.append({
            "source": row.source,
            "registrations": registrations,
            "paid_users": paid_users,
            "conversion_percent": round(conversion, 1),
            "total_deposited_coins": row.total_deposited,
            "total_deposited_rub": row.total_deposited / 100,
            "total_spent_coins": row.total_spent,
            "avg_deposit_rub": round(row.total_deposited / paid_users / 100, 2) if paid_users > 0 else 0,
        })
        
        total_registrations += registrations
        total_paid += paid_users
        total_revenue += row.total_deposited
    
    return {
        "period_days": days,
        "summary": {
            "total_registrations": total_registrations,
            "total_paid_users": total_paid,
            "overall_conversion_percent": round(total_paid / total_registrations * 100, 1) if total_registrations > 0 else 0,
            "total_revenue_coins": total_revenue,
            "total_revenue_rub": total_revenue / 100,
        },
        "sources": sources_data
    }


@router.get("/analytics/funnel")
async def get_conversion_funnel(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Воронка конверсий: визиты -> регистрации -> пополнения"""
    
    # Регистрации за период
    registrations = await db.execute(
        text("""
            SELECT COUNT(*) FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
        """),
        {"days": days}
    )
    total_registrations = registrations.scalar()
    
    # Пользователи с подтверждённым email
    verified = await db.execute(
        text("""
            SELECT COUNT(*) FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
            AND is_verified = TRUE
        """),
        {"days": days}
    )
    verified_users = verified.scalar()
    
    # Пользователи, отправившие хотя бы 1 сообщение
    active = await db.execute(
        text("""
            SELECT COUNT(DISTINCT u.id) FROM users u
            JOIN transactions t ON u.id = t.user_id
            WHERE u.created_at > NOW() - INTERVAL '1 day' * :days
            AND t.type = 'spend'
        """),
        {"days": days}
    )
    active_users = active.scalar()
    
    # Пользователи, пополнившие баланс
    paid = await db.execute(
        text("""
            SELECT COUNT(*) FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
            AND total_deposited > 0
        """),
        {"days": days}
    )
    paid_users = paid.scalar()
    
    # Повторные пополнения (2+ транзакций deposit)
    repeat = await db.execute(
        text("""
            SELECT COUNT(*) FROM (
                SELECT user_id FROM transactions
                WHERE type = 'deposit'
                AND user_id IN (
                    SELECT id FROM users WHERE created_at > NOW() - INTERVAL '1 day' * :days
                )
                GROUP BY user_id
                HAVING COUNT(*) >= 2
            ) as repeat_users
        """),
        {"days": days}
    )
    repeat_users = repeat.scalar()
    
    def calc_rate(current, previous):
        return round(current / previous * 100, 1) if previous > 0 else 0
    
    return {
        "period_days": days,
        "funnel": [
            {
                "stage": "Регистрации",
                "count": total_registrations,
                "rate_percent": 100,
            },
            {
                "stage": "Подтвердили email",
                "count": verified_users,
                "rate_percent": calc_rate(verified_users, total_registrations),
            },
            {
                "stage": "Отправили сообщение",
                "count": active_users,
                "rate_percent": calc_rate(active_users, total_registrations),
            },
            {
                "stage": "Пополнили баланс",
                "count": paid_users,
                "rate_percent": calc_rate(paid_users, total_registrations),
            },
            {
                "stage": "Повторное пополнение",
                "count": repeat_users,
                "rate_percent": calc_rate(repeat_users, total_registrations),
            },
        ]
    }


@router.get("/analytics/daily")
async def get_daily_analytics(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(14, ge=1, le=90)
):
    """Ежедневная статистика регистраций и пополнений"""
    
    result = await db.execute(
        text("""
            SELECT 
                d.date,
                COALESCE(r.registrations, 0) as registrations,
                COALESCE(p.deposits, 0) as deposits,
                COALESCE(p.deposit_amount, 0) as deposit_amount,
                COALESCE(s.spent, 0) as spent
            FROM (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '1 day' * :days,
                    CURRENT_DATE,
                    '1 day'::interval
                )::date as date
            ) d
            LEFT JOIN (
                SELECT created_at::date as date, COUNT(*) as registrations
                FROM users
                GROUP BY created_at::date
            ) r ON d.date = r.date
            LEFT JOIN (
                SELECT created_at::date as date, COUNT(*) as deposits, SUM(amount) as deposit_amount
                FROM transactions WHERE type = 'deposit'
                GROUP BY created_at::date
            ) p ON d.date = p.date
            LEFT JOIN (
                SELECT created_at::date as date, SUM(ABS(amount)) as spent
                FROM transactions WHERE type = 'spend'
                GROUP BY created_at::date
            ) s ON d.date = s.date
            ORDER BY d.date DESC
        """),
        {"days": days}
    )
    
    daily_data = []
    for row in result.fetchall():
        daily_data.append({
            "date": row.date.isoformat(),
            "registrations": row.registrations,
            "deposits_count": row.deposits,
            "deposits_coins": row.deposit_amount,
            "deposits_rub": row.deposit_amount / 100,
            "spent_coins": row.spent,
            "spent_rub": row.spent / 100,
        })
    
    return {
        "period_days": days,
        "daily": daily_data
    }


@router.get("/analytics/utm")
async def get_utm_analytics(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Детальная UTM-аналитика"""
    
    result = await db.execute(
        text("""
            SELECT 
                utm_source,
                utm_medium,
                utm_campaign,
                COUNT(*) as registrations,
                COUNT(CASE WHEN total_deposited > 0 THEN 1 END) as paid_users,
                COALESCE(SUM(total_deposited), 0) as total_deposited
            FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
            AND (utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL)
            GROUP BY utm_source, utm_medium, utm_campaign
            ORDER BY registrations DESC
            LIMIT 100
        """),
        {"days": days}
    )
    
    utm_data = []
    for row in result.fetchall():
        conversion = (row.paid_users / row.registrations * 100) if row.registrations > 0 else 0
        utm_data.append({
            "utm_source": row.utm_source,
            "utm_medium": row.utm_medium,
            "utm_campaign": row.utm_campaign,
            "registrations": row.registrations,
            "paid_users": row.paid_users,
            "conversion_percent": round(conversion, 1),
            "total_deposited_rub": row.total_deposited / 100,
        })
    
    return {
        "period_days": days,
        "utm_campaigns": utm_data
    }


@router.get("/stats/sources")
async def get_source_stats(
    days: int = 7,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """Статистика по источникам (web/telegram)"""
    result = await db.execute(
        text("""
            SELECT 
                COALESCE(source, 'web') as source,
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(ABS(amount)) as total_coins,
                SUM(tokens_used) as total_tokens,
                SUM(cost_usd) as total_cost_usd
            FROM transactions
            WHERE type = 'spend'
                AND created_at >= NOW() - INTERVAL :days DAY
            GROUP BY COALESCE(source, 'web')
            ORDER BY requests DESC
        """),
        {"days": f"{days} days"}
    )
    rows = result.fetchall()
    
    sources = []
    for row in rows:
        sources.append({
            "source": row[0],
            "requests": row[1],
            "unique_users": row[2],
            "total_coins": row[3] or 0,
            "total_rub": (row[3] or 0) / 100,
            "total_tokens": row[4] or 0,
            "total_cost_usd": float(row[5] or 0)
        })
    
    # Общая статистика
    total_requests = sum(s["requests"] for s in sources)
    
    return {
        "period_days": days,
        "sources": sources,
        "total_requests": total_requests
    }


# === Telegram Analytics ===

@router.get("/telegram/stats")
async def get_telegram_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Полная статистика Telegram бота"""
    
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()
    
    # Общая статистика по source
    sources_result = await db.execute(
        text("""
            SELECT 
                source,
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(tokens_used) as total_tokens,
                SUM(ABS(amount)) as total_coins,
                SUM(cost_usd) as total_cost_usd
            FROM transactions
            WHERE type = 'spend' 
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY source
        """),
        {"days": days}
    )
    
    sources_data = {}
    for row in sources_result.fetchall():
        sources_data[row.source or 'web'] = {
            "requests": row.requests,
            "unique_users": row.unique_users,
            "total_tokens": row.total_tokens or 0,
            "total_coins": row.total_coins or 0,
            "total_rub": round((row.total_coins or 0) / 100, 2),
            "cost_usd": round(float(row.total_cost_usd or 0), 4),
            "cost_rub": round(float(row.total_cost_usd or 0) * cbr_rate, 2)
        }
    
    # Telegram детальная статистика по дням
    daily_result = await db.execute(
        text("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(tokens_used) as tokens,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend' 
                AND source = 'telegram'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        """),
        {"days": days}
    )
    
    daily_stats = []
    for row in daily_result.fetchall():
        daily_stats.append({
            "date": row.date.isoformat() if row.date else None,
            "requests": row.requests,
            "unique_users": row.unique_users,
            "tokens": row.tokens or 0,
            "coins": row.coins or 0,
            "rub": round((row.coins or 0) / 100, 2)
        })
    
    # Telegram по моделям
    models_result = await db.execute(
        text("""
            SELECT 
                model,
                COUNT(*) as requests,
                SUM(tokens_used) as tokens,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend' 
                AND source = 'telegram'
                AND model IS NOT NULL
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY model
            ORDER BY requests DESC
        """),
        {"days": days}
    )
    
    models_stats = []
    for row in models_result.fetchall():
        models_stats.append({
            "model": row.model,
            "requests": row.requests,
            "tokens": row.tokens or 0,
            "coins": row.coins or 0,
            "rub": round((row.coins or 0) / 100, 2)
        })
    
    # Telegram топ пользователей
    top_users_result = await db.execute(
        text("""
            SELECT 
                u.username,
                COUNT(*) as requests,
                SUM(t.tokens_used) as tokens,
                SUM(ABS(t.amount)) as coins
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'spend' 
                AND t.source = 'telegram'
                AND t.created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY u.id, u.username
            ORDER BY requests DESC
            LIMIT 10
        """),
        {"days": days}
    )
    
    top_users = []
    for row in top_users_result.fetchall():
        top_users.append({
            "username": row.username,
            "requests": row.requests,
            "tokens": row.tokens or 0,
            "coins": row.coins or 0,
            "rub": round((row.coins or 0) / 100, 2)
        })
    
    # Telegram по часам (активность)
    hourly_result = await db.execute(
        text("""
            SELECT 
                EXTRACT(HOUR FROM created_at) as hour,
                COUNT(*) as requests
            FROM transactions
            WHERE type = 'spend' 
                AND source = 'telegram'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY EXTRACT(HOUR FROM created_at)
            ORDER BY hour
        """),
        {"days": days}
    )
    
    hourly_stats = {int(row.hour): row.requests for row in hourly_result.fetchall()}
    
    # Telegram сегодня vs вчера
    today_result = await db.execute(
        text("""
            SELECT 
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend' 
                AND source = 'telegram'
                AND DATE(created_at) = CURRENT_DATE
        """)
    )
    today = today_result.fetchone()
    
    yesterday_result = await db.execute(
        text("""
            SELECT 
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend' 
                AND source = 'telegram'
                AND DATE(created_at) = CURRENT_DATE - 1
        """)
    )
    yesterday = yesterday_result.fetchone()
    
    telegram_data = sources_data.get('telegram', {
        "requests": 0, "unique_users": 0, "total_tokens": 0, 
        "total_coins": 0, "total_rub": 0, "cost_usd": 0, "cost_rub": 0
    })
    web_data = sources_data.get('web', {
        "requests": 0, "unique_users": 0, "total_tokens": 0,
        "total_coins": 0, "total_rub": 0, "cost_usd": 0, "cost_rub": 0
    })
    
    total_requests = telegram_data["requests"] + web_data["requests"]
    telegram_share = round(telegram_data["requests"] / total_requests * 100, 1) if total_requests > 0 else 0
    
    return {
        "period_days": days,
        "summary": {
            "telegram": telegram_data,
            "web": web_data,
            "telegram_share_percent": telegram_share
        },
        "today": {
            "requests": today.requests if today else 0,
            "users": today.users if today else 0,
            "coins": today.coins or 0 if today else 0,
            "rub": round((today.coins or 0) / 100, 2) if today else 0
        },
        "yesterday": {
            "requests": yesterday.requests if yesterday else 0,
            "users": yesterday.users if yesterday else 0,
            "coins": yesterday.coins or 0 if yesterday else 0,
            "rub": round((yesterday.coins or 0) / 100, 2) if yesterday else 0
        },
        "daily": daily_stats,
        "models": models_stats,
        "top_users": top_users,
        "hourly": hourly_stats
    }


@router.get("/stats/images")
async def get_image_generation_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Статистика генерации изображений"""

    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()
    current_rate = currency_service.get_cached_rate()

    # Фильтруем по моделям генерации изображений
    image_model_patterns = ['image-generation', 'image']

    # Общая статистика генерации изображений
    stats_result = await db.execute(
        text("""
            SELECT
                COUNT(*) as total_generations,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(ABS(amount)) as total_coins,
                SUM(tokens_used) as total_tokens,
                SUM(cost_usd) as total_cost_usd
            FROM transactions
            WHERE type = 'spend'
                AND description = 'Генерация изображения'
                AND created_at > NOW() - INTERVAL '1 day' * :days
        """),
        {"days": days}
    )
    stats = stats_result.fetchone()

    total_coins = stats.total_coins or 0
    total_cost_usd = float(stats.total_cost_usd or 0)
    revenue_rub = total_coins / 100
    cost_rub = total_cost_usd * cbr_rate
    profit_rub = revenue_rub - cost_rub
    margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0

    # Статистика по моделям
    models_result = await db.execute(
        text("""
            SELECT
                model,
                COUNT(*) as generations,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins,
                SUM(cost_usd) as cost_usd
            FROM transactions
            WHERE type = 'spend'
                AND description = 'Генерация изображения'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY model
            ORDER BY generations DESC
        """),
        {"days": days}
    )

    models_stats = []
    for row in models_result.fetchall():
        model_revenue = (row.coins or 0) / 100
        model_cost = float(row.cost_usd or 0) * cbr_rate
        model_profit = model_revenue - model_cost
        model_margin = ((model_revenue - model_cost) / model_cost * 100) if model_cost > 0 else 0

        models_stats.append({
            "model": row.model,
            "generations": row.generations,
            "unique_users": row.users,
            "revenue_rub": round(model_revenue, 2),
            "cost_rub": round(model_cost, 4),
            "profit_rub": round(model_profit, 2),
            "margin_percent": round(model_margin, 1),
            "avg_cost_per_image": round(model_revenue / row.generations, 2) if row.generations > 0 else 0
        })

    # Ежедневная динамика
    daily_result = await db.execute(
        text("""
            SELECT
                DATE(created_at) as date,
                COUNT(*) as generations,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins,
                SUM(cost_usd) as cost_usd
            FROM transactions
            WHERE type = 'spend'
                AND description = 'Генерация изображения'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 14
        """),
        {"days": days}
    )

    daily_stats = []
    for row in daily_result.fetchall():
        day_revenue = (row.coins or 0) / 100
        day_cost = float(row.cost_usd or 0) * cbr_rate

        daily_stats.append({
            "date": row.date.isoformat() if row.date else None,
            "generations": row.generations,
            "users": row.users,
            "revenue_rub": round(day_revenue, 2),
            "cost_rub": round(day_cost, 4),
            "profit_rub": round(day_revenue - day_cost, 2)
        })

    # Топ пользователей по генерациям
    top_users_result = await db.execute(
        text("""
            SELECT
                u.username,
                COUNT(*) as generations,
                SUM(ABS(t.amount)) as coins
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE t.type = 'spend'
                AND t.description = 'Генерация изображения'
                AND t.created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY u.id, u.username
            ORDER BY generations DESC
            LIMIT 10
        """),
        {"days": days}
    )

    top_users = []
    for row in top_users_result.fetchall():
        top_users.append({
            "username": row.username,
            "generations": row.generations,
            "spent_rub": round((row.coins or 0) / 100, 2)
        })

    # По источникам (web/telegram)
    sources_result = await db.execute(
        text("""
            SELECT
                source,
                COUNT(*) as generations,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend'
                AND description = 'Генерация изображения'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY source
        """),
        {"days": days}
    )

    sources = {}
    for row in sources_result.fetchall():
        sources[row.source or 'web'] = {
            "generations": row.generations,
            "revenue_rub": round((row.coins or 0) / 100, 2)
        }

    return {
        "period_days": days,
        "rates": {
            "cbr": round(cbr_rate, 2),
            "selling": round(current_rate, 2)
        },
        "summary": {
            "total_generations": stats.total_generations or 0,
            "unique_users": stats.unique_users or 0,
            "total_tokens": stats.total_tokens or 0,
            "revenue_rub": round(revenue_rub, 2),
            "cost_usd": round(total_cost_usd, 4),
            "cost_rub": round(cost_rub, 2),
            "profit_rub": round(profit_rub, 2),
            "margin_percent": round(margin, 1),
            "avg_cost_per_image": round(revenue_rub / (stats.total_generations or 1), 2)
        },
        "models": models_stats,
        "daily": daily_stats,
        "top_users": top_users,
        "sources": sources
    }


@router.get("/stats/combined")
async def get_combined_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """Объединённая статистика (dashboard + analytics)"""
    
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()
    current_rate = currency_service.get_cached_rate()
    
    # === Пользователи ===
    users_result = await db.execute(
        text("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as new_today,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_week,
                COUNT(CASE WHEN is_blocked = true THEN 1 END) as blocked,
                COUNT(CASE WHEN total_deposited > 0 THEN 1 END) as paid_users
            FROM users
        """)
    )
    users = users_result.fetchone()
    
    # Активные за период
    active_result = await db.execute(
        text("""
            SELECT COUNT(DISTINCT user_id) 
            FROM transactions 
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
        """),
        {"days": days}
    )
    active_users = active_result.scalar() or 0
    
    # === Финансы ===
    finance_result = await db.execute(
        text("""
            SELECT 
                SUM(balance) as total_balance,
                SUM(total_deposited) as total_deposited,
                SUM(total_spent) as total_spent
            FROM users
        """)
    )
    finance = finance_result.fetchone()
    
    # Платежи за период
    payments_result = await db.execute(
        text("""
            SELECT 
                COUNT(*) as count,
                SUM(amount) as total
            FROM payments 
            WHERE status = 'succeeded'
                AND created_at > NOW() - INTERVAL '1 day' * :days
        """),
        {"days": days}
    )
    payments = payments_result.fetchone()
    
    # Платежи сегодня
    today_payments = await db.execute(
        text("""
            SELECT COUNT(*), COALESCE(SUM(amount), 0)
            FROM payments 
            WHERE status = 'succeeded' AND DATE(created_at) = CURRENT_DATE
        """)
    )
    tp = today_payments.fetchone()
    
    # === Использование ===
    usage_result = await db.execute(
        text("""
            SELECT
                COUNT(*) as requests,
                SUM(tokens_used) as tokens,
                SUM(ABS(amount)) as coins_spent,
                SUM(cost_usd) as cost_usd,
                SUM(cost_usd * COALESCE(usd_rate, :default_rate)) as cost_rub_actual
            FROM transactions
            WHERE type = 'spend'
                AND created_at > NOW() - INTERVAL '1 day' * :days
        """),
        {"days": days, "default_rate": cbr_rate}
    )
    usage = usage_result.fetchone()
    
    # Сегодня
    today_usage = await db.execute(
        text("""
            SELECT COUNT(*), SUM(ABS(amount)), SUM(tokens_used)
            FROM transactions 
            WHERE type = 'spend' AND DATE(created_at) = CURRENT_DATE
        """)
    )
    tu = today_usage.fetchone()
    
    # === По источникам ===
    sources_result = await db.execute(
        text("""
            SELECT 
                source,
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY source
        """),
        {"days": days}
    )
    sources = {row.source or 'web': {
        "requests": row.requests,
        "users": row.users,
        "coins": row.coins or 0,
        "rub": round((row.coins or 0) / 100, 2)
    } for row in sources_result.fetchall()}
    
    # === Топ моделей ===
    models_result = await db.execute(
        text("""
            SELECT
                model,
                COUNT(*) as requests,
                SUM(tokens_used) as tokens,
                SUM(ABS(amount)) as coins,
                SUM(cost_usd) as cost_usd,
                SUM(cost_usd * COALESCE(usd_rate, :default_rate)) as cost_rub_actual
            FROM transactions
            WHERE type = 'spend' AND model IS NOT NULL
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY model
            ORDER BY requests DESC
            LIMIT 10
        """),
        {"days": days, "default_rate": cbr_rate}
    )

    top_models = []
    for row in models_result.fetchall():
        revenue_rub = (row.coins or 0) / 100
        # Используем фактическую себестоимость из транзакций (cost_usd * usd_rate на момент записи)
        cost_rub = float(row.cost_rub_actual or 0)
        profit = revenue_rub - cost_rub
        margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0

        top_models.append({
            "model": row.model,
            "requests": row.requests,
            "tokens": row.tokens or 0,
            "revenue_rub": round(revenue_rub, 2),
            "cost_rub": round(cost_rub, 2),
            "profit_rub": round(profit, 2),
            "margin_percent": round(margin, 1)
        })
    
    # === Воронка регистраций ===
    funnel_result = await db.execute(
        text("""
            SELECT 
                COALESCE(registration_source, 'direct') as source,
                COUNT(*) as registrations,
                COUNT(CASE WHEN total_deposited > 0 THEN 1 END) as paid
            FROM users
            WHERE created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY registration_source
            ORDER BY registrations DESC
        """),
        {"days": days}
    )
    
    registration_sources = []
    for row in funnel_result.fetchall():
        conversion = round(row.paid / row.registrations * 100, 1) if row.registrations > 0 else 0
        registration_sources.append({
            "source": row.source,
            "registrations": row.registrations,
            "paid": row.paid,
            "conversion_percent": conversion
        })
    
    # === Ежедневная динамика ===
    daily_result = await db.execute(
        text("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as requests,
                COUNT(DISTINCT user_id) as users,
                SUM(ABS(amount)) as coins
            FROM transactions
            WHERE type = 'spend'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 14
        """),
        {"days": days}
    )
    
    daily = []
    for row in daily_result.fetchall():
        daily.append({
            "date": row.date.isoformat() if row.date else None,
            "requests": row.requests,
            "users": row.users,
            "coins": row.coins or 0,
            "rub": round((row.coins or 0) / 100, 2)
        })
    
    # Рассчёт прибыли (используем фактическую себестоимость из транзакций)
    total_revenue_rub = (usage.coins_spent or 0) / 100
    total_cost_rub = float(usage.cost_rub_actual or 0)
    total_profit = total_revenue_rub - total_cost_rub
    avg_margin = ((total_revenue_rub - total_cost_rub) / total_cost_rub * 100) if total_cost_rub > 0 else 0
    
    return {
        "period_days": days,
        "rates": {
            "cbr": round(cbr_rate, 2),
            "selling": round(current_rate, 2)
        },
        "users": {
            "total": users.total,
            "new_today": users.new_today,
            "new_week": users.new_week,
            "blocked": users.blocked,
            "paid": users.paid_users,
            "active_period": active_users,
            "conversion_percent": round(users.paid_users / users.total * 100, 1) if users.total > 0 else 0
        },
        "finance": {
            "total_balance_coins": finance.total_balance or 0,
            "total_balance_rub": round((finance.total_balance or 0) / 100, 2),
            "total_deposited_coins": finance.total_deposited or 0,
            "total_deposited_rub": round((finance.total_deposited or 0) / 100, 2),
            "total_spent_coins": finance.total_spent or 0,
            "total_spent_rub": round((finance.total_spent or 0) / 100, 2),
            "payments_period": payments.count or 0,
            "payments_period_rub": round((payments.total or 0) / 100, 2),
            "payments_today": tp[0] or 0,
            "payments_today_rub": round((tp[1] or 0) / 100, 2)
        },
        "usage": {
            "requests": usage.requests or 0,
            "tokens": usage.tokens or 0,
            "tokens_millions": round((usage.tokens or 0) / 1000000, 2),
            "revenue_rub": round(total_revenue_rub, 2),
            "cost_rub": round(total_cost_rub, 2),
            "profit_rub": round(total_profit, 2),
            "margin_percent": round(avg_margin, 1)
        },
        "today": {
            "requests": tu[0] or 0,
            "coins": tu[1] or 0,
            "tokens": tu[2] or 0,
            "rub": round((tu[1] or 0) / 100, 2)
        },
        "sources": sources,
        "top_models": top_models,
        "registration_sources": registration_sources,
        "daily": daily
    }


# === Provider Cost Analytics ===

@router.get("/stats/providers")
async def get_provider_statistics(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """
    Статистика расходов по провайдерам API (OpenRouter vs Replicate)

    Группирует модели по провайдерам и показывает:
    - Фактические расходы (cost_usd)
    - Выручку (коины в рубли)
    - Маржу и прибыль
    """
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()
    current_rate = currency_service.get_cached_rate()

    # Определяем провайдера по имени модели
    # OpenRouter: google/, openai/, anthropic/, deepseek/, etc
    # Replicate: wan-video/, minimax/, kwaivgi/, etc

    result = await db.execute(
        text("""
            SELECT
                model,
                source,
                COUNT(*) as requests,
                SUM(tokens_used) as total_tokens,
                SUM(ABS(amount)) as total_coins,
                SUM(cost_usd) as total_cost_usd
            FROM transactions
            WHERE type = 'spend'
                AND model IS NOT NULL
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY model, source
            ORDER BY total_coins DESC
        """),
        {"days": days}
    )

    rows = result.fetchall()

    # Группируем по провайдерам
    providers = {
        "openrouter": {
            "name": "OpenRouter (текст + картинки)",
            "models": [],
            "total_requests": 0,
            "total_tokens": 0,
            "total_coins": 0,
            "total_cost_usd": 0,
            "total_revenue_rub": 0,
            "total_cost_rub": 0,
            "total_profit_rub": 0,
            "by_source": {"web": {"requests": 0, "coins": 0, "cost_usd": 0},
                          "telegram": {"requests": 0, "coins": 0, "cost_usd": 0}}
        },
        "replicate": {
            "name": "Replicate (видео)",
            "models": [],
            "total_requests": 0,
            "total_tokens": 0,
            "total_coins": 0,
            "total_cost_usd": 0,
            "total_revenue_rub": 0,
            "total_cost_rub": 0,
            "total_profit_rub": 0,
            "by_source": {"web": {"requests": 0, "coins": 0, "cost_usd": 0},
                          "telegram": {"requests": 0, "coins": 0, "cost_usd": 0}}
        }
    }

    # Модели Replicate (видео)
    replicate_prefixes = ['wan-video/', 'minimax/', 'kwaivgi/', 'google/veo', 'pixverse/', 'bytedance/']

    for row in rows:
        model = row.model or "unknown"
        source = row.source or "web"
        requests = row.requests or 0
        tokens = row.total_tokens or 0
        coins = row.total_coins or 0
        cost_usd = float(row.total_cost_usd) if row.total_cost_usd else 0

        # Определяем провайдера
        is_replicate = any(model.startswith(prefix) for prefix in replicate_prefixes)
        provider_key = "replicate" if is_replicate else "openrouter"

        provider = providers[provider_key]
        provider["total_requests"] += requests
        provider["total_tokens"] += tokens
        provider["total_coins"] += coins
        provider["total_cost_usd"] += cost_usd

        # По источникам
        if source in provider["by_source"]:
            provider["by_source"][source]["requests"] += requests
            provider["by_source"][source]["coins"] += coins
            provider["by_source"][source]["cost_usd"] += cost_usd

        # Детализация по модели
        revenue_rub = coins / 100
        cost_rub = cost_usd * cbr_rate
        profit_rub = revenue_rub - cost_rub
        margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0

        provider["models"].append({
            "model": model,
            "source": source,
            "requests": requests,
            "tokens": tokens,
            "coins": coins,
            "revenue_rub": round(revenue_rub, 2),
            "cost_usd": round(cost_usd, 6),
            "cost_rub": round(cost_rub, 2),
            "profit_rub": round(profit_rub, 2),
            "margin_percent": round(margin, 1)
        })

    # Подсчитываем итоги по провайдерам
    grand_total = {
        "total_requests": 0,
        "total_coins": 0,
        "total_cost_usd": 0,
        "total_revenue_rub": 0,
        "total_cost_rub": 0,
        "total_profit_rub": 0
    }

    for key, provider in providers.items():
        provider["total_revenue_rub"] = round(provider["total_coins"] / 100, 2)
        provider["total_cost_rub"] = round(provider["total_cost_usd"] * cbr_rate, 2)
        provider["total_profit_rub"] = round(provider["total_revenue_rub"] - provider["total_cost_rub"], 2)
        provider["margin_percent"] = round(
            ((provider["total_revenue_rub"] - provider["total_cost_rub"]) / provider["total_cost_rub"] * 100)
            if provider["total_cost_rub"] > 0 else 0, 1
        )

        # Обновляем by_source с рублями
        for src in provider["by_source"].values():
            src["revenue_rub"] = round(src["coins"] / 100, 2)
            src["cost_rub"] = round(src["cost_usd"] * cbr_rate, 2)
            src["profit_rub"] = round(src["revenue_rub"] - src["cost_rub"], 2)

        grand_total["total_requests"] += provider["total_requests"]
        grand_total["total_coins"] += provider["total_coins"]
        grand_total["total_cost_usd"] += provider["total_cost_usd"]
        grand_total["total_revenue_rub"] += provider["total_revenue_rub"]
        grand_total["total_cost_rub"] += provider["total_cost_rub"]
        grand_total["total_profit_rub"] += provider["total_profit_rub"]

    grand_total["total_cost_usd"] = round(grand_total["total_cost_usd"], 6)
    grand_total["margin_percent"] = round(
        ((grand_total["total_revenue_rub"] - grand_total["total_cost_rub"]) / grand_total["total_cost_rub"] * 100)
        if grand_total["total_cost_rub"] > 0 else 0, 1
    )

    return {
        "period_days": days,
        "cbr_rate": round(cbr_rate, 2),
        "sell_rate": round(current_rate, 2),
        "grand_total": grand_total,
        "providers": providers
    }


@router.get("/stats/daily-costs")
async def get_daily_costs(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=90)
):
    """
    Дневная статистика расходов и прибыли
    Для графика динамики маржи
    """
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()

    result = await db.execute(
        text("""
            SELECT
                DATE(created_at) as date,
                COUNT(*) as requests,
                SUM(ABS(amount)) as total_coins,
                SUM(cost_usd) as total_cost_usd,
                SUM(tokens_used) as total_tokens
            FROM transactions
            WHERE type = 'spend'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        """),
        {"days": days}
    )

    daily_data = []
    for row in result.fetchall():
        coins = row.total_coins or 0
        cost_usd = float(row.total_cost_usd) if row.total_cost_usd else 0
        revenue_rub = coins / 100
        cost_rub = cost_usd * cbr_rate
        profit_rub = revenue_rub - cost_rub
        margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0

        daily_data.append({
            "date": row.date.isoformat() if row.date else None,
            "requests": row.requests or 0,
            "tokens": row.total_tokens or 0,
            "coins": coins,
            "revenue_rub": round(revenue_rub, 2),
            "cost_usd": round(cost_usd, 4),
            "cost_rub": round(cost_rub, 2),
            "profit_rub": round(profit_rub, 2),
            "margin_percent": round(margin, 1)
        })

    return {
        "period_days": days,
        "cbr_rate": round(cbr_rate, 2),
        "daily": daily_data
    }


@router.get("/stats/source-comparison")
async def get_source_comparison(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365)
):
    """
    Сравнение источников (web vs telegram)
    С разбивкой по типам генерации: text, image, video
    """
    from ..services.currency_service import currency_service
    cbr_rate = currency_service.get_cbr_rate()

    # Определяем тип генерации по модели
    result = await db.execute(
        text("""
            SELECT
                source,
                model,
                COUNT(*) as requests,
                SUM(ABS(amount)) as total_coins,
                SUM(cost_usd) as total_cost_usd,
                SUM(tokens_used) as total_tokens
            FROM transactions
            WHERE type = 'spend'
                AND created_at > NOW() - INTERVAL '1 day' * :days
            GROUP BY source, model
        """),
        {"days": days}
    )

    # Категоризация моделей
    image_models = {'google/gemini-2.5-flash-preview-image-generation', 'google/gemini-2.0-flash-exp-image-generation'}
    video_prefixes = ['wan-video/', 'minimax/', 'kwaivgi/', 'pixverse/', 'bytedance/']

    sources = {
        "web": {"text": {}, "image": {}, "video": {}, "total": {}},
        "telegram": {"text": {}, "image": {}, "video": {}, "total": {}}
    }

    def init_stats():
        return {"requests": 0, "coins": 0, "cost_usd": 0, "tokens": 0}

    for src in sources:
        for gen_type in sources[src]:
            sources[src][gen_type] = init_stats()

    for row in result.fetchall():
        source = row.source or "web"
        model = row.model or "unknown"

        if source not in sources:
            source = "web"

        # Определяем тип генерации
        if model in image_models:
            gen_type = "image"
        elif any(model.startswith(p) for p in video_prefixes):
            gen_type = "video"
        else:
            gen_type = "text"

        stats = sources[source][gen_type]
        stats["requests"] += row.requests or 0
        stats["coins"] += row.total_coins or 0
        stats["cost_usd"] += float(row.total_cost_usd) if row.total_cost_usd else 0
        stats["tokens"] += row.total_tokens or 0

        # Total
        total = sources[source]["total"]
        total["requests"] += row.requests or 0
        total["coins"] += row.total_coins or 0
        total["cost_usd"] += float(row.total_cost_usd) if row.total_cost_usd else 0
        total["tokens"] += row.total_tokens or 0

    # Добавляем рубли и маржу
    for source in sources:
        for gen_type in sources[source]:
            stats = sources[source][gen_type]
            revenue_rub = stats["coins"] / 100
            cost_rub = stats["cost_usd"] * cbr_rate
            profit_rub = revenue_rub - cost_rub
            margin = ((revenue_rub - cost_rub) / cost_rub * 100) if cost_rub > 0 else 0

            stats["revenue_rub"] = round(revenue_rub, 2)
            stats["cost_rub"] = round(cost_rub, 2)
            stats["profit_rub"] = round(profit_rub, 2)
            stats["margin_percent"] = round(margin, 1)
            stats["cost_usd"] = round(stats["cost_usd"], 6)

    return {
        "period_days": days,
        "cbr_rate": round(cbr_rate, 2),
        "sources": sources
    }
