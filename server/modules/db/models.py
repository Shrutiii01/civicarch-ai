from sqlalchemy import Column, String, Boolean, DateTime , Text, String, Integer ,TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .database import Base


class User(Base):

    __tablename__ = "users"
    __table_args__ = {"schema": "auth1"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String)

    email = Column(String, unique=True, index=True)

    password_hash = Column(String)

    role = Column(String, default="citizen")

    created_at = Column(DateTime, default=datetime.utcnow)

    is_active = Column(Boolean, default=True)

    is_verified = Column(Boolean, default=False)
    otp_code = Column(String, nullable=True)
    otp_expiry = Column(DateTime, nullable=True)



class Complaint(Base):
    __tablename__ = "complaints"
    __table_args__ = {"schema": "civic"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True))

    original_text = Column(Text)
    translated_text = Column(Text)
    complaint_draft = Column(Text)
    request_type = Column(String) 
    category = Column(String)
    location = Column(String)

    pincode = Column(Integer)

    latitude = Column(String)
    longitude = Column(String)

    department = Column(String)

    ai_draft = Column(Text)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)