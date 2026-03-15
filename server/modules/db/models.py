from sqlalchemy import Column, String, Boolean, DateTime , Text, String, Integer ,TIMESTAMP,ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from sqlalchemy.orm import relationship
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

    complaints = relationship("Complaint", back_populates="user")


class Complaint(Base):
    __tablename__ = "complaints"
    __table_args__ = {"schema": "civic"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Link complaint to user
    user_id = Column(UUID(as_uuid=True), ForeignKey("auth1.users.id"))

    # Complaint content
    original_text = Column(Text)
    translated_text = Column(Text)

    # AI outputs
    complaint_draft = Column(Text)
    ai_draft = Column(Text)

    # Classification
    request_type = Column(String)  # complaint or project_request
    category = Column(String)

    # Location info
    location = Column(String)
    pincode = Column(Integer)

    latitude = Column(String)
    longitude = Column(String)

    # Responsible department
    department = Column(String)

    # Tracking status
    status = Column(String, default="Submitted")

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user = relationship("User", back_populates="complaints")
    files = relationship("ComplaintFile", back_populates="complaint")

class ComplaintFile(Base):
    __tablename__ = "complaint_files"
    __table_args__ = {"schema": "civic"}
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    complaint_id = Column(
        UUID(as_uuid=True),
        ForeignKey("civic.complaints.id")
    )

    file_url = Column(Text)

    file_type = Column(String)

    complaint = relationship("Complaint", back_populates="files")