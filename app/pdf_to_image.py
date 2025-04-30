# app/pdf_to_image.py

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse
from pdf2image import convert_from_bytes
from PIL import Image
import io
import zipfile

router = APIRouter()

@router.post("/convert")
async def convert_pdf(file: UploadFile = File(...), format: str = "png"):
    if format.lower() not in ["png", "jpeg", "jpg"]:
        return {"error": "Unsupported format. Use png or jpeg."}

    # Read PDF file
    pdf_bytes = await file.read()

    # Convert PDF to images with reduced DPI
    images = convert_from_bytes(
        pdf_bytes,
        dpi=200,  # Reduce DPI for smaller files
        thread_count=4  # Use multiple threads for better performance
    )

    if len(images) == 1:
        img_bytes = io.BytesIO()
        # Save with compression
        if format.lower() == "png":
            images[0].save(img_bytes, format=format.upper(), optimize=True)
        else:
            images[0].save(img_bytes, format=format.upper(), quality=85)
        img_bytes.seek(0)
        return StreamingResponse(img_bytes, media_type=f"image/{format}")

    # If there are multiple pages, return ZIP file
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", compression=zipfile.ZIP_DEFLATED) as zip_file:
        for i, image in enumerate(images):
            img_io = io.BytesIO()
            # Save with compression
            if format.lower() == "png":
                image.save(img_io, format=format.upper(), optimize=True)
            else:
                image.save(img_io, format=format.upper(), quality=85)
            img_io.seek(0)
            zip_file.writestr(f"page_{i+1}.{format}", img_io.read())

    zip_buffer.seek(0)
    return StreamingResponse(zip_buffer, media_type="application/zip", headers={
        "Content-Disposition": "attachment; filename=converted_images.zip"
    })
