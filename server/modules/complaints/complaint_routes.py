import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from modules.auth.auth_utils import get_current_user
from modules.db.database import SessionLocal
from modules.db.models import User

# Ensure these imports match your actual folder structure
from .complaint_schema import ComplaintResponse
from .complaint_service import create_complaint
from modules.ai.image_service import process_image 
from modules.ai.audio_service import process_audio # 🔥 NEW: Whisper Audio Service

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


@router.post("/submit")
async def submit_complaint(
    text: str = Form(""), # Made optional default to empty string so audio_text can be used alone
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    audio_text: str = Form(None), # 🔥 Accept audio transcription text
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
        audio_text=audio_text,         # 🔥 Passed to service
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
    text: str = Form(""), # Made optional default to empty string
    location: str = Form(...),
    pincode: str = Form(...),
    category: str = Form(""),
    audio_text: str = Form(None), # 🔥 Accept audio transcription text
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
        audio_text=audio_text,         # 🔥 Passed to service
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

# 🔥 NEW: Audio Processing Route
@router.post("/upload-audio")
async def upload_audio_to_text(audio_file: UploadFile = File(...)):
    try:
        # 1. Save the incoming audio file temporarily
        file_path = f"{UPLOAD_FOLDER}/{audio_file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
            
        # 2. Send it to the Groq Whisper service
        translated_english_text = process_audio(file_path)
        
        # 3. Clean up the file so the server doesn't get clogged with audio
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # 4. Return the translated text to the React frontend
        return {"text": translated_english_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🔥 LOUD ERROR VERSION: Standalone Image Processing Route
@router.post("/process-image")
async def api_process_image(image: UploadFile = File(...)):
    try:
        # Calls the Groq Vision service
        result = await process_image(image)
        
        # If Groq failed, send the EXACT Groq error to the frontend
        if "error" in result:
            raise HTTPException(status_code=500, detail=f"GROQ AI ERROR: {result['error']}")
            
        return result
        
    except Exception as e:
        # Force the terminal to print the full red crash report
        import traceback
        traceback.print_exc()
        
        # Send the EXACT Python error to your browser's Network tab
        raise HTTPException(status_code=500, detail=f"PYTHON ERROR: {str(e)}")