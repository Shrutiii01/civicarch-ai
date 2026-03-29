from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ComplaintRequest(BaseModel):
    text: Optional[str] = None
    location: Optional[str] = None
    pincode: Optional[int] = None
    category: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID] = None
    original_text: Optional[str] = None
    translated_text: Optional[str] = None
    complaint_draft: Optional[str] = None
    request_type: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    pincode: Optional[int] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    department: Optional[str] = None
    ai_draft: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        orm_mode = True