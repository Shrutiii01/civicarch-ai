from utils.complaint_processor import process_complaint
from modules.db.models import Complaint

from modules.ai.department_service import detect_department
from modules.ai.classification_service import classify_request
from modules.ai.draft_service import generate_complaint_draft
from modules.ai.rti_draft_service import generate_rti_draft


def create_complaint(db, user_id, text, location, pincode, category):

    # Step 1 – process complaint (translation already happens here)
    processed = process_complaint(text=text)

    translated_text = processed["translated_text"]

    # Step 2 – classify request
    request_type = classify_request(translated_text)

    # Step 3 – detect department
    department = detect_department(translated_text)

    # Step 4 – generate draft
    if request_type == "complaint":
        draft = generate_complaint_draft(
            translated_text,
            department,
            location
        )
    else:
        draft = generate_rti_draft(
            translated_text,
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

    return complaint