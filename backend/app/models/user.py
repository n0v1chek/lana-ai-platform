from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, Text
from sqlalchemy.sql import func
from datetime import datetime, date

from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)

    # Баланс в коинах (1 коин = 1 копейка)
    balance = Column(Integer, default=0)

    # Бюджетирование
    budget_period = Column(String(20), default="none")  # none, week, two_weeks, three_weeks, month
    budget_coins = Column(Integer, default=0)  # Бюджет на период
    budget_start_date = Column(DateTime, nullable=True)  # Начало периода
    daily_spent = Column(Integer, default=0)  # Потрачено сегодня
    daily_spent_date = Column(Date, default=date.today)  # Дата обновления daily_spent

    # Источник регистрации (для аналитики)
    registration_source = Column(String(50), nullable=True)  # google, yandex, direct, referral
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True)
    referrer = Column(Text, nullable=True)

    # Подписка (для будущего использования)
    subscription_plan = Column(String, default="NONE")
    subscription_expires = Column(DateTime, nullable=True)

    # Legacy поля (для совместимости)
    tokens_used = Column(Integer, default=0)
    tokens_limit = Column(Integer, default=0)
    preferred_model = Column(String(255), nullable=True)
    premium_tokens_used = Column(Integer, default=0)
    tokens_reset_at = Column(DateTime, default=func.now())

    # Статус
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=func.now(), server_default=func.now())

    def __repr__(self):
        return f"<User {self.username}>"

    @property
    def period_days(self) -> int:
        """Количество дней в периоде"""
        periods = {
            "none": 0,
            "week": 7,
            "two_weeks": 14,
            "three_weeks": 21,
            "month": 30
        }
        return periods.get(self.budget_period, 0)

    @property
    def daily_limit(self) -> int:
        """Дневной лимит коинов"""
        if self.budget_period == "none" or self.period_days == 0:
            return 0  # Без лимита
        return self.budget_coins // self.period_days

    @property
    def daily_remaining(self) -> int:
        """Осталось коинов на сегодня"""
        if self.daily_limit == 0:
            return self.balance  # Без лимита - весь баланс
        return max(0, self.daily_limit - self.daily_spent)

    def can_send_message(self, estimated_coins: int = 1) -> tuple:
        """Проверить, может ли пользователь отправить сообщение"""
        # Проверка баланса
        if self.balance <= 0:
            return False, "Недостаточно коинов. Пожалуйста, пополните баланс.", "no_balance"

        if self.balance < estimated_coins:
            return False, f"Недостаточно коинов. Нужно ~{estimated_coins}, у вас {self.balance}.", "low_balance"

        # Проверка дневного лимита (если включён)
        if self.budget_period != "none" and self.daily_limit > 0:
            if self.daily_spent >= self.daily_limit:
                return False, f"Достигнут дневной лимит ({self.daily_limit} коинов). Попробуйте завтра или измените настройки бюджета.", "daily_limit"

            if self.daily_remaining < estimated_coins:
                return False, f"Недостаточно коинов в дневном лимите. Осталось {self.daily_remaining}, нужно ~{estimated_coins}.", "daily_limit"

        return True, "OK", "ok"

    def has_sufficient_balance(self, coins_needed: int) -> bool:
        """Проверить достаточность баланса"""
        return self.balance >= coins_needed

    @property
    def balance_rub(self) -> float:
        """Баланс в рублях"""
        return self.balance / 100

    @property
    def is_subscription_active(self) -> bool:
        """Проверка активности подписки"""
        if not self.subscription_expires:
            return False
        return self.subscription_expires > datetime.utcnow()

    @property
    def tokens_remaining(self) -> int:
        return self.balance

    def get_default_model(self) -> str:
        """Модель по умолчанию"""
        if self.preferred_model:
            return self.preferred_model
        return "google/gemini-2.0-flash-001"
