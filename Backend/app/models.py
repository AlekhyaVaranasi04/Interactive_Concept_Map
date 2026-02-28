from pydantic import BaseModel
from typing import Optional

class MindmapRequest(BaseModel):
    topic: str
    document_id: Optional[str] = None