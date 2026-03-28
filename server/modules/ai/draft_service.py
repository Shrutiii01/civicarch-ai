import os
from datetime import datetime
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 🔥 Notice the two new arguments added here to match complaint_service.py!
def generate_complaint_draft(final_input, department, location, user_name, user_email):
    
    current_date = datetime.now().strftime("%B %d, %Y")

    prompt = f"""
Role: You are a Senior Legal Consultant specializing in Indian Administrative Law and the Right to Information Act, 2005.

Task: Draft a formal, precise, and legally enforceable RTI Application based on the following details:

Citizen's Query (including user input and image details): {final_input}

Department: {department}

Location/Office: {location}

Drafting Rules:

Specific Period: Ensure the information requested asks for a specific date range (e.g., "From Jan 2023 to present") to avoid rejection on grounds of vagueness.

Applicant Name: {user_name}
Applicant Email: {user_email}

CRITICAL INSTRUCTIONS:
1. Write a formal complaint letter based STRICTLY on the "Complaint Facts" provided above.
2. DO NOT invent, hallucinate, or add any new details (like unauthorized construction, specific events, or building numbers) that are not present in the text. 
3. If the facts are brief (e.g., just mentioning a pothole), keep the letter focused entirely on that specific issue.

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

I, {user_name}, a resident of {location}, write to bring the following issue to your attention:

Write a polite and clear explanation of the issue using ONLY the provided facts.

2. Context of Request:
[Brief 1-2 sentence background based on {final_input}]

End with a request for prompt action.

Applicant Details:
Name: {user_name}
Email: {user_email}
Location: {location}
Date: {current_date}

Signature:
(Digitally signed by {user_name})

Applicant Location: {location}
Date: [Insert Current Date]
Signature: [Your Name]"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content