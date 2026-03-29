from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io
import uuid
import os
from dotenv import load_dotenv

# Ensure ReportLab is imported at the top level
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

from modules.db.database import engine, Base, get_db
from modules.db import models
from modules.auth.auth_routes import router as auth_router
from modules.complaints.complaint_routes import router as complaint_router

load_dotenv()

app = FastAPI(title="CivicArch AI API")

# --- IMPROVED CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",
    "http://localhost:5174", # 🔥 Added your frontend port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
    expose_headers=["Content-Disposition"] 
)

# --- ROUTER INCLUSION ---
app.include_router(auth_router)
app.include_router(complaint_router)
# Note: We are using Choice B, so all AI routes are handled inside complaint_router!

# 🔥 NEW: Root route so the Landing Page knows the server is online!
@app.get("/")
async def root():
    return {"message": "System Online: AI Core Active"}

@app.post("/generate-pdf")
async def generate_pdf(
    complaint_id: str, 
    draft_text: str = Body(..., embed=True), 
    db=Depends(get_db)
):
    try:
        # 1. UUID Conversion
        try:
            query_id = uuid.UUID(complaint_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid complaint_id format. Must be a UUID.")
        
        # 2. Database Fetch
        complaint = db.query(models.Complaint).filter(models.Complaint.id == query_id).first()
        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")

        # 3. Content Selection
        content = draft_text if draft_text else (complaint.complaint_draft or "No content available.")

        # 4. Generate PDF
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        margin = 70
        
        # --- PDF Header ---
        p.setFont("Helvetica-Bold", 16)
        p.setFillColorRGB(0.925, 0.356, 0.074) # CivicArch Orange
        p.drawString(margin, height - 60, "CIVIC ARCH AI - OFFICIAL DRAFT")
        p.line(margin, height - 65, width - margin, height - 65)
        
        # --- PDF Body ---
        p.setFillColorRGB(0, 0, 0) # Black text
        p.setFont("Helvetica", 11)
        y = height - 100
        
        for paragraph in content.split('\n'):
            # simpleSplit breaks long paragraphs into appropriately sized lines
            lines = simpleSplit(paragraph, "Helvetica", 11, width - (margin * 2))
            for line in lines:
                if y < 60: # Page break logic
                    p.showPage()
                    p.setFont("Helvetica", 11)
                    y = height - 60
                p.drawString(margin, y, line)
                y -= 16 # Line spacing
            y -= 10 # Paragraph spacing

        p.save()
        buffer.seek(0)

        # 5. Return PDF as a StreamingResponse
        return StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=CivicArch_{str(query_id)[:8]}.pdf",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except HTTPException:
        # Re-raise HTTPExceptions so they don't get caught by the general Exception block
        raise
    except Exception as e:
        print(f"PDF Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")