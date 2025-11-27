import httpx
import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)

class CurrencyService:
    def __init__(self):
        self._rate: float = 100.0  # Fallback rate (курс продажи)
        self._cbr_rate: float = 97.0  # Курс ЦБ
        self._last_update: Optional[datetime] = None
        self._cache_hours: int = 12  # Update every 12 hours
        self._spread: float = 1.08  # 8% спред (курс продажи выше курса ЦБ)
    
    async def get_usd_rate(self) -> float:
        """Get current USD/RUB sell rate (курс продажи)"""
        now = datetime.now()
        
        # Return cached rate if fresh
        if self._last_update and (now - self._last_update) < timedelta(hours=self._cache_hours):
            return self._rate
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # CBR XML API
                response = await client.get("https://www.cbr-xml-daily.ru/daily_json.js")
                if response.status_code == 200:
                    data = response.json()
                    usd_data = data.get("Valute", {}).get("USD", {})
                    cbr_rate = usd_data.get("Value", self._cbr_rate)
                    self._cbr_rate = float(cbr_rate)
                    # Курс продажи = курс ЦБ + спред 3%
                    self._rate = round(self._cbr_rate * self._spread, 2)
                    self._last_update = now
                    logger.info(f"USD rate updated: CBR={self._cbr_rate}, Sell={self._rate}")
        except Exception as e:
            logger.warning(f"Failed to fetch USD rate: {e}, using cached: {self._rate}")
        
        return self._rate
    
    def get_cached_rate(self) -> float:
        """Get cached rate (sync version for quick access)"""
        return self._rate
    
    def get_cbr_rate(self) -> float:
        """Get CBR official rate"""
        return self._cbr_rate


currency_service = CurrencyService()
