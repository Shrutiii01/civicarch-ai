from utils.language import detect_language
from utils.translator import translate_to_english
from utils.voice_to_text import convert_voice_to_text
from utils.image_to_text import extract_text_from_image


def process_complaint(text=None, voice=None, image=None):

    if voice:
        text = convert_voice_to_text(voice)

    if image:
        text = extract_text_from_image(image)

    language = detect_language(text)

    translated_text = translate_to_english(text)

    return {
        "original_text": text,
        "language": language,
        "translated_text": translated_text
    }