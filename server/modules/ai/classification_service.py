import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_request(translated_text):

    prompt = f"""
You are an AI system that classifies citizen requests.

Classify the following text into ONE category:

1. complaint – reporting a civic issue that needs fixing.
2. information_request – asking for information about a government project, budget, or policy.

Text:
{translated_text}

Return ONLY one word:
complaint
or
information_request
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return completion.choices[0].message.content.strip().lower()