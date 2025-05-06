from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import spellcheck, pdf_to_image, separator, crop_image
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="Die_Botschaft_Transcript_AI_APIs")

# Configuración CORS
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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")




# Incluir rutas
app.include_router(spellcheck.router, prefix="/spellcheck", tags=["spellcheck"])
app.include_router(pdf_to_image.router, prefix="/pdf-to-image")
app.include_router(separator.router, prefix="/separator")
app.include_router(crop_image.router, prefix="/crop")

# Health Check
@app.get("/health")
async def health_check():
    return {"status": "ok"}
