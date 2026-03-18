import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_rti_draft(translated_text, department, location):

    prompt = f"""
You are an AI legal assistant helping citizens file RTI applications under the Right to Information Act, 2005 (India).

Citizen Request:
{translated_text}

Department Concerned:
{department}

Location:
{location}

Generate a structured RTI application in this format:

RTI APPLICATION

To:
The Public Information Officer
{department}

Subject:
Request for information under the RTI Act, 2005.

Respected Sir/Madam,

Write a formal RTI request asking for the required information.

Include sections:

1. Information Requested
• point 1
• point 2
• point 3

2. Purpose of Request

End politely requesting the information under RTI Act 2005.

Applicant Location:
{location}

Return only the formatted RTI application.
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content