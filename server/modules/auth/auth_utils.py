from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(user_id):

    payload = {
        "user_id": str(user_id),   # FIX HERE
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token

import random

def generate_otp():
    return str(random.randint(100000, 999999))