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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite Frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], # Explicitly allow these
    allow_headers=["Content-Type", "Authorization", "Accept"], # Explicitly allow these
    expose_headers=["Content-Disposition"] 
)

app.include_router(auth_router)
app.include_router(complaint_router)

@app.post("/generate-pdf")
async def generate_pdf(
    complaint_id: str, 
    draft_text: str = Body(..., embed=True), 
    db=Depends(get_db)
):
    try:
        # 1. UUID Conversion
        query_id = uuid.UUID(complaint_id)
        
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
        
        p.setFont("Helvetica-Bold", 16)
        p.setFillColorRGB(0.925, 0.356, 0.074)
        p.drawString(margin, height - 60, "CIVIC ARCH AI - OFFICIAL DRAFT")
        p.line(margin, height - 65, width - margin, height - 65)
        
        p.setFillColorRGB(0, 0, 0)
        p.setFont("Helvetica", 11)
        y = height - 100
        
        for paragraph in content.split('\n'):
            lines = simpleSplit(paragraph, "Helvetica", 11, width - (margin * 2))
            for line in lines:
                if y < 60:
                    p.showPage()
                    p.setFont("Helvetica", 11)
                    y = height - 60
                p.drawString(margin, y, line)
                y -= 16
            y -= 10

        p.save()
        buffer.seek(0)

        return StreamingResponse(
            buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=CivicArch_{complaint_id[:8]}.pdf",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
    except Exception as e:
        # This prevents the CORS error by catching the error and returning it properly
        print(f"PDF Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))