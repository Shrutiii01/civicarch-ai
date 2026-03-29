from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from modules.db.database import SessionLocal

from .auth_schema import SignupRequest, LoginRequest
from .auth_utils import get_current_user
from modules.db.models import User

from .auth_service import (
    signup_user,
    login_user,
    verify_otp,
    forgot_password,
    reset_password
)

router = APIRouter(prefix="/auth")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
async def signup(data: SignupRequest, db: Session = Depends(get_db)):

    await signup_user(
        db,
        data.name,
        data.email,
        data.password
    )

    return {"message": "User created successfully. OTP sent to email."}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    token = login_user(
        db,
        data.email,
        data.password
    )

    return {"token": token}


@router.post("/verify-otp")
def verify_user(email: str, otp: str, db: Session = Depends(get_db)):

    verify_otp(db, email, otp)

    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot(email: str, db: Session = Depends(get_db)):

    await forgot_password(db, email)

    return {"message": "OTP sent"}


@router.post("/reset-password")
def reset(email: str, otp: str, new_password: str, db: Session = Depends(get_db)):

    reset_password(db, email, otp, new_password)

    return {"message": "Password updated successfully"}


@router.get("/me")
def get_user_profile(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "phone": getattr(user, "phone", None),
        "location": getattr(user, "location", None),
        "pincode": getattr(user, "pincode", None),
    }