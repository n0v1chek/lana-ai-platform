"""
Backend Endpoints v2.4 - Система с маржой 75-80%
+ Выбор модели пользователем
БЕЗ акций и лимитов сообщений
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

from subscription_plans_optimized import (
    SUBSCRIPTION_PLANS,
    SubscriptionTier,
    get_model_cost,
    can_use_model,
    calculate_margin,
)
from model_access_control import ModelAccessController
from smart_model_router import SmartModelRouter

# Инициализация роутера
router = APIRouter()
model_router = SmartModelRouter()

# ============================================
# PYDANTIC МОДЕЛИ
# ============================================

class ChatRequest(BaseModel):
    message: str
    model_id: Optional[str] = None  # Если None - автовыбор
    conversation_history: Optional[List[Dict]] = None

class ChatResponse(BaseModel):
    message: str
    model_used: str
    model_name: str
    tokens_used: int
    cost_rub: float
    explanation: Optional[str] = None
    upgrade_suggestion: Optional[Dict] = None
    usage_stats: Dict

class UserProfileUpdate(BaseModel):
    preferred_model: str

class AvailableModel(BaseModel):
    model_id: str
    model_name: str
    category: str
    cost_per_1m_tokens: int
    is_premium: bool
    is_available: bool
    limit_info: Optional[str] = None

# ============================================
# CHAT ENDPOINT
# ============================================

@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Умный чат с автоматическим выбором модели или использованием preferred_model
    """
    
    # 1. Получаем статистику пользователя
    controller = ModelAccessController(db)
    stats = await controller.get_usage_stats(user.id)
    
    # 2. Определяем какую модель использовать
    requested_model = request.model_id or user.preferred_model
    
    # 3. Умный выбор модели
    model_selection = model_router.select_optimal_model(
        user_tier=user.subscription_tier,
        message=request.message,
        conversation_history=request.conversation_history,
        user_stats=stats,
        preferred_model=requested_model
    )
    
    # 4. Проверяем доступ к выбранной модели
    allowed, alternative, reason = await controller.check_model_access(
        user_id=user.id,
        model_id=model_selection["model_id"],
        estimated_tokens=model_selection["estimated_tokens"]
    )
    
    if not allowed:
        if alternative:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": reason,
                    "alternative_model": alternative,
                    "alternative_name": await get_model_name(db, alternative),
                    "upgrade_url": "/pricing",
                    "current_tier": user.subscription_tier,
                }
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": reason}
        )
    
    # 5. Отправляем запрос к OpenRouter
    try:
        openrouter_response = await send_to_openrouter(
            model_id=model_selection["model_id"],
            messages=build_messages(request.message, request.conversation_history)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка OpenRouter API: {str(e)}"
        )
    
    # 6. Логируем использование
    tokens_used = openrouter_response["usage"]["total_tokens"]
    cost_rub = (tokens_used / 1_000_000) * get_model_cost(model_selection["model_id"])
    
    await controller.log_usage(
        user_id=user.id,
        model_id=model_selection["model_id"],
        tokens_used=tokens_used,
        request_cost_rub=cost_rub
    )
    
    # 7. Обновляем статистику
    updated_stats = await controller.get_usage_stats(user.id)
    
    # 8. Проверяем нужен ли апгрейд
    upgrade_suggestion = await controller.suggest_upgrade(user.id)
    
    # 9. Получаем красивое имя модели
    model_name = await get_model_name(db, model_selection["model_id"])
    
    return ChatResponse(
        message=openrouter_response["choices"][0]["message"]["content"],
        model_used=model_selection["model_id"],
        model_name=model_name,
        tokens_used=tokens_used,
        cost_rub=round(cost_rub, 2),
        explanation=model_router.explain_model_choice(model_selection),
        upgrade_suggestion=upgrade_suggestion,
        usage_stats={
            "tokens_used": updated_stats["total_tokens_used"],
            "tokens_limit": SUBSCRIPTION_PLANS[user.subscription_tier]["tokens_limit"],
            "usage_percent": round(
                (updated_stats["total_tokens_used"] / 
                 SUBSCRIPTION_PLANS[user.subscription_tier]["tokens_limit"]) * 100, 
                1
            ),
        }
    )

# ============================================
# PROFILE ENDPOINTS
# ============================================

@router.get("/api/profile/models")
async def get_available_models_for_user(
    user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Получить список доступных моделей для текущего тарифа
    """
    # Получаем модели из БД
    models = await db.fetch_all(
        "SELECT * FROM get_available_models(:tier)",
        {"tier": user.subscription_tier}
    )
    
    # Получаем статистику пользователя
    controller = ModelAccessController(db)
    stats = await controller.get_usage_stats(user.id)
    
    # Проверяем доступность каждой модели
    from subscription_plans_optimized import MODEL_ACCESS_RULES
    rules = MODEL_ACCESS_RULES[user.subscription_tier]
    plan = SUBSCRIPTION_PLANS[user.subscription_tier]
    
    available_models = []
    for model in models:
        # Проверяем доступ к модели
        allowed, _, reason = can_use_model(
            user.subscription_tier,
            model["model_id"],
            stats["total_tokens_used"],
            stats["premium_tokens_used"]
        )
        
        # Формируем информацию о лимитах
        limit_info = None
        if model["is_premium"]:
            premium_limit = int(plan["tokens_limit"] * rules["premium_limit_percent"] / 100)
            if premium_limit > 0:
                limit_info = f"{rules['premium_limit_percent']}% от общего лимита ({premium_limit:,} токенов)"
            else:
                limit_info = "Недоступно на этом тарифе"
        
        available_models.append(AvailableModel(
            model_id=model["model_id"],
            model_name=model["model_name"],
            category=model["category"],
            cost_per_1m_tokens=model["cost_per_1m_tokens"],
            is_premium=model["is_premium"],
            is_available=allowed,
            limit_info=limit_info
        ))
    
    return {
        "tier": user.subscription_tier,
        "current_preferred_model": user.preferred_model,
        "models": available_models,
        "premium_limit_percent": rules["premium_limit_percent"],
        "usage": {
            "total_tokens_used": stats["total_tokens_used"],
            "premium_tokens_used": stats["premium_tokens_used"],
            "tokens_limit": plan["tokens_limit"],
        }
    }

@router.put("/api/profile/preferred-model")
async def update_preferred_model(
    update: UserProfileUpdate,
    user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Обновить предпочитаемую модель пользователя
    """
    # Проверяем что модель доступна для тарифа
    available_models = await db.fetch_all(
        "SELECT model_id FROM get_available_models(:tier)",
        {"tier": user.subscription_tier}
    )
    
    available_model_ids = [m["model_id"] for m in available_models]
    
    if update.preferred_model not in available_model_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Модель недоступна для вашего тарифа",
                "available_models": available_model_ids,
                "upgrade_url": "/pricing"
            }
        )
    
    # Обновляем модель
    await db.execute(
        "UPDATE users SET preferred_model = :model WHERE id = :user_id",
        {"model": update.preferred_model, "user_id": user.id}
    )
    
    # Получаем имя модели
    model_name = await get_model_name(db, update.preferred_model)
    
    return {
        "success": True,
        "preferred_model": update.preferred_model,
        "model_name": model_name,
        "message": f"Модель успешно обновлена на {model_name}"
    }

@router.get("/api/profile/usage-stats")
async def get_user_usage_stats(
    user = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Получить детальную статистику использования пользователя
    """
    controller = ModelAccessController(db)
    stats = await controller.get_usage_stats(user.id)
    plan = SUBSCRIPTION_PLANS[user.subscription_tier]
    
    # Получаем топ используемых моделей
    top_models = await db.fetch_all(
        """
        SELECT 
            model_id,
            SUM(tokens_used) as total_tokens,
            COUNT(*) as requests_count,
            SUM(cost_rub) as total_cost
        FROM usage_logs
        WHERE user_id = :user_id 
            AND created_at >= DATE_TRUNC('month', NOW())
        GROUP BY model_id
        ORDER BY total_tokens DESC
        LIMIT 5
        """,
        {"user_id": user.id}
    )
    
    # Получаем имена моделей
    top_models_with_names = []
    for model in top_models:
        model_name = await get_model_name(db, model["model_id"])
        top_models_with_names.append({
            "model_id": model["model_id"],
            "model_name": model_name,
            "tokens": model["total_tokens"],
            "requests": model["requests_count"],
            "cost_rub": float(model["total_cost"])
        })
    
    return {
        "tier": user.subscription_tier,
        "tokens_used": stats["total_tokens_used"],
        "tokens_limit": plan["tokens_limit"],
        "usage_percent": round((stats["total_tokens_used"] / plan["tokens_limit"]) * 100, 1),
        "premium_tokens_used": stats["premium_tokens_used"],
        "top_models": top_models_with_names,
        "tokens_reset_at": user.tokens_reset_at,
    }

# ============================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================

async def get_model_name(db, model_id: str) -> str:
    """Получить красивое имя модели"""
    result = await db.fetch_one(
        "SELECT model_name FROM get_available_models('BUSINESS') WHERE model_id = :model_id",
        {"model_id": model_id}
    )
    return result["model_name"] if result else model_id

async def send_to_openrouter(model_id: str, messages: List[Dict]) -> Dict:
    """Отправить запрос к OpenRouter API"""
    import httpx
    import os
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "HTTP-Referer": "https://lanaaihelper.ru",
        "X-Title": "Lana AI Helper",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": model_id,
        "messages": messages,
    }
    
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

def build_messages(user_message: str, history: Optional[List[Dict]] = None) -> List[Dict]:
    """Построить массив сообщений для OpenRouter"""
    messages = []
    
    # Добавляем историю (последние 10 сообщений)
    if history:
        for msg in history[-10:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
    
    # Добавляем текущее сообщение
    messages.append({
        "role": "user",
        "content": user_message
    })
    
    return messages

# ============================================
# ЭКСПОРТ
# ============================================

__all__ = ["router"]
