import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Фиксированный внутренний курс компании для пополнения в доллары
# Это реальный курс через карту пополнения
COMPANY_USD_RATE = 140.0

class CurrencyService:
    def __init__(self):
        # Фиксированный курс 140₽/$ - внутренний курс компании для пополнения
        self._rate: float = COMPANY_USD_RATE
        self._cbr_rate: float = COMPANY_USD_RATE  # Для совместимости
        self._last_update: Optional[datetime] = datetime.now()

    async def get_usd_rate(self) -> float:
        """Get USD/RUB rate (фиксированный внутренний курс компании 140₽/$)"""
        return self._rate

    def get_cached_rate(self) -> float:
        """Get cached rate (sync version for quick access)"""
        return self._rate

    def get_cbr_rate(self) -> float:
        """Get rate (для совместимости)"""
        return self._cbr_rate

    def set_rate(self, rate: float):
        """Установить курс вручную через админку"""
        self._rate = rate
        self._cbr_rate = rate
        self._last_update = datetime.now()
        logger.info(f"USD rate manually set to: {rate}")


currency_service = CurrencyService()
