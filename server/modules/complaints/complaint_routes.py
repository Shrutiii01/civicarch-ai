from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
def submit_complaint(data: ComplaintRequest, db: Session = Depends(get_db)):

    # Run complaint processing (AI classification + draft generation)
    result = create_complaint(
        db,
        user_id=None,
        text=data.text,
        location=data.location,
        pincode=data.pincode,
        category=data.category
    )

    return {
        "message": "Complaint submitted",
        "complaint_id": str(result["complaint_id"]),
        "original_text": data.text,
        "category": result["category"],
        "department": result["department"],
        "draft": result["draft"]
    }