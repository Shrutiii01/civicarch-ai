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
    Analyze the following text and classify it into EXACTLY ONE of these three categories:
    1. complaint - Physical civic issues (potholes, garbage, broken lights).
    2. information_request - Asking for documents, RTI, or budget details.
    3. grievance - Reporting a service delay, official unresponsiveness, or explicitly using the word "grievance".

    Text: "{translated_text}"

    CRITICAL RULES: 
    - If the user explicitly types the word "grievance", you MUST output grievance.
    - If the user explicitly types "RTI" or "information", you MUST output information_request.
    - Output ONLY the category name. Do not add punctuation, explanations, or quotes.
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0, # 🔥 CRITICAL FIX: Forces strict, deterministic categorization
        )

        result = completion.choices[0].message.content.strip().lower()
        
        # 🔴 2. DEBUG: This will print what category the AI ultimately chose
        print(f"DEBUG: Classifier decided this is a: '{result}'\n")

        return result
        
    except Exception as e:
        print(f"🚨 Classification Error: {str(e)}")
        return "complaint" # Safe fallback just in case the AI API drops