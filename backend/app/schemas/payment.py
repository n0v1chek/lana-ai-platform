from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PaymentCreate(BaseModel):
    subscription_plan: str = Field(..., pattern="^(basic|pro|unlimited)$")
    subscription_months: int = Field(default=1, ge=1, le=12)
    
class PaymentResponse(BaseModel):
    id: int
    user_id: int
    payment_id: str
    amount: float
    currency: str
    status: str
    subscription_plan: str
    subscription_months: int
    description: Optional[str] = None
    created_at: datetime
    paid_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PaymentConfirmation(BaseModel):
    payment_id: str
    status: str
    amount: float
    
class SubscriptionInfo(BaseModel):
    plan: str
    expires: Optional[datetime] = None
    is_active: bool
    tokens_used: int
    tokens_limit: int
    can_send_message: bool
