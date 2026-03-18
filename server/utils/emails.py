from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False
)

async def send_otp_email(email: str, otp: str):
    message = MessageSchema(
        subject="Verify your CivicArch AI account",
        recipients=[email],
        body=f"Your OTP is {otp}",
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)