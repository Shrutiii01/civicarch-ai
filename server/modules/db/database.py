import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Improved engine for Supabase stability
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Checks connection health before use
    pool_recycle=1800,   # Recycle connections every 30 mins
    connect_args={
        "connect_timeout": 10  # Timeout after 10s if network is down
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()