from pydantic import BaseModel, EmailStr, field_validator
from utils.password_utils import validate_strong_password


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    def validate_password(cls, value):
        return validate_strong_password(value)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

    @field_validator("new_password")
    def validate_password(cls, value):
        return validate_strong_password(value)