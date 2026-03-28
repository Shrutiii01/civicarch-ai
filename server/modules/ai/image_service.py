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
Role: You are a Senior Legal Consultant specializing in Indian Administrative Law and the Right to Information Act, 2005.

Task: Draft a formal, precise, and legally enforceable RTI Application based on the following details:

Citizen's Query (including user input and image details): {final_input}

Department: {department}

Location/Office: {location}

Drafting Rules:

Specific Period: Ensure the information requested asks for a specific date range (e.g., "From Jan 2023 to present") to avoid rejection on grounds of vagueness.

Documentary Evidence: Use phrases like "Certified copies of," "File Notings," and "Action Taken Reports (ATR)" to get high-quality data.

Statutory Compliance: Mention that the response must be provided within 30 days as per Section 7(1) of the Act.

No Justification: Ensure the "Purpose" section remains concise. Legal Note: Under Section 6(2) of the RTI Act, an applicant is NOT required to give any reason for requesting information, but providing a brief context can sometimes help the PIO locate the file.

Format:

RTI APPLICATION

To:
The Central/State Public Information Officer (CPIO/SPIO)
{department}
{location}

Subject: Application for seeking information under Section 6(1) of the Right to Information Act, 2005.

Respected Sir/Madam,
I, a citizen of India, wish to seek the following information under the provisions of the RTI Act, 2005.

1. Information Requested:
• [Point-wise request based on {final_input}]
• [Request for certified copies of relevant registers/documents]
• [Request for inspection of records if applicable]

2. Context of Request:
[Brief 1-2 sentence background based on {final_input}]

3. Declaration:
I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.

4. Format of Information:
I request you to provide the information in [Printed/Electronic/Certified Copy] format.

Applicant Location: {location}
Date: [Insert Current Date]
Signature: [Your Name]"""

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