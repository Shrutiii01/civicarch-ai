from modules.db.database import SessionLocal, engine
from modules.db import models
from sqlalchemy import text

# Test database connection and query complaints
try:
    db = SessionLocal()
    print("Database connected successfully")

    # Check if tables exist
    result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'civic'"))
    tables = result.fetchall()
    print("Tables in 'civic' schema:", [t[0] for t in tables])

    # Query complaints
    complaints = db.query(models.Complaint).all()
    print(f"Number of complaints: {len(complaints)}")
    for c in complaints:
        print(f"ID: {c.id}, Draft: {c.complaint_draft[:50] if c.complaint_draft else 'None'}")

    db.close()
except Exception as e:
    print(f"Error: {e}")