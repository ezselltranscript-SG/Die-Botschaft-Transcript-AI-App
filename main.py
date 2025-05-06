from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

from app import spellcheck, pdf_to_image, separator, crop_image

app = FastAPI(title="Die_Botschaft_Transcript_AI_APIs")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos (React)
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Incluir APIs
app.include_router(spellcheck.router, prefix="/spellcheck", tags=["spellcheck"])
app.include_router(pdf_to_image.router, prefix="/pdf-to-image")
app.include_router(separator.router, prefix="/separator")
app.include_router(crop_image.router, prefix="/crop")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Fallback para rutas del frontend (React)
@app.get("/{full_path:path}")
async def serve_react_app(request: Request, full_path: str):
    index_path = os.path.join("frontend", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "index.html not found"}
