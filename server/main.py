from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.complaints.image_routes import router as image_router
from modules.auth.auth_routes import router as auth_router
from modules.db.database import engine, Base
from modules.db import models
from dotenv import load_dotenv
import os

from modules.complaints.complaint_routes import router as complaint_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(complaint_router)
app.include_router(image_router, prefix="/ai")

load_dotenv() 
Base.metadata.create_all(bind=engine)


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "CivicArch AI Backend Running"}