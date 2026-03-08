from sqlalchemy.orm import Session
from modules.db.models import User

from .auth_utils import hash_password, verify_password, create_access_token, generate_otp
from utils.emails import send_otp_email

from datetime import datetime, timedelta


# -------------------------
# SIGNUP
# -------------------------
async def signup_user(db: Session, name, email, password):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise Exception("User already exists")

    otp = generate_otp()

    new_user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        otp_code=otp,
        otp_expiry=datetime.utcnow() + timedelta(minutes=10),
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # send OTP email
    await send_otp_email(email, otp)

    return new_user


# -------------------------
# VERIFY OTP
# -------------------------
def verify_otp(db: Session, email: str, otp: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise Exception("User not found")

    if user.otp_code != otp:
        raise Exception("Invalid OTP")

    if user.otp_expiry < datetime.utcnow():
        raise Exception("OTP expired")

    user.is_verified = True
    user.otp_code = None

    db.commit()

    return True


# -------------------------
# LOGIN
# -------------------------
def login_user(db: Session, email, password):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise Exception("Invalid email")

    if not verify_password(password, user.password_hash):
        raise Exception("Invalid password")

    if not user.is_verified:
        raise Exception("Please verify your email first")

    token = create_access_token(user.id)

    return token


# -------------------------
# FORGOT PASSWORD
# -------------------------
async def forgot_password(db: Session, email: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise Exception("User not found")

    otp = generate_otp()

    user.otp_code = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)

    db.commit()

    await send_otp_email(email, otp)

    return True


# -------------------------
# RESET PASSWORD
# -------------------------
def reset_password(db: Session, email: str, otp: str, new_password: str):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise Exception("User not found")

    if user.otp_code != otp:
        raise Exception("Invalid OTP")

    if user.otp_expiry < datetime.utcnow():
        raise Exception("OTP expired")

    user.password_hash = hash_password(new_password)
    user.otp_code = None

    db.commit()

    return True