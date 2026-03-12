from deep_translator import GoogleTranslator

def translate_to_english(text):

    translated = GoogleTranslator(
        source='auto',
        target='en'
    ).translate(text)

    return translated