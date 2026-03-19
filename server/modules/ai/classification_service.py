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
You are an AI system that classifies citizen requests.

Classify the following text into ONE category:

1. complaint – reporting a physical civic issue (e.g., potholes, water leaks, garbage, damaged infrastructure) that needs fixing or intervention.
2. information_request – asking for documents, data, budget details, or policy information via an RTI.

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

    result = completion.choices[0].message.content.strip().lower()
    
    # 🔴 2. DEBUG: This will print what category the AI ultimately chose
    print(f"DEBUG: Classifier decided this is a: '{result}'\n")

    return result