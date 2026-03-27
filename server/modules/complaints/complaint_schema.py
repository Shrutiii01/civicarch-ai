from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ComplaintRequest(BaseModel):
    text: str
    location: str
    pincode: int
    category: str

class ComplaintResponse(BaseModel):
    id: str
    user_id: str
    original_text: str
    translated_text: Optional[str]
    complaint_draft: Optional[str]
    request_type: Optional[str]
    category: Optional[str]
    location: str
    pincode: int
    latitude: Optional[str]
    longitude: Optional[str]
    department: Optional[str]
    ai_draft: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True