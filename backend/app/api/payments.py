from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime
import uuid
import httpx
import base64
import json
import logging

from ..core.database import get_db
from ..models.user import User
from ..api.auth import get_current_user
from ..core.config import settings

router = APIRouter(tags=["Payments"])
logger = logging.getLogger(__name__)

# Минимальное пополнение
MIN_AMOUNT_RUB = 49
COINS_PER_RUB = 100

# YooKassa credentials
YOOKASSA_SHOP_ID = settings.YOOKASSA_SHOP_ID
YOOKASSA_SECRET_KEY = settings.YOOKASSA_SECRET_KEY
YOOKASSA_API_URL = "https://api.yookassa.ru/v3"


def get_auth_header():
    """Создает заголовок авторизации для YooKassa"""
    credentials = f"{YOOKASSA_SHOP_ID}:{YOOKASSA_SECRET_KEY}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return {"Authorization": f"Basic {encoded}"}


@router.post("/create")
async def create_payment(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создание платежа через YooKassa"""
    try:
        data = await request.json()
        amount = int(data.get("amount", 0))
        
        if amount < MIN_AMOUNT_RUB:
            raise HTTPException(status_code=400, detail=f"Минимальная сумма {MIN_AMOUNT_RUB}₽")
        
        if amount > 100000:
            raise HTTPException(status_code=400, detail="Максимальная сумма 100 000₽")
        
        idempotence_key = str(uuid.uuid4())
        coins = amount * COINS_PER_RUB
        
        # Создаем платеж в YooKassa
        payment_data = {
            "amount": {
                "value": f"{amount}.00",
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": f"{settings.SITE_URL}/chat?payment=success"
            },
            "capture": True,
            "description": f"Пополнение баланса на {coins} коинов",
            "metadata": {
                "user_id": current_user.id,
                "coins": coins
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{YOOKASSA_API_URL}/payments",
                json=payment_data,
                headers={
                    **get_auth_header(),
                    "Idempotence-Key": idempotence_key,
                    "Content-Type": "application/json"
                }
            )
        
        if response.status_code != 200:
            logger.error(f"YooKassa error: {response.text}")
            raise HTTPException(status_code=500, detail="Ошибка создания платежа")
        
        result = response.json()
        
        # Сохраняем платеж в БД
        await db.execute(text("""
            INSERT INTO payments (user_id, payment_id, amount, coins, status, created_at)
            VALUES (:user_id, :payment_id, :amount, :coins, 'pending', NOW())
        """), {
            "user_id": current_user.id,
            "payment_id": result["id"],
            "amount": amount,
            "coins": coins
        })
        await db.commit()
        
        return {
            "payment_id": result["id"],
            "confirmation_url": result["confirmation"]["confirmation_url"],
            "amount": amount,
            "coins": coins
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment creation error: {e}")
        raise HTTPException(status_code=500, detail="Ошибка создания платежа")


@router.post("/webhook")
async def yookassa_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Webhook для уведомлений от YooKassa"""
    try:
        data = await request.json()
        logger.info(f"YooKassa webhook: {data}")
        
        event = data.get("event")
        payment_object = data.get("object", {})
        payment_id = payment_object.get("id")
        
        if not payment_id:
            return {"status": "ok"}
        
        if event == "payment.succeeded":
            # Получаем платеж из БД
            result = await db.execute(text("""
                SELECT user_id, coins, status FROM payments WHERE payment_id = :payment_id
            """), {"payment_id": payment_id})
            payment = result.fetchone()
            
            if not payment:
                logger.warning(f"Payment not found: {payment_id}")
                return {"status": "ok"}
            
            if payment.status == "succeeded":
                logger.info(f"Payment already processed: {payment_id}")
                return {"status": "ok"}
            
            user_id = payment.user_id
            coins = payment.coins
            
            # Начисляем коины пользователю
            await db.execute(text("""
                UPDATE users SET 
                    balance = balance + :coins,
                    total_deposited = total_deposited + :coins
                WHERE id = :user_id
            """), {"coins": coins, "user_id": user_id})
            
            # Обновляем статус платежа
            await db.execute(text("""
                UPDATE payments SET status = 'succeeded', paid_at = NOW() WHERE payment_id = :payment_id
            """), {"payment_id": payment_id})
            
            # Записываем транзакцию
            result = await db.execute(text("SELECT balance FROM users WHERE id = :user_id"), {"user_id": user_id})
            new_balance = result.scalar()
            
            await db.execute(text("""
                INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description, created_at)
                VALUES (:user_id, 'deposit', :amount, :before, :after, :desc, NOW())
            """), {
                "user_id": user_id,
                "amount": coins,
                "before": new_balance - coins,
                "after": new_balance,
                "desc": f"Пополнение через YooKassa"
            })
            
            await db.commit()
            logger.info(f"Payment succeeded: {payment_id}, user {user_id}, +{coins} coins")
            
        elif event == "payment.canceled":
            await db.execute(text("""
                UPDATE payments SET status = 'canceled' WHERE payment_id = :payment_id
            """), {"payment_id": payment_id})
            await db.commit()
            logger.info(f"Payment canceled: {payment_id}")
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "ok"}


@router.get("/history")
async def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """История платежей пользователя"""
    result = await db.execute(text("""
        SELECT payment_id, amount, coins, status, created_at, paid_at
        FROM payments
        WHERE user_id = :user_id
        ORDER BY created_at DESC
        LIMIT 50
    """), {"user_id": current_user.id})
    
    payments = []
    for row in result.fetchall():
        payments.append({
            "payment_id": row.payment_id,
            "amount": row.amount,
            "coins": row.coins,
            "status": row.status,
            "created_at": row.created_at.isoformat() if row.created_at else None,
            "paid_at": row.paid_at.isoformat() if row.paid_at else None
        })
    
    return payments


@router.get("/prices")
async def get_prices():
    """Получить актуальные цены моделей (публичный endpoint)"""
    from ..services.ai_service import get_model_prices
    return await get_model_prices()
