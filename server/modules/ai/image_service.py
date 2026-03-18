import shutil
import os
from modules.ai.ocr_service import extract_text

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

async def process_image(image):

    file_path = f"{UPLOAD_FOLDER}/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    text = extract_text(file_path)

    if text.strip() != "":
        return {
            "image_type": "document",
            "extracted_text": text
        }

    else:
        return {
            "image_type": "issue_photo",
            "message": "No text detected. Possible issue photo."
        }