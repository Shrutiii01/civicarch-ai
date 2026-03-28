import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq Client just like your other services
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def process_audio(file_path: str) -> str:
    """
    Takes an audio file, sends it to Groq's Whisper model, 
    and returns the transcribed AND translated English text.
    """
    print(f"\n========================================")
    print(f"DEBUG: Processing Audio File: {file_path}")
    print(f"========================================\n")

    try:
        # Open the file in binary read mode
        with open(file_path, "rb") as file:
            # We use .translations (not .transcriptions) to force English output
            translation = client.audio.translations.create(
                file=(os.path.basename(file_path), file.read()), 
                model="whisper-large-v3",
                response_format="json",
                temperature=0.0 # Low temperature for accurate transcription
            )
        
        extracted_text = translation.text.strip()
        print(f"DEBUG: Whisper Output -> '{extracted_text}'\n")
        
        return extracted_text

    except Exception as e:
        print(f"Audio Processing Error: {str(e)}")
        raise Exception(f"Failed to process audio: {str(e)}")