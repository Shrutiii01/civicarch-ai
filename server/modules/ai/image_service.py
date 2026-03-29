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

    try:
        # 🔥 FIX: Read the file safely using async methods to prevent 500 crashes
        content = await image.read()
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Encode the saved image to base64
        base64_image = encode_image(file_path)

        prompt = """
        Analyze the provided image. 
        1. If it is a document, extract all readable text as accurately as possible.
        2. If it is a photo of a civic issue (like a pothole, garbage dump, broken street light), write a brief, objective, 2-sentence description of the issue shown.
        Do not add any conversational filler. Output ONLY the extracted text or description.
        """

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
            temperature=0.2, 
        )

        extracted_content = completion.choices[0].message.content.strip()
        
        # Clean up the temp image
        if os.path.exists(file_path):
            os.remove(file_path)

        return {
            "image_type": "groq_vision_processed",
            "extracted_text": extracted_content
        }

    except Exception as e:
        # 🔥 Added a massive print statement so we can see the exact error!
        print("\n" + "="*50)
        print(f"🚨 GROQ VISION ERROR: {str(e)}")
        print("="*50 + "\n")
        
        return {
            "error": str(e),
            "message": "Failed to process image with Groq API."
        }