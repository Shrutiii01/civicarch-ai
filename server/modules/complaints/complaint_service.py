from utils.complaint_processor import process_complaint
from modules.db.models import Complaint

from modules.ai.department_service import detect_department
from modules.ai.classification_service import classify_request
from modules.ai.draft_service import generate_complaint_draft
from modules.ai.rti_draft_service import generate_rti_draft


def create_complaint(db, user_id, text, location, pincode, category, image_text=None):

    # Step 1 – process complaint (translation already happens here)
    processed = process_complaint(text=text)
    
    # Safely get the translated text. If it's None or empty, fallback to the original text!
    translated_text = processed.get("translated_text")
    if not translated_text or str(translated_text).strip().lower() in ["none", ""]:
        translated_text = text

    final_input = translated_text

    if image_text and image_text.strip():
        final_input = f"{translated_text}\nAdditional details from image: {image_text}"    

    # Step 2 – classify request
    request_type = classify_request(final_input)

    # Step 3 – detect department
    department = detect_department(final_input)

    # Step 4 – generate draft
    if request_type == "complaint":
        draft = generate_complaint_draft(
            final_input,
            department,
            location
        )
    else:
        draft = generate_rti_draft(
            final_input,
            department,
            location
        )

    # Step 5 – create complaint object
    complaint = Complaint(
        user_id=user_id,
        original_text=processed["original_text"],
        translated_text=translated_text,
        location=location,
        pincode=pincode,
        category=category,
        department=department,
        request_type=request_type,
        complaint_draft=draft,
        latitude=None,
        longitude=None
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "complaint_id": complaint.id,
        "category": category,
        "department": department,
        "draft": draft
    }