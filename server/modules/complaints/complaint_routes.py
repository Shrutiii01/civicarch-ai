from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from modules.db.database import SessionLocal
from .complaint_service import create_complaint
from modules.ai.image_service import process_image

router = APIRouter(prefix="/complaints")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/submit")
async def submit_complaint(
    text: str = Form(...),
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):

    image_text = None

    # ✅ Step 1: Process image if provided
    if image:
        image_result = await process_image(image)
        image_text = image_result.get("extracted_text")

    # ✅ Step 2: Create complaint
    result = create_complaint(
        db,
        user_id=None,
        text=text,
        location=location,
        pincode=pincode,
        category=category,
        image_text=image_text
    )

    return {
        "message": "Complaint submitted",
        "complaint_id": str(result["complaint_id"]),
        "original_text": text,
        "category": result["category"],
        "department": result["department"],
        "draft": result["draft"]
    }