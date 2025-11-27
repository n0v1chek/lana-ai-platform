"""
Система контроля доступа к моделям с учетом тарифов
Автоматическое переключение на дешевые модели при превышении лимита
"""

from typing import Optional, Dict, Tuple
from datetime import datetime
from subscription_plans_optimized import (
    SubscriptionTier,
    ModelCategory,
    can_use_model,
    get_model_category,
    get_model_cost,
    get_recommended_model,
    SUBSCRIPTION_PLANS,
    MODEL_ACCESS_RULES,
)

class ModelAccessController:
    """Контроллер доступа к моделям"""
    
    def __init__(self, db_session):
        """
        Args:
            db_session: Сессия базы данных для получения информации о пользователе
        """
        self.db = db_session
    
    async def check_model_access(
        self,
        user_id: int,
        model_id: str,
        estimated_tokens: int = 0
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Проверить доступ пользователя к модели
        
        Args:
            user_id: ID пользователя
            model_id: ID модели для использования
            estimated_tokens: Примерное количество токенов для запроса
        
        Returns:
            (allowed, alternative_model, reason):
                - allowed: bool - разрешен ли доступ
                - alternative_model: str | None - альтернативная дешевая модель
                - reason: str | None - причина отказа
        """
        # Получаем пользователя из БД
        user = await self.db.get_user(user_id)
        if not user:
            return False, None, "Пользователь не найден"
        
        # Получаем статистику использования за месяц
        stats = await self.get_usage_stats(user_id)
        
        # Проверяем общий лимит токенов
        plan = SUBSCRIPTION_PLANS[user.subscription_tier]
        if stats["total_tokens_used"] + estimated_tokens > plan["tokens_limit"]:
            return False, None, f"Исчерпан месячный лимит токенов ({plan['tokens_limit']:,})"
        
        # Проверяем лимит сообщений в день
        if plan["messages_per_day"]:
            if stats["messages_today"] >= plan["messages_per_day"]:
                return False, None, f"Исчерпан дневной лимит сообщений ({plan['messages_per_day']})"
        
        # Проверяем доступ к конкретной модели
        allowed, reason = can_use_model(
            user.subscription_tier,
            model_id,
            stats["total_tokens_used"],
            stats["premium_tokens_used"]
        )
        
        if not allowed:
            # Предлагаем альтернативную дешевую модель
            alternative = get_recommended_model(user.subscription_tier, "general")
            return False, alternative, reason
        
        # Проверяем лимит премиум моделей
        model_category = get_model_category(model_id)
        if model_category in [ModelCategory.PREMIUM, ModelCategory.ULTRA]:
            rules = MODEL_ACCESS_RULES[user.subscription_tier]
            premium_limit = int(plan["tokens_limit"] * rules["premium_limit_percent"] / 100)
            
            if stats["premium_tokens_used"] + estimated_tokens > premium_limit:
                alternative = get_recommended_model(user.subscription_tier, "general")
                return False, alternative, f"Лимит премиум-моделей исчерпан ({rules['premium_limit_percent']}%). Используйте {alternative}"
        
        return True, None, None
    
    async def get_usage_stats(self, user_id: int) -> Dict:
        """
        Получить статистику использования за текущий месяц
        
        Returns:
            {
                "total_tokens_used": int,
                "premium_tokens_used": int,
                "messages_today": int,
                "models_usage": Dict[str, int]
            }
        """
        # TODO: Реализовать запрос к БД
        # Пример структуры:
        
        from datetime import datetime, timedelta
        
        current_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        today_start = datetime.now().replace(hour=0, minute=0, second=0)
        
        # Запрос статистики за месяц
        monthly_stats = await self.db.query(
            """
            SELECT 
                COALESCE(SUM(tokens_used), 0) as total_tokens,
                model_id,
                tokens_used
            FROM message_history
            WHERE user_id = :user_id AND created_at >= :month_start
            GROUP BY model_id
            """,
            {"user_id": user_id, "month_start": current_month_start}
        )
        
        # Подсчитываем премиум токены
        total_tokens = 0
        premium_tokens = 0
        models_usage = {}
        
        for row in monthly_stats:
            model_id = row["model_id"]
            tokens = row["tokens_used"]
            
            total_tokens += tokens
            models_usage[model_id] = tokens
            
            category = get_model_category(model_id)
            if category in [ModelCategory.PREMIUM, ModelCategory.ULTRA]:
                premium_tokens += tokens
        
        # Сообщения за сегодня
        messages_today = await self.db.query_scalar(
            """
            SELECT COUNT(*) 
            FROM message_history
            WHERE user_id = :user_id AND created_at >= :today_start
            """,
            {"user_id": user_id, "today_start": today_start}
        )
        
        return {
            "total_tokens_used": total_tokens,
            "premium_tokens_used": premium_tokens,
            "messages_today": messages_today or 0,
            "models_usage": models_usage,
        }
    
    async def suggest_upgrade(self, user_id: int) -> Optional[Dict]:
        """
        Предложить апгрейд если пользователь часто упирается в лимиты
        
        Returns:
            {
                "should_upgrade": bool,
                "current_tier": str,
                "recommended_tier": str,
                "reason": str,
                "benefits": List[str]
            }
        """
        user = await self.db.get_user(user_id)
        stats = await self.get_usage_stats(user_id)
        plan = SUBSCRIPTION_PLANS[user.subscription_tier]
        
        # Проверяем использование
        usage_percent = (stats["total_tokens_used"] / plan["tokens_limit"]) * 100
        
        # Если использовано >80% лимита
        if usage_percent > 80:
            next_tier = self._get_next_tier(user.subscription_tier)
            if next_tier:
                next_plan = SUBSCRIPTION_PLANS[next_tier]
                return {
                    "should_upgrade": True,
                    "current_tier": user.subscription_tier,
                    "recommended_tier": next_tier,
                    "reason": f"Использовано {usage_percent:.0f}% месячного лимита",
                    "benefits": [
                        f"Лимит токенов: {next_plan['tokens_limit']:,} (вместо {plan['tokens_limit']:,})",
                        f"Сообщений в день: {next_plan['messages_per_day'] or 'без лимита'}",
                        *[f"✓ {feature}" for feature in next_plan['features'][:3]],
                    ],
                    "price_difference": next_plan["price_rub"] - plan["price_rub"],
                }
        
        return None
    
    def _get_next_tier(self, current_tier: SubscriptionTier) -> Optional[SubscriptionTier]:
        """Получить следующий тариф для апгрейда"""
        tiers = [SubscriptionTier.MINI, SubscriptionTier.STARTER, SubscriptionTier.PRO, SubscriptionTier.BUSINESS]
        try:
            current_index = tiers.index(current_tier)
            if current_index < len(tiers) - 1:
                return tiers[current_index + 1]
        except ValueError:
            pass
        return None
    
    async def log_usage(
        self,
        user_id: int,
        model_id: str,
        tokens_used: int,
        request_cost_rub: float
    ):
        """
        Записать использование модели в БД
        
        Args:
            user_id: ID пользователя
            model_id: ID использованной модели
            tokens_used: Количество использованных токенов
            request_cost_rub: Стоимость запроса в рублях
        """
        await self.db.execute(
            """
            INSERT INTO usage_logs (user_id, model_id, tokens_used, cost_rub, created_at)
            VALUES (:user_id, :model_id, :tokens_used, :cost_rub, NOW())
            """,
            {
                "user_id": user_id,
                "model_id": model_id,
                "tokens_used": tokens_used,
                "cost_rub": request_cost_rub,
            }
        )

# ============================================
# FASTAPI DEPENDENCY
# ============================================

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_model_access(
    model_id: str,
    estimated_tokens: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)  # Ваша функция получения DB
):
    """
    Dependency для проверки доступа к модели в FastAPI
    
    Использование:
        @app.post("/chat")
        async def chat(
            request: ChatRequest,
            access = Depends(verify_model_access)
        ):
            # Если код дошел сюда - доступ разрешен
            ...
    """
    # Получаем user_id из токена
    user_id = await get_user_id_from_token(credentials.credentials)
    
    controller = ModelAccessController(db)
    allowed, alternative, reason = await controller.check_model_access(
        user_id, model_id, estimated_tokens
    )
    
    if not allowed:
        if alternative:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "error": reason,
                    "alternative_model": alternative,
                    "upgrade_url": "/pricing"
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"error": reason}
            )
    
    return {
        "user_id": user_id,
        "model_id": model_id,
        "allowed": True
    }

# ============================================
# ПРИМЕР ИСПОЛЬЗОВАНИЯ В РОУТЕ
# ============================================

"""
from fastapi import APIRouter, Depends
from model_access_control import verify_model_access, ModelAccessController

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    access = Depends(verify_model_access),
    db = Depends(get_db)
):
    user_id = access["user_id"]
    model_id = request.model_id
    
    # Отправляем запрос к OpenRouter
    response = await send_to_openrouter(model_id, request.messages)
    
    # Логируем использование
    controller = ModelAccessController(db)
    await controller.log_usage(
        user_id=user_id,
        model_id=model_id,
        tokens_used=response.usage.total_tokens,
        request_cost_rub=calculate_cost(model_id, response.usage.total_tokens)
    )
    
    # Проверяем нужен ли апгрейд
    upgrade_suggestion = await controller.suggest_upgrade(user_id)
    if upgrade_suggestion:
        # Добавляем в ответ предложение апгрейда
        response.metadata = {"upgrade_suggestion": upgrade_suggestion}
    
    return response
"""
