from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from modules.auth.auth_utils import get_current_user
from modules.db.database import SessionLocal
from modules.db.models import User

# Ensure these imports match your actual folder structure
from .complaint_schema import ComplaintResponse
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

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_text = None

    # Step 1: Process image if exists
    if image:
        image_result = await process_image(image)
        image_text = image_result.get("extracted_text")

    # Step 2: Save complaint as SUBMITTED with user details
    result = create_complaint(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,   # Passed to AI
        user_email=current_user.email, # Passed to AI
        text=text,
        location=location,
        pincode=pincode,
        category=category,
        image_text=image_text,
        status="SUBMITTED"             # Final status
    )

    return {
        "message": "Complaint submitted successfully",
        "complaint_id": str(result["complaint_id"]),
        "category": result["category"],
        "department": result["department"],
        "draft_text": result.get("draft")
    }

@router.post("/draft")
async def save_draft(
    text: str = Form(...),
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    image: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_text = None

    # Step 1: Process image if exists
    if image:
        image_result = await process_image(image)
        image_text = image_result.get("extracted_text")

    # Step 2: Save complaint as DRAFT with user details
    result = create_complaint(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,   # Passed to AI
        user_email=current_user.email, # Passed to AI
        text=text,
        location=location,
        pincode=pincode,
        category=category,
        image_text=image_text,
        status="DRAFT"                 # Draft status
    )

    return {
        "message": "Draft saved successfully",
        "complaint_id": str(result["complaint_id"]),
        "draft_text": result.get("draft")
    }

@router.get("/history")
def get_complaint_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    from modules.db.models import Complaint

    submitted = db.query(Complaint).filter(
        Complaint.user_id == current_user.id,
        Complaint.status == "SUBMITTED"
    ).all()

    drafts = db.query(Complaint).filter(
        Complaint.user_id == current_user.id,
        Complaint.status == "DRAFT"
    ).all()

    return {
        "submitted_complaints": [ComplaintResponse.from_orm(c) for c in submitted],
        "draft_complaints": [ComplaintResponse.from_orm(c) for c in drafts]
    }