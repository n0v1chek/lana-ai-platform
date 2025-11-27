"""
Умный роутер моделей - автоматический выбор оптимальной модели
на основе задачи, тарифа и доступных лимитов
"""

import re
from typing import List, Dict, Optional
from subscription_plans_optimized import (
    SubscriptionTier,
    ModelCategory,
    get_model_category,
    get_model_cost,
    get_recommended_model,
    MODEL_ACCESS_RULES,
)

class SmartModelRouter:
    """Умный выбор модели на основе контекста и тарифа"""
    
    # Ключевые слова для определения типа задачи
    TASK_KEYWORDS = {
        "coding": [
            "код", "code", "python", "javascript", "программ", "функци",
            "class", "def", "import", "script", "debug", "ошибка", "bug",
            "api", "sql", "html", "css", "react", "django", "flask"
        ],
        "creative": [
            "напиши", "write", "story", "статья", "article", "текст",
            "сочинение", "essay", "поэм", "poem", "стих", "творчеств",
            "креатив", "creative", "придумай", "сгенерируй текст"
        ],
        "analysis": [
            "анализ", "analysis", "сравни", "compare", "оцени", "evaluate",
            "исследуй", "research", "изучи", "study", "разбор", "объясни",
            "почему", "why", "причина", "reason", "вывод", "conclusion"
        ],
        "translation": [
            "перевод", "translate", "translation", "на английский", "на русский",
            "to english", "to russian", "языка"
        ],
        "math": [
            "посчитай", "calculate", "математик", "math", "формула", "formula",
            "уравнение", "equation", "задача", "problem", "решение", "solution"
        ],
    }
    
    def __init__(self):
        pass
    
    def detect_task_type(self, message: str) -> str:
        """
        Определить тип задачи по сообщению пользователя
        
        Returns:
            "coding" | "creative" | "analysis" | "translation" | "math" | "general"
        """
        message_lower = message.lower()
        
        # Подсчитываем совпадения для каждого типа
        scores = {}
        for task_type, keywords in self.TASK_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                scores[task_type] = score
        
        if not scores:
            return "general"
        
        # Возвращаем тип с максимальным количеством совпадений
        return max(scores.items(), key=lambda x: x[1])[0]
    
    def estimate_tokens(self, message: str, conversation_history: List[Dict] = None) -> int:
        """
        Оценить количество токенов для запроса
        
        Args:
            message: Сообщение пользователя
            conversation_history: История диалога
        
        Returns:
            Примерное количество токенов (input + expected output)
        """
        # Грубая оценка: 1 токен ≈ 4 символа для русского/английского
        message_tokens = len(message) // 4
        
        # История диалога
        history_tokens = 0
        if conversation_history:
            for msg in conversation_history[-10:]:  # Последние 10 сообщений
                history_tokens += len(msg.get("content", "")) // 4
        
        # Ожидаемый ответ (обычно больше чем запрос)
        expected_output_tokens = message_tokens * 2
        
        total = message_tokens + history_tokens + expected_output_tokens
        
        # Округляем вверх с запасом
        return int(total * 1.2)
    
    def select_optimal_model(
        self,
        user_tier: SubscriptionTier,
        message: str,
        conversation_history: List[Dict] = None,
        user_stats: Dict = None,
        preferred_model: Optional[str] = None
    ) -> Dict:
        """
        Выбрать оптимальную модель для задачи
        
        Args:
            user_tier: Тариф пользователя
            message: Сообщение пользователя
            conversation_history: История диалога
            user_stats: Статистика использования {total_tokens_used, premium_tokens_used}
            preferred_model: Предпочитаемая модель (если указана)
        
        Returns:
            {
                "model_id": str,
                "reason": str,
                "estimated_cost_rub": float,
                "task_type": str,
                "alternative_models": List[str]
            }
        """
        # Определяем тип задачи
        task_type = self.detect_task_type(message)
        
        # Оцениваем токены
        estimated_tokens = self.estimate_tokens(message, conversation_history)
        
        # Получаем правила тарифа
        rules = MODEL_ACCESS_RULES[user_tier]
        
        # Если пользователь указал предпочтение и оно доступно
        if preferred_model:
            model_category = get_model_category(preferred_model)
            if model_category not in rules["blocked_categories"]:
                # Проверяем лимит премиум моделей
                if self._check_premium_limit(user_tier, model_category, user_stats, estimated_tokens):
                    return self._build_response(preferred_model, task_type, estimated_tokens, "user_preference")
        
        # Выбираем модель автоматически на основе тарифа и задачи
        selected_model = self._auto_select_model(user_tier, task_type, user_stats, estimated_tokens)
        
        return self._build_response(selected_model, task_type, estimated_tokens, "auto_selected")
    
    def _check_premium_limit(
        self,
        user_tier: SubscriptionTier,
        model_category: ModelCategory,
        user_stats: Optional[Dict],
        estimated_tokens: int
    ) -> bool:
        """Проверить лимит премиум моделей"""
        if model_category not in [ModelCategory.PREMIUM, ModelCategory.ULTRA]:
            return True  # Не премиум - всегда OK
        
        if not user_stats:
            return True  # Нет статистики - разрешаем
        
        from subscription_plans_optimized import SUBSCRIPTION_PLANS
        
        rules = MODEL_ACCESS_RULES[user_tier]
        plan = SUBSCRIPTION_PLANS[user_tier]
        
        premium_limit = int(plan["tokens_limit"] * rules["premium_limit_percent"] / 100)
        premium_used = user_stats.get("premium_tokens_used", 0)
        
        return (premium_used + estimated_tokens) <= premium_limit
    
    def _auto_select_model(
        self,
        user_tier: SubscriptionTier,
        task_type: str,
        user_stats: Optional[Dict],
        estimated_tokens: int
    ) -> str:
        """Автоматически выбрать оптимальную модель"""
        
        # MINI тариф - только дешевые модели
        if user_tier == SubscriptionTier.MINI:
            if task_type == "coding":
                return "openai/gpt-4o-mini"
            return "google/gemini-2.0-flash-001"
        
        # STARTER - дешевые + немного GPT-4o
        if user_tier == SubscriptionTier.STARTER:
            # Проверяем лимит GPT-4o (10%)
            can_use_premium = self._check_premium_limit(
                user_tier, ModelCategory.MEDIUM, user_stats, estimated_tokens
            )
            
            if can_use_premium and task_type in ["coding", "analysis"]:
                return "openai/gpt-4o"
            
            if task_type == "coding":
                return "openai/gpt-4o-mini"
            
            return "google/gemini-2.5-flash"
        
        # PRO - включаем премиум модели для сложных задач
        if user_tier == SubscriptionTier.PRO:
            can_use_premium = self._check_premium_limit(
                user_tier, ModelCategory.PREMIUM, user_stats, estimated_tokens
            )
            
            if can_use_premium:
                if task_type == "creative":
                    return "anthropic/claude-sonnet-4"
                if task_type == "analysis":
                    return "anthropic/claude-sonnet-4"
                if task_type == "coding":
                    return "openai/gpt-4o"
            
            # Если лимит премиум исчерпан - используем дешевые
            if task_type == "coding":
                return "openai/gpt-4o"
            return "google/gemini-2.5-flash"
        
        # BUSINESS - лучшие модели для всех задач
        if task_type == "creative":
            return "anthropic/claude-sonnet-4.5"
        if task_type == "analysis":
            return "anthropic/claude-sonnet-4.5"
        if task_type == "coding":
            return "openai/gpt-4o"
        
        return "openai/gpt-4o"
    
    def _build_response(
        self,
        model_id: str,
        task_type: str,
        estimated_tokens: int,
        selection_reason: str
    ) -> Dict:
        """Построить ответ с выбранной моделью"""
        cost_per_million = get_model_cost(model_id)
        estimated_cost = (estimated_tokens / 1_000_000) * cost_per_million
        
        # Альтернативные модели
        alternatives = self._get_alternatives(model_id, task_type)
        
        return {
            "model_id": model_id,
            "reason": selection_reason,
            "estimated_cost_rub": round(estimated_cost, 2),
            "estimated_tokens": estimated_tokens,
            "task_type": task_type,
            "alternative_models": alternatives,
            "model_category": get_model_category(model_id).value,
        }
    
    def _get_alternatives(self, selected_model: str, task_type: str) -> List[str]:
        """Получить список альтернативных моделей"""
        category = get_model_category(selected_model)
        
        alternatives = []
        
        # Всегда предлагаем самые дешевые
        if selected_model != "google/gemini-2.0-flash-001":
            alternatives.append("google/gemini-2.0-flash-001")
        
        if selected_model != "openai/gpt-4o-mini" and task_type == "coding":
            alternatives.append("openai/gpt-4o-mini")
        
        # Если выбрана дешевая, предлагаем премиум
        if category == ModelCategory.CHEAP:
            if task_type in ["creative", "analysis"]:
                alternatives.append("anthropic/claude-sonnet-4")
            else:
                alternatives.append("openai/gpt-4o")
        
        return alternatives[:3]  # Максимум 3 альтернативы
    
    def explain_model_choice(self, model_response: Dict) -> str:
        """
        Объяснить пользователю почему выбрана эта модель
        
        Returns:
            Человекочитаемое объяснение
        """
        model_id = model_response["model_id"]
        task_type = model_response["task_type"]
        cost = model_response["estimated_cost_rub"]
        
        # Названия моделей для пользователя
        model_names = {
            "google/gemini-2.0-flash-001": "Gemini Flash (быстрая)",
            "google/gemini-2.5-flash": "Gemini 2.5 Flash",
            "openai/gpt-4o-mini": "GPT-4o Mini",
            "openai/gpt-4o": "GPT-4o",
            "anthropic/claude-sonnet-4": "Claude Sonnet 4",
            "anthropic/claude-sonnet-4.5": "Claude Sonnet 4.5",
        }
        
        task_names = {
            "coding": "программирования",
            "creative": "творческих задач",
            "analysis": "анализа",
            "translation": "перевода",
            "math": "математики",
            "general": "общих задач",
        }
        
        model_name = model_names.get(model_id, model_id)
        task_name = task_names.get(task_type, "этой задачи")
        
        explanation = f"💡 Выбрана модель {model_name} для {task_name}"
        
        if cost < 0.5:
            explanation += " (экономичный вариант)"
        elif cost > 5:
            explanation += " (премиум качество)"
        
        return explanation

# ============================================
# ПРИМЕР ИСПОЛЬЗОВАНИЯ
# ============================================

"""
from smart_model_router import SmartModelRouter

router = SmartModelRouter()

# В вашем chat endpoint:
@app.post("/chat")
async def chat(request: ChatRequest, user = Depends(get_current_user)):
    # Получаем статистику пользователя
    stats = await get_user_stats(user.id)
    
    # Умный выбор модели
    model_selection = router.select_optimal_model(
        user_tier=user.subscription_tier,
        message=request.message,
        conversation_history=request.history,
        user_stats=stats,
        preferred_model=request.model_id  # Если пользователь выбрал
    )
    
    # Объясняем выбор (опционально)
    explanation = router.explain_model_choice(model_selection)
    
    # Отправляем запрос к выбранной модели
    response = await send_to_openrouter(
        model_id=model_selection["model_id"],
        messages=request.messages
    )
    
    return {
        "response": response,
        "model_used": model_selection["model_id"],
        "explanation": explanation,
        "estimated_cost": model_selection["estimated_cost_rub"],
    }
"""
