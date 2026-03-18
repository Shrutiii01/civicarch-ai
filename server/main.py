from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.complaints.image_routes import router as image_router
from modules.auth.auth_routes import router as auth_router
from modules.db.database import engine, Base
from modules.db import models
from dotenv import load_dotenv
import os

# Import the complaint router
from modules.complaints.complaint_routes import router as complaint_router

# 1. Initialize App
app = FastAPI(title="CivicArch AI Backend")

# 2. Configure CORS (Must be defined BEFORE including routers for best practice)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load Environment & Database
load_dotenv() 
Base.metadata.create_all(bind=engine)

# 4. Include Routers
app.include_router(auth_router)
app.include_router(complaint_router)
app.include_router(image_router, prefix="/ai")

# 5. Root Route
@app.get("/")
def home():
    return {"message": "CivicArch AI Backend Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)