from pydantic import BaseModel
from typing import Optional

class MindmapRequest(BaseModel):
    topic: Optional[str] = None
    text: Optional[str] = None
    document_id: Optional[str] = None
    session_id: Optional[int] = None

class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str