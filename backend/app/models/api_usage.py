from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from datetime import datetime

from ..core.database import Base

class APIUsage(Base):
    """Таблица для отслеживания каждого запроса к AI"""
    __tablename__ = "api_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=True)
    
    # Информация о запросе
    ai_model = Column(String, nullable=False)
    provider = Column(String, nullable=False)  # "anthropic" или "openrouter"
    
    # Токены
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    
    # Стоимость (в рублях)
    cost_rub = Column(Float, default=0.0)
    
    # Метаданные
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<APIUsage {self.ai_model} - {self.total_tokens} tokens - {self.cost_rub}₽>"
