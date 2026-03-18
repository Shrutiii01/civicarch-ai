from fastapi import APIRouter, Depends ,UploadFile, File
from typing import List
import os
import uuid
from sqlalchemy.orm import Session
from modules.auth.auth_utils import get_current_user
from modules.db.database import SessionLocal
from .complaint_schema import ComplaintRequest
from .complaint_service import create_complaint


router = APIRouter(prefix="/complaints")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/submit")
def submit_complaint(data: ComplaintRequest,files: List[UploadFile] = File(None), db: Session = Depends(get_db),current_user = Depends(get_current_user)):

    # Run complaint processing (AI classification + draft generation)
    result = create_complaint(
        db,
        user_id=current_user.id,
        text=data.text,
        location=data.location,
        pincode=data.pincode,
        category=data.category
    )
    
    complaint_id = result["complaint_id"]


    upload_dir = "uploads"

    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    if files:
        for file in files:

            file_id = str(uuid.uuid4())
            file_extension = file.filename.split(".")[-1]

            file_path = f"{upload_dir}/{file_id}.{file_extension}"

            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())

            # Save file info in DB
            from modules.db.models import ComplaintFile

            db_file = ComplaintFile(
                complaint_id=complaint_id,
                file_url=file_path,
                file_type=file.content_type
            )

            db.add(db_file)

        db.commit()

    return {
        "message": "Complaint submitted",
        "complaint_id": str(result["complaint_id"]),
        "original_text": data.text,
        "category": result["category"],
        "department": result["department"],
        "draft": result["draft"]
    }