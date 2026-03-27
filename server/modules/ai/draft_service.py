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
You are an AI assistant helping citizens write formal civic complaints in India.

Complaint Facts:
"{final_input}"

Department Responsible:
{department}

Location:
{location}

Applicant Name: {user_name}
Applicant Email: {user_email}

CRITICAL INSTRUCTIONS:
1. Write a formal complaint letter based STRICTLY on the "Complaint Facts" provided above.
2. DO NOT invent, hallucinate, or add any new details (like unauthorized construction, specific events, or building numbers) that are not present in the text. 
3. If the facts are brief (e.g., just mentioning a pothole), keep the letter focused entirely on that specific issue.

Generate a formal complaint letter in this format:

APPLICATION FOR CIVIC GRIEVANCE REDRESSAL

To:
The Officer,
{department}

Subject:
Short subject summarizing the exact complaint.

Respected Sir/Madam,

I, {user_name}, a resident of {location}, write to bring the following issue to your attention:

Write a polite and clear explanation of the issue using ONLY the provided facts.

Include a section:
Details of the Issue:
• [Fact 1]
• [Fact 2]

End with a request for prompt action.

Applicant Details:
Name: {user_name}
Email: {user_email}
Location: {location}
Date: {current_date}

Signature:
(Digitally signed by {user_name})

Return only the formatted letter.
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content