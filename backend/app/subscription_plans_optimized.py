"""
Оптимизированная система тарифов с маржой 75-80%
БЕЗ акций и лимитов сообщений - только токены
Разработчик: Живчин Александр Семенович, ИНН: 263109568337
"""

from enum import Enum
from typing import Dict, List

class SubscriptionTier(str, Enum):
    """Уровни подписки"""
    MINI = "MINI"
    STARTER = "STARTER"
    PRO = "PRO"
    BUSINESS = "BUSINESS"

class ModelCategory(str, Enum):
    """Категории моделей по стоимости"""
    CHEAP = "cheap"           # Gemini Flash, GPT-4o-mini (до $0.15)
    MEDIUM = "medium"         # GPT-4o, Claude Haiku ($0.15-$3)
    PREMIUM = "premium"       # Claude Sonnet, Opus ($3-$15)
    ULTRA = "ultra"          # Claude Opus 4, GPT-5 ($15+)

# ============================================
# ТАРИФНЫЕ ПЛАНЫ С МАРЖОЙ 75-80%
# ============================================

SUBSCRIPTION_PLANS = {
    SubscriptionTier.MINI: {
        "name": "MINI",
        "price_rub": 199,
        "price_usd": 2.10,
        "tokens_limit": 50_000,
        "description": "Для личного использования",
        "features": [
            "50,000 токенов в месяц",
            "Gemini Flash, GPT-4o-mini",
            "Базовая поддержка",
        ],
        # Затраты OpenRouter: ~17₽
        # Маржа: 175₽ (88%)
        "openrouter_cost_estimate": 17,
        "margin_rub": 175,
        "margin_percent": 88,
    },
    SubscriptionTier.STARTER: {
        "name": "STARTER",
        "price_rub": 890,
        "price_usd": 9.37,
        "tokens_limit": 500_000,
        "description": "Для активных пользователей",
        "features": [
            "500,000 токенов в месяц",
            "Все дешевые модели",
            "GPT-4o (10% лимит)",
            "История чатов",
            "Приоритетная поддержка",
        ],
        # Затраты OpenRouter: ~150₽
        # Маржа: 710₽ (80%)
        "openrouter_cost_estimate": 150,
        "margin_rub": 710,
        "margin_percent": 80,
    },
    SubscriptionTier.PRO: {
        "name": "PRO",
        "price_rub": 4_990,
        "price_usd": 52.53,
        "tokens_limit": 2_000_000,
        "description": "Для профессионалов",
        "features": [
            "2,000,000 токенов в месяц",
            "Все дешевые модели без лимита",
            "GPT-4o, Claude Sonnet (30% лимит)",
            "API доступ",
            "Приоритетная поддержка 24/7",
        ],
        # Затраты OpenRouter: ~800₽
        # Маржа: 4,000₽ (80%)
        "openrouter_cost_estimate": 800,
        "margin_rub": 4_000,
        "margin_percent": 80,
    },
    SubscriptionTier.BUSINESS: {
        "name": "BUSINESS",
        "price_rub": 19_990,
        "price_usd": 210.42,
        "tokens_limit": 8_000_000,
        "description": "Для команд и бизнеса",
        "features": [
            "8,000,000 токенов в месяц",
            "Все 150+ моделей без ограничений",
            "Мультиюзер (10 человек)",
            "SLA поддержка 24/7",
            "API доступ",
            "Приоритетная обработка",
        ],
        # Затраты OpenRouter: ~4,000₽
        # Маржа: 15,000₽ (75%)
        "openrouter_cost_estimate": 4_000,
        "margin_rub": 15_000,
        "margin_percent": 75,
    },
}

# ============================================
# ОГРАНИЧЕНИЯ МОДЕЛЕЙ ПО ТАРИФАМ
# ============================================

MODEL_ACCESS_RULES = {
    SubscriptionTier.MINI: {
        "allowed_categories": [ModelCategory.CHEAP],
        "allowed_models": [
            "google/gemini-2.0-flash-001",
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            "openai/gpt-4o-mini-2024-07-18",
        ],
        "premium_limit_percent": 0,  # 0% премиум моделей
        "blocked_categories": [ModelCategory.MEDIUM, ModelCategory.PREMIUM, ModelCategory.ULTRA],
    },
    SubscriptionTier.STARTER: {
        "allowed_categories": [ModelCategory.CHEAP, ModelCategory.MEDIUM],
        "allowed_models": [
            # Дешевые - без ограничений
            "google/gemini-2.0-flash-001",
            "google/gemini-2.5-flash",
            "openai/gpt-4o-mini",
            # Средние - 10% лимит
            "openai/gpt-4o",
            "openai/gpt-4o-2024-11-20",
        ],
        "premium_limit_percent": 10,  # 10% токенов на премиум
        "blocked_categories": [ModelCategory.PREMIUM, ModelCategory.ULTRA],
    },
    SubscriptionTier.PRO: {
        "allowed_categories": [ModelCategory.CHEAP, ModelCategory.MEDIUM, ModelCategory.PREMIUM],
        "allowed_models": "all_except_ultra",  # Все кроме ультра
        "premium_limit_percent": 30,  # 30% токенов на премиум
        "blocked_categories": [ModelCategory.ULTRA],
    },
    SubscriptionTier.BUSINESS: {
        "allowed_categories": "all",
        "allowed_models": "all",
        "premium_limit_percent": 100,  # Без ограничений
        "blocked_categories": [],
    },
}

# ============================================
# КАТЕГОРИЗАЦИЯ МОДЕЛЕЙ ПО СТОИМОСТИ
# ============================================

MODEL_CATEGORIES_MAPPING = {
    # CHEAP: до $0.15 за 1M токенов (средняя цена)
    ModelCategory.CHEAP: [
        "google/gemini-2.0-flash-001",
        "google/gemini-2.5-flash",
        "google/gemini-2.5-flash-lite",
        "openai/gpt-4o-mini",
        "openai/gpt-4o-mini-2024-07-18",
        "deepseek/deepseek-chat",
        "deepseek/deepseek-r1",
        "meta-llama/llama-3.3-70b-instruct",
        "qwen/qwen-plus",
    ],
    
    # MEDIUM: $0.15-$3 за 1M токенов
    ModelCategory.MEDIUM: [
        "openai/gpt-4o",
        "openai/gpt-4o-2024-11-20",
        "openai/gpt-4o-2024-08-06",
        "anthropic/claude-3.5-haiku",
        "anthropic/claude-haiku-4.5",
        "cohere/command-r-plus-08-2024",
        "mistralai/mistral-large-2411",
    ],
    
    # PREMIUM: $3-$15 за 1M токенов
    ModelCategory.PREMIUM: [
        "anthropic/claude-sonnet-4.5",
        "anthropic/claude-sonnet-4",
        "anthropic/claude-3.5-sonnet",
        "x-ai/grok-3",
        "x-ai/grok-4",
        "google/gemini-2.5-pro",
    ],
    
    # ULTRA: $15+ за 1M токенов
    ModelCategory.ULTRA: [
        "anthropic/claude-opus-4.1",
        "anthropic/claude-opus-4",
        "anthropic/claude-opus-4.5",
        "openai/o1",
        "openai/o3",
        "openai/gpt-5",
    ],
}

# ============================================
# СТОИМОСТЬ МОДЕЛЕЙ (средняя цена в рублях за 1M токенов)
# ============================================

MODEL_COSTS_RUB = {
    # CHEAP
    "google/gemini-2.0-flash-001": 32,
    "google/gemini-2.5-flash": 32,
    "openai/gpt-4o-mini": 48,
    "deepseek/deepseek-chat": 97,
    "meta-llama/llama-3.3-70b-instruct": 29,
    
    # MEDIUM
    "openai/gpt-4o": 808,
    "anthropic/claude-3.5-haiku": 326,
    "anthropic/claude-haiku-4.5": 380,
    
    # PREMIUM
    "anthropic/claude-sonnet-4.5": 1_197,
    "anthropic/claude-sonnet-4": 1_197,
    "x-ai/grok-3": 1_197,
    "x-ai/grok-4": 1_197,
    "google/gemini-2.5-pro": 760,
    
    # ULTRA
    "anthropic/claude-opus-4.1": 3_325,
    "anthropic/claude-opus-4": 3_325,
    "openai/o1": 5_225,
}

# ============================================
# ФУНКЦИИ ДЛЯ РАБОТЫ С ТАРИФАМИ
# ============================================

def get_model_category(model_id: str) -> ModelCategory:
    """Определить категорию модели"""
    for category, models in MODEL_CATEGORIES_MAPPING.items():
        if model_id in models:
            return category
    return ModelCategory.CHEAP  # По умолчанию дешевая

def get_model_cost(model_id: str) -> int:
    """Получить стоимость модели в рублях за 1M токенов"""
    return MODEL_COSTS_RUB.get(model_id, 50)  # По умолчанию 50₽

def can_use_model(user_tier: SubscriptionTier, model_id: str, tokens_used: int, premium_tokens_used: int) -> tuple[bool, str]:
    """
    Проверить может ли пользователь использовать модель
    
    Returns:
        (bool, str): (разрешено, причина отказа)
    """
    rules = MODEL_ACCESS_RULES[user_tier]
    model_category = get_model_category(model_id)
    
    # Проверка заблокированных категорий
    if model_category in rules["blocked_categories"]:
        return False, f"Модель {model_id} доступна с тарифа PRO"
    
    # Проверка лимита премиум моделей
    if model_category in [ModelCategory.PREMIUM, ModelCategory.ULTRA]:
        plan = SUBSCRIPTION_PLANS[user_tier]
        total_limit = plan["tokens_limit"]
        premium_limit = int(total_limit * rules["premium_limit_percent"] / 100)
        
        if premium_tokens_used >= premium_limit:
            return False, f"Исчерпан лимит премиум-моделей ({rules['premium_limit_percent']}%)"
    
    return True, ""

def get_recommended_model(user_tier: SubscriptionTier, task_type: str = "general") -> str:
    """
    Получить рекомендуемую модель для задачи
    
    Args:
        user_tier: Тариф пользователя
        task_type: Тип задачи (general, coding, creative, analysis)
    """
    if user_tier == SubscriptionTier.MINI:
        return "google/gemini-2.0-flash-001"  # Самая дешевая
    
    if user_tier == SubscriptionTier.STARTER:
        if task_type == "coding":
            return "openai/gpt-4o-mini"
        return "google/gemini-2.5-flash"
    
    if user_tier == SubscriptionTier.PRO:
        if task_type == "coding":
            return "openai/gpt-4o"
        if task_type == "creative":
            return "anthropic/claude-sonnet-4"
        return "google/gemini-2.5-flash"
    
    # BUSINESS - лучшие модели
    if task_type == "coding":
        return "openai/gpt-4o"
    if task_type == "creative":
        return "anthropic/claude-sonnet-4.5"
    if task_type == "analysis":
        return "anthropic/claude-sonnet-4.5"
    
    return "openai/gpt-4o"

def calculate_margin(tier: SubscriptionTier, actual_tokens_used: int, models_used: Dict[str, int]) -> Dict:
    """
    Рассчитать фактическую маржу на основе использования
    
    Args:
        tier: Тариф пользователя
        actual_tokens_used: Фактически использованные токены
        models_used: Словарь {model_id: tokens_count}
    
    Returns:
        Dict с информацией о марже
    """
    plan = SUBSCRIPTION_PLANS[tier]
    revenue = plan["price_rub"]
    
    # Рассчитываем фактические затраты
    actual_cost = 0
    for model_id, tokens in models_used.items():
        cost_per_million = get_model_cost(model_id)
        actual_cost += (tokens / 1_000_000) * cost_per_million
    
    actual_margin = revenue - actual_cost
    actual_margin_percent = (actual_margin / revenue) * 100 if revenue > 0 else 0
    
    return {
        "tier": tier,
        "revenue_rub": revenue,
        "actual_cost_rub": round(actual_cost, 2),
        "actual_margin_rub": round(actual_margin, 2),
        "actual_margin_percent": round(actual_margin_percent, 1),
        "estimated_cost_rub": plan["openrouter_cost_estimate"],
        "estimated_margin_rub": plan["margin_rub"],
        "estimated_margin_percent": plan["margin_percent"],
    }

# ============================================
# ЭКСПОРТ
# ============================================

__all__ = [
    "SubscriptionTier",
    "ModelCategory",
    "SUBSCRIPTION_PLANS",
    "MODEL_ACCESS_RULES",
    "MODEL_CATEGORIES_MAPPING",
    "MODEL_COSTS_RUB",
    "get_model_category",
    "get_model_cost",
    "can_use_model",
    "get_recommended_model",
    "calculate_margin",
]
