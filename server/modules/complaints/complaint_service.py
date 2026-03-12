from utils.complaint_processor import process_complaint
from modules.db.models import Complaint

lat, lon = None,None

def create_complaint(db, user_id, text, location, pincode, category):

    processed = process_complaint(text=text)

    complaint = Complaint(
        user_id=user_id,
        original_text=processed["original_text"],
        translated_text=processed["translated_text"],
        location=location,
        pincode=pincode,
        category=category,
        latitude=lat,
        longitude=lon
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint