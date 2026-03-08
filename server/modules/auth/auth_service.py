from sqlalchemy.orm import Session
from modules.db.models import User

from .auth_utils import hash_password, verify_password, create_access_token


def signup_user(db: Session, name, email, password):

    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise Exception("User already exists")

    new_user = User(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, email, password):

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise Exception("Invalid email")

    if not verify_password(password, user.password_hash):
        raise Exception("Invalid password")

    token = create_access_token(user.id)

    return token