from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 дней вместо 30

    ANTHROPIC_API_KEY: Optional[str] = None
    OPENROUTER_API_KEY: Optional[str] = None

    YUKASSA_SHOP_ID: Optional[str] = None
    YUKASSA_SECRET_KEY: Optional[str] = None
    SMTP_HOST: str = "smtp.beget.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: Optional[str] = None
    SITE_URL: str = "https://lanaaihelper.ru"
    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_SECRET_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# ============================================
# v2.4: Обновленные тарифы с маржой 75-80%
# БЕЗ акций и лимитов сообщений
# ============================================

class SubscriptionConfig:
    """Конфигурация тарифных планов v2.4 - маржа 75-80%"""

    # FREE - для ознакомления (без изменений)
    FREE = {
        "name": "FREE",
        "display_name": "Бесплатный",
        "price": 0,
        "tokens_limit": 10000,
        "tokens_monthly": 10000,
        "allowed_models": ["google/gemini-2.0-flash-001", "openai/gpt-4o-mini"],
        "features": [
            "10,000 токенов",
            "Gemini Flash, GPT-4o-mini",
            "Базовый чат"
        ],
        "description": "Для знакомства с сервисом",
        "cost_api": 1,
        "margin": -1,
        "margin_percent": 0
    }

    # MINI - новый тариф 199₽
    MINI = {
        "name": "MINI",
        "display_name": "Мини",
        "price": 199,
        "tokens_limit": 50000,
        "tokens_monthly": 50000,
        "allowed_models": ["google/gemini-2.0-flash-001", "google/gemini-2.5-flash", "openai/gpt-4o-mini", "deepseek/deepseek-chat"],
        "features": [
            "50,000 токенов в месяц",
            "Gemini Flash, GPT-4o-mini",
            "DeepSeek Chat",
            "Базовая поддержка"
        ],
        "description": "Для легкого использования",
        "cost_api": 3,
        "cost_payment": 6,
        "cost_tax": 12,
        "cost_total": 21,
        "margin": 178,
        "margin_percent": 89
    }

    # STARTER - 890₽ (было 1490₽)
    STARTER = {
        "name": "STARTER",
        "display_name": "Стартовый",
        "price": 890,
        "tokens_limit": 500000,
        "tokens_monthly": 500000,
        "premium_tokens_percent": 10,  # 10% на GPT-4o
        "allowed_models": [
            "google/gemini-2.0-flash-001",
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "deepseek/deepseek-chat",
            "openai/gpt-4o",  # 10% лимит
            "anthropic/claude-3.5-haiku"  # 10% лимит
        ],
        "features": [
            "500,000 токенов в месяц",
            "Все быстрые модели",
            "GPT-4o (10% лимит)",
            "Claude Haiku (10% лимит)",
            "Приоритетная поддержка"
        ],
        "description": "Для активного использования",
        "cost_api": 50,
        "cost_payment": 27,
        "cost_tax": 53,
        "cost_total": 130,
        "margin": 760,
        "margin_percent": 85
    }

    # PRO - 4990₽ (было 3990₽)
    PRO = {
        "name": "PRO",
        "display_name": "Профессиональный",
        "price": 4990,
        "tokens_limit": 2000000,
        "tokens_monthly": 2000000,
        "premium_tokens_percent": 30,  # 30% на премиум модели
        "allowed_models": [
            "google/gemini-2.0-flash-001",
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "deepseek/deepseek-chat",
            "openai/gpt-4o",
            "anthropic/claude-3.5-haiku",
            "anthropic/claude-sonnet-4",  # 30% лимит
            "anthropic/claude-3.5-sonnet",  # 30% лимит
            "google/gemini-2.5-pro"  # 30% лимит
        ],
        "features": [
            "2,000,000 токенов в месяц",
            "GPT-4o, Claude Sonnet (30% лимит)",
            "Gemini Pro (30% лимит)",
            "API доступ",
            "Поддержка 24/7"
        ],
        "description": "Для профессионалов",
        "popular": True,
        "cost_api": 500,
        "cost_payment": 150,
        "cost_tax": 299,
        "cost_total": 949,
        "margin": 4041,
        "margin_percent": 81
    }

    # BUSINESS - 19990₽ (было 12990₽)
    BUSINESS = {
        "name": "BUSINESS",
        "display_name": "Бизнес",
        "price": 19990,
        "tokens_limit": 8000000,
        "tokens_monthly": 8000000,
        "premium_tokens_percent": 100,  # Без ограничений
        "allowed_models": ["all"],
        "features": [
            "8,000,000 токенов в месяц",
            "Все 150+ моделей без ограничений",
            "Claude Opus, GPT-o1",
            "Мультиюзер (10 человек)",
            "API доступ",
            "SLA поддержка 24/7",
            "Выделенный менеджер"
        ],
        "description": "Для команд и компаний",
        "cost_api": 3000,
        "cost_payment": 600,
        "cost_tax": 1199,
        "cost_total": 4799,
        "margin": 15191,
        "margin_percent": 76
    }

    @classmethod
    def get_plan(cls, plan_name: str):
        """Получить конфигурацию тарифа"""
        plans = {
            "free": cls.FREE,
            "mini": cls.MINI,
            "starter": cls.STARTER,
            "pro": cls.PRO,
            "business": cls.BUSINESS,
            # Legacy mapping
            "basic": cls.STARTER,
            "unlimited": cls.BUSINESS,
        }
        return plans.get(plan_name.lower(), cls.FREE)

    @classmethod
    def get_all_plans(cls):
        """Получить все тарифы (для отображения)"""
        return [cls.FREE, cls.MINI, cls.STARTER, cls.PRO, cls.BUSINESS]

    @classmethod
    def get_paid_plans(cls):
        """Получить платные тарифы"""
        return [cls.MINI, cls.STARTER, cls.PRO, cls.BUSINESS]

    @classmethod
    def get_margin(cls, plan_name: str):
        """Получить маржу тарифа"""
        plan = cls.get_plan(plan_name)
        return plan.get("margin", 0)

    @classmethod
    def calculate_revenue(cls, plan_name: str, users: int):
        """Рассчитать выручку для количества пользователей"""
        plan = cls.get_plan(plan_name)
        revenue = plan["price"] * users
        costs = plan.get("cost_total", 0) * users
        profit = revenue - costs
        return {
            "revenue": revenue,
            "costs": costs,
            "profit": profit,
            "margin_percent": (profit / revenue * 100) if revenue > 0 else 0
        }

    @classmethod
    def get_tokens_limit_for_plan(cls, plan_name: str) -> int:
        """Получить лимит токенов для тарифа"""
        plan = cls.get_plan(plan_name)
        return plan.get("tokens_limit", 10000)

    @classmethod
    def get_premium_percent(cls, plan_name: str) -> int:
        """Получить процент премиум токенов"""
        plan = cls.get_plan(plan_name)
        return plan.get("premium_tokens_percent", 0)


# ============================================
# OpenRouter Models Configuration
# ============================================

OPENROUTER_MODELS = {
    # Cheap models
    "gemini-flash": "google/gemini-2.0-flash-001",
    "gemini-2.5-flash": "google/gemini-2.5-flash",
    "gpt-4o-mini": "openai/gpt-4o-mini",
    "deepseek": "deepseek/deepseek-chat",
    
    # Medium models
    "gpt-4o": "openai/gpt-4o",
    "claude-haiku": "anthropic/claude-3.5-haiku",
    
    # Premium models
    "claude-sonnet-4": "anthropic/claude-sonnet-4",
    "claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
    "gemini-pro": "google/gemini-2.5-pro",
    
    # Ultra models
    "claude-opus-4": "anthropic/claude-opus-4",
    "o1": "openai/o1",
}

# Pricing (цены за 1M токенов в рублях)
MODEL_COSTS_RUB = {
    "google/gemini-2.0-flash-001": 32,
    "google/gemini-2.5-flash": 32,
    "openai/gpt-4o-mini": 48,
    "deepseek/deepseek-chat": 97,
    "openai/gpt-4o": 808,
    "anthropic/claude-3.5-haiku": 326,
    "anthropic/claude-sonnet-4": 1197,
    "anthropic/claude-3.5-sonnet": 1197,
    "google/gemini-2.5-pro": 760,
    "anthropic/claude-opus-4": 3325,
    "openai/o1": 5225,
}

USD_TO_RUB = 95

