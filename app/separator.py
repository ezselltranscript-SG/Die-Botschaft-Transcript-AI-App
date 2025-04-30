# app/pdf_separator.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PyPDF2 import PdfReader, PdfWriter
import os
import shutil
import zipfile
from typing import List

router = APIRouter()

# Directorios
UPLOAD_FOLDER = "pdfuploads"
OUTPUT_FOLDER = "pdftemp"
ZIP_FOLDER = "zips"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(ZIP_FOLDER, exist_ok=True)

@router.post("/process")
async def dividir_pdf(file: UploadFile = File(...)):
    """
    Recibe un archivo PDF, lo divide cada 2 páginas y devuelve un ZIP para descargar.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        lector = PdfReader(filepath)
        total_paginas = len(lector.pages)
        nombres_salidas: List[str] = []

        nombre_base = file.filename[:-4]

        for i in range(0, total_paginas, 2):
            escritor = PdfWriter()
            escritor.add_page(lector.pages[i])
            if i + 1 < total_paginas:
                escritor.add_page(lector.pages[i + 1])

            part_num = (i // 2) + 1
            nombre_salida = f"{nombre_base}_Part{part_num}.pdf"
            ruta_salida = os.path.join(OUTPUT_FOLDER, nombre_salida)

            with open(ruta_salida, "wb") as salida_pdf:
                escritor.write(salida_pdf)

            nombres_salidas.append(ruta_salida)

        zip_filename = f"{nombre_base}_dividido.zip"
        zip_path = os.path.join(ZIP_FOLDER, zip_filename)
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for ruta in nombres_salidas:
                zipf.write(ruta, os.path.basename(ruta))

        return FileResponse(path=zip_path, filename=zip_filename, media_type='application/zip')

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el PDF: {str(e)}")
