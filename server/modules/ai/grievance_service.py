import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_grievance_draft(final_input, department, location, user_name, user_email):
    
    current_date = datetime.now().strftime("%B %d, %Y")

    prompt = f"""
Role: You are a Senior Administrative Consultant specializing in Public Grievance Redressal and the Citizen's Charter.

Task: Draft a formal Public Grievance Letter to be submitted to a Departmental Head or a Grievance Portal in the language the user state in the user input based on the following details:

Citizen's Issue (including user input and image details): {final_input}
Department: {department}
Location/Office: {location}
Applicant Name: {user_name}
Applicant Email: {user_email}

Drafting Rules:
1. Tone: Firm, formal, and authoritative, yet respectful.
2. Focus: Emphasize "Failure of Service," "Administrative Delay," or "Lack of Accountability."
3. NO HALLUCINATION: Use ONLY the facts provided in the Citizen's Issue. Do not add specific dates or events not mentioned.
4. Statutory Note: Mention that as per the Citizen's Charter, the department is mandated to provide services within a stipulated time frame.

Format:

FORMAL GRIEVANCE ADVISORY

To:
The Public Grievance Officer / Head of Department,
{department},
{location}.

Subject: Formal Grievance regarding Administrative Failure/Service Delay in [{location}]

Respected Sir/Madam,

I, {user_name}, a resident of {location}, am writing to formally lodge a grievance regarding the following persistent issue:

[Explain the grievance clearly using ONLY the provided facts from {final_input}]

Specific Concerns:
• Administrative Non-Compliance: The department has failed to address this matter despite its public duty.
• Public Hardship: This issue is causing significant inconvenience to the residents of {location}.

Declaration:
I request an immediate acknowledgement of this grievance and a definitive timeline for resolution. I also request that this matter be escalated to the relevant competent authority if not resolved within the period specified in the Citizen’s Charter.

Applicant Details:
Name: {user_name}
Email: {user_email}
Location: {location}
Date: {current_date}

Signature:
(Digitally signed by {user_name})
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content