from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from ..core.database import Base

class AIModel(str, enum.Enum):
    CLAUDE_SONNET = "claude-sonnet-4"
    CLAUDE_OPUS = "claude-opus-4"
    GPT4 = "gpt-4-turbo"
    GPT4O = "gpt-4o"
    GEMINI_PRO = "gemini-pro"
    MISTRAL_LARGE = "mistral-large"

class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, default="New Chat")
    ai_model = Column(SQLEnum(AIModel), default=AIModel.CLAUDE_SONNET)
    
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=func.now(), server_default=func.now())
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Conversation {self.id} - {self.title}>"

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(SQLEnum(MessageRole), nullable=False)
    content = Column(Text, nullable=False)
    
    tokens_used = Column(Integer, default=0)
    model_used = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now())
    
    conversation = relationship("Conversation", back_populates="messages")
    
    def __repr__(self):
        return f"<Message {self.id} - {self.role}>"
