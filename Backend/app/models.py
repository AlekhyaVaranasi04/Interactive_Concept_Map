from pydantic import BaseModel
from typing import Optional

class MindmapRequest(BaseModel):
    topic: Optional[str] = None
    document_id: Optional[str] = None
    text: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str