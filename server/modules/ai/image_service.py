import shutil
import os
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to encode image for Groq
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

async def process_image(image):
    file_path = f"{UPLOAD_FOLDER}/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Encode the saved image to base64
    base64_image = encode_image(file_path)

    prompt = """
You are an AI assistant for a civic grievance platform.

Analyze the uploaded image carefully:

1. If it is a document or draft (handwritten or typed):
   - Extract ALL text exactly as it appears.

2. If it is an image of a civic issue (e.g., pothole, garbage, water leakage):
   - Describe the issue briefly in simple English (one sentence only).

Return ONLY the text.
Do not add explanations or extra words.
"""

    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.2, # Low temperature for factual descriptions
        )

        extracted_content = completion.choices[0].message.content.strip()

        return {
            "image_type": "groq_vision_processed",
            "extracted_text": extracted_content
        }

    except Exception as e:
        return {
            "error": str(e),
            "message": "Failed to process image with Groq API."
        }