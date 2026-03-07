# app/models_db.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    sessions = relationship("ChatSession", back_populates="user")
    mindmaps = relationship("Mindmap", back_populates="user")


class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="New Session")
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    mindmaps = relationship("Mindmap", back_populates="session")


class Mindmap(Base):
    __tablename__ = "mindmaps"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    content = Column(Text)  # JSON string
    user_id = Column(Integer, ForeignKey("users.id"))
    chat_session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mindmaps")
    session = relationship("ChatSession", back_populates="mindmaps")