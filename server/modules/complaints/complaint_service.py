from utils.complaint_processor import process_complaint
from modules.db.models import Complaint

from modules.ai.department_service import detect_department
from modules.ai.classification_service import classify_request
from modules.ai.draft_service import generate_complaint_draft
from modules.ai.rti_draft_service import generate_rti_draft
from modules.ai.grievance_service import generate_grievance_draft

# Full updated create_complaint function
def create_complaint(db, user_id, user_name, user_email, text, location, pincode, category, image_text=None, audio_text=None, document_text=None, status="DRAFT"):
    
    # 🔥 Integrate audio and document text into the main text if provided
    base_text = text if text else ""
    
    if audio_text and audio_text.strip():
        if base_text and base_text.strip():
            base_text = f"{base_text}\n[Voice Note Transcription]: {audio_text}"
        else:
            base_text = audio_text
            
    if document_text and document_text.strip():
        base_text = f"{base_text}\n[Context from Uploaded PDF]: {document_text}"

    # Step 1 – process complaint (translation)
    processed = process_complaint(text=base_text)
    
    # Safely get the translated text fallback
    translated_text = processed.get("translated_text")
    if not translated_text or str(translated_text).strip().lower() in ["none", ""]:
        translated_text = base_text

    final_input = translated_text

    if image_text and image_text.strip():
        final_input = f"{translated_text}\nAdditional details from image: {image_text}"    

    # Step 2 – classify request (Now identifies: complaint, information_request, or grievance)
    request_type = classify_request(final_input)

    # Step 3 – detect department
    department = detect_department(final_input)

    # Step 4 – generate draft with user details based on the identified request_type
    if request_type == "complaint":
        draft = generate_complaint_draft(
            final_input,
            department,
            location,
            user_name,
            user_email
        )
    elif request_type == "grievance":
        draft = generate_grievance_draft(
            final_input,
            department,
            location,
            user_name,
            user_email
        )
    else: 
        draft = generate_rti_draft(
            final_input,
            department,
            location,
            user_name,
            user_email
        )
    
    # Step 5 – create database object
    complaint = Complaint(
        user_id=user_id,
        original_text=processed.get("original_text", base_text),
        translated_text=translated_text,
        location=location,
        pincode=pincode,
        category=category,
        department=department,
        request_type=request_type,
        complaint_draft=draft,
        latitude=None,
        longitude=None,
        status=status 
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "complaint_id": str(complaint.id),
        "category": category,
        "department": department,
        "draft": draft,
        "request_type": request_type
    }