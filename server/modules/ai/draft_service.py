import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_complaint_draft(translated_text, department, location):

    prompt = f"""
You are an AI assistant helping citizens write formal civic complaints in India.

Complaint:
{translated_text}

Department Responsible:
{department}

Location:
{location}

Generate a formal complaint letter in this format:

APPLICATION FOR CIVIC GRIEVANCE REDRESSAL

To:
The Officer,
{department}

Subject:
Short subject summarizing the complaint.

Respected Sir/Madam,

Write a polite and clear explanation of the issue.

Include a section:
Details of the Issue:
• point 1
• point 2
• point 3

End with a request for action.

Citizen Location:
{location}

Return only the formatted letter.
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content