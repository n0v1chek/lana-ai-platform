from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.sql import func
from datetime import datetime
import enum

from ..core.database import Base

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    payment_id = Column(String, unique=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="RUB")
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    subscription_plan = Column(String, nullable=False)
    subscription_months = Column(Integer, default=1)
    
    description = Column(String, nullable=True)
    payment_method = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=func.now(), server_default=func.now())
    paid_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Payment {self.payment_id} - {self.amount} {self.currency}>"
