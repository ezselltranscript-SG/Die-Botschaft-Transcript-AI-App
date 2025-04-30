# app/image_cropper.py

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
import zipfile
import os

router = APIRouter()

@router.post("/process")
async def crop_image(file: UploadFile = File(...)):
    input_path = "image.png"
    header_path = "image_header.png"
    body_path = "image_body.png"
    zip_path = "cropped_images.zip"

    # 1. Guardar imagen recibida
    with open(input_path, "wb") as f:
        f.write(await file.read())

    # 2. Abrir imagen
    img = Image.open(input_path)
    width, height = img.size

    # 3. Recortar secciones
    header_box = (0, int(height * 0.12), width, int(height * 0.30))
    body_box = (0, int(height * 0.31), width, height)

    header = img.crop(header_box)
    body = img.crop(body_box)

    header.save(header_path)
    body.save(body_path)

    # 4. Crear ZIP con los dos recortes
    with zipfile.ZipFile(zip_path, "w") as zipf:
        zipf.write(header_path)
        zipf.write(body_path)

    # 5. Devolver el archivo ZIP
    return FileResponse(zip_path, filename="cropped_images.zip", media_type="application/zip")
