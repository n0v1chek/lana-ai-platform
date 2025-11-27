from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    tokens_used: int
    model_used: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Chat"
    ai_model: str = "google/gemini-2.0-flash-001"

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    ai_model: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    ai_model: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class ConversationListResponse(BaseModel):
    id: int
    title: str
    ai_model: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str = Field(..., min_length=1)
    ai_model: str = "google/gemini-2.0-flash-001"
    file_id: Optional[str] = None  # ID загруженного файла
    file_type: Optional[str] = None  # "image" или "document"

class ChatResponse(BaseModel):
    conversation_id: int
    user_message: MessageResponse
    assistant_message: MessageResponse
    coins_spent: int = 0
    balance_remaining: int = 0
