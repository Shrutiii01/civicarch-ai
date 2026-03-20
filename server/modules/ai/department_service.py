import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def detect_department(text: str) -> str:
    prompt = f"""
    A citizen in India has submitted the following civic complaint:

    "{text}"

    Identify the single most relevant government department responsible for resolving this issue. 

    Routing Rules:
    - If the text mentions potholes, road damage, or street repairs, you MUST choose "Public Works Department (PWD)" or "Municipal Corporation".
    - If the text mentions land disputes, taxes, or illegal property definitions, choose "Revenue Department".

    Choose ONLY from the following exact department names:
    - Public Works Department (PWD)
    - Municipal Corporation
    - Public Health Engineering Department (PHED)
    - Water Supply and Sewerage Board
    - State Electricity Board / DISCOM
    - Solid Waste Management Department
    - Traffic Police
    - State Pollution Control Board
    - Urban Development Authority
    - Fire and Emergency Services
    - Revenue Department
    - Transport Department
    - Forest Department

    Output ONLY the exact department name from the list above. Do not include any other text, explanation, or punctuation.
    """
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.1, # Added low temperature for more deterministic/consistent categorization
    )

    return completion.choices[0].message.content.strip()