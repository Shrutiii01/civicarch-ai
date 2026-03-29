import os
import shutil
import uuid # 🔥 NEW IMPORT

# 🔥 Added 'Body' to the FastAPI imports
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from sqlalchemy.orm import Session
from modules.auth.auth_utils import get_current_user
from modules.db.database import SessionLocal
from modules.db.models import User

# Ensure these imports match your actual folder structure
from .complaint_schema import ComplaintResponse
from .complaint_service import create_complaint
from modules.ai.image_service import process_image 
from modules.ai.audio_service import process_audio

from pydantic import BaseModel
from modules.ai.classification_service import classify_request
from utils.complaint_processor import process_complaint

router = APIRouter(prefix="/complaints")

# Ensure uploads directory exists for images and audio files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. Create a quick schema to catch the text from the frontend
class ClassifyPayload(BaseModel):
    text: str

# 2. Expose the classification AI to the Dashboard
@router.post("/classify")
async def api_classify_issue(payload: ClassifyPayload):
    try:
        # We translate it first (just in case they type in Hindi/Marathi)
        processed = process_complaint(text=payload.text)
        translated_text = processed.get("translated_text", payload.text)
        
        # Ask the AI what category this belongs to
        category = classify_request(translated_text)
        
        return {"category": category}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit")
async def submit_complaint(
    text: str = Form(""), 
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    audio_text: str = Form(None), 
    image: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_text = None

    if image:
        image_result = await process_image(image)
        image_text = image_result.get("extracted_text")

    result = create_complaint(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,   
        user_email=current_user.email, 
        text=text,
        location=location,
        pincode=pincode,
        category=category,
        image_text=image_text,
        audio_text=audio_text,         
        status="SUBMITTED"             
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
    text: str = Form(""), 
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    audio_text: str = Form(None), 
    image: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    image_text = None

    if image:
        image_result = await process_image(image)
        image_text = image_result.get("extracted_text")

    result = create_complaint(
        db=db,
        user_id=current_user.id,
        user_name=current_user.name,   
        user_email=current_user.email, 
        text=text,
        location=location,
        pincode=pincode,
        category=category,
        image_text=image_text,
        audio_text=audio_text,         
        status="DRAFT"                 
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

@router.post("/upload-audio")
async def upload_audio_to_text(audio_file: UploadFile = File(...)):
    try:
        file_path = f"{UPLOAD_FOLDER}/{audio_file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
            
        translated_english_text = process_audio(file_path)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return {"text": translated_english_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process-image")
async def api_process_image(image: UploadFile = File(...)):
    try:
        result = await process_image(image)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=f"GROQ AI ERROR: {result['error']}")
            
        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PYTHON ERROR: {str(e)}")


# 🔥 NEW: The route that catches the edited text and saves it to the database!
@router.put("/{complaint_id}/update-draft")
async def update_complaint_draft(
    complaint_id: str,
    draft_text: str = Body(..., embed=True), # Catch the JSON from React
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Validate UUID
        try:
            query_id = uuid.UUID(complaint_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid complaint ID")

        # Find the complaint in the database belonging to this user
        from modules.db.models import Complaint
        complaint = db.query(Complaint).filter(
            Complaint.id == query_id, 
            Complaint.user_id == current_user.id
        ).first()

        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")

        # Update and save the new text
        complaint.complaint_draft = draft_text
        db.commit()

        return {"message": "Draft updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Update Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update database")