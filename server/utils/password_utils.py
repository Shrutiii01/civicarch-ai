import re

def validate_strong_password(password: str):

    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$'

    if not re.match(pattern, password):
        raise ValueError(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special symbol"
        )

    return password