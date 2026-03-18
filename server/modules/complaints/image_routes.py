from fastapi import APIRouter, UploadFile, File
from modules.ai.image_service import process_image

router = APIRouter()

@router.post("/process-image")
async def upload_image(image: UploadFile = File(...)):

    result = await process_image(image)

    return result
