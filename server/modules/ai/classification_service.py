import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_request(translated_text):
    
    # 🔴 1. DEBUG: This will print what text actually made it to the classifier
    print("\n" + "="*40)
    print(f"DEBUG: Text entering classifier: '{translated_text}'")
    print("="*40 + "\n")

    prompt = f"""
Classify the following text into ONE of these THREE categories:
1. complaint - Reporting a physical civic issue (potholes, garbage, broken lights).
2. information_request - Asking for documents or budget details via RTI.
3. grievance - Reporting a service delay, lack of response from officials, or administrative failure.

Text: {translated_text}
Return ONLY one word: complaint, information_request, or grievance.
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    result = completion.choices[0].message.content.strip().lower()
    
    # 🔴 2. DEBUG: This will print what category the AI ultimately chose
    print(f"DEBUG: Classifier decided this is a: '{result}'\n")

    return result