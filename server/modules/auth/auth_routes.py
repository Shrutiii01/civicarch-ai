from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from modules.db.database import SessionLocal
from .auth_schema import SignupRequest, LoginRequest
from .auth_service import signup_user, login_user

router = APIRouter(prefix="/auth")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):

    user = signup_user(
        db,
        data.name,
        data.email,
        data.password
    )

    return {"message": "User created successfully"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    token = login_user(
        db,
        data.email,
        data.password
    )

    return {"token": token}