from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class SubscriptionPlanResponse(BaseModel):
    """Схема тарифного плана v2.4 - без лимитов сообщений"""
    name: str
    display_name: str
    price: int
    tokens_limit: int
    tokens_monthly: Optional[int] = None  # Новое поле
    allowed_models: List[str]
    features: List[str]
    description: str
    popular: Optional[bool] = False
    premium_tokens_percent: Optional[int] = 0  # Процент премиум токенов
    
    class Config:
        from_attributes = True


class UserSubscriptionInfo(BaseModel):
    """Информация о подписке пользователя v2.4"""
    subscription_plan: str
    tokens_used: int
    tokens_limit: int
    tokens_remaining: int
    premium_tokens_used: Optional[int] = 0
    premium_tokens_limit: Optional[int] = 0
    subscription_expires: Optional[datetime]
    preferred_model: Optional[str] = None
    can_upgrade: bool
    
    class Config:
        from_attributes = True


class UpgradeRequest(BaseModel):
    """Запрос на обновление подписки"""
    new_plan: str
    payment_method: str = "yookassa"


class UpgradeResponse(BaseModel):
    """Ответ на обновление подписки"""
    success: bool
    message: str
    payment_url: Optional[str] = None
    new_plan: str
    new_tokens_limit: int


class UsageStatsResponse(BaseModel):
    """Статистика использования v2.4"""
    plan: str
    tokens_used: int
    tokens_limit: int
    tokens_remaining: int
    usage_percent: float
    premium_tokens_used: int
    premium_tokens_limit: int
    preferred_model: Optional[str] = None
    tokens_reset_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
