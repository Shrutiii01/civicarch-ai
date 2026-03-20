import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_rti_draft(final_input, department, location):

    prompt = f"""
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

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content