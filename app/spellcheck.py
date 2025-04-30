# app/spellcheck.py

from fastapi import APIRouter, Query, Body, HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv
from fuzzywuzzy import fuzz
import os
from pydantic import BaseModel
import logging
from typing import List, Dict, Optional

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar variables del entorno
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase credentials")
    raise ValueError("Missing Supabase credentials")

# Conectar a Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Successfully connected to Supabase")
except Exception as e:
    logger.error(f"Error connecting to Supabase: {str(e)}")
    raise

# Crear el router en lugar de FastAPI()
router = APIRouter()

class SpellCheckRequest(BaseModel):
    text: str
    language: str = "en"

class Correction(BaseModel):
    original: str
    corrected: str
    similarity: int
    source: str

class SpellCheckResponse(BaseModel):
    corrected_text: str
    corrections: List[Correction]
    suggestions: List[str]

def get_all_names_from_table(table_name: str):
    """Obtiene todos los nombres desde una tabla específica de Supabase"""
    try:
        logger.info(f"Fetching data from table: {table_name}")
        response = supabase.table(table_name).select("id, name").execute()
        return response.data
    except Exception as e:
        logger.error(f"Error fetching data from table {table_name}: {str(e)}")
        return []

def find_similar_names(input_name: str, table: str, threshold: int = 80):
    """Busca nombres similares en la tabla usando fuzzy matching"""
    try:
        records = get_all_names_from_table(table)
        results = []

        for record in records:
            similarity = fuzz.ratio(input_name.lower(), record["name"].lower())
            if similarity >= threshold:
                results.append({
                    "name": record["name"],
                    "similarity": similarity,
                    "source": table
                })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:5]
    except Exception as e:
        logger.error(f"Error in find_similar_names for table {table}: {str(e)}")
        return []

@router.post("/check", response_model=SpellCheckResponse)
async def check_spell(request: SpellCheckRequest):
    try:
        logger.info(f"Received spellcheck request for text: {request.text}")

        corrected_text = request.text
        corrections = []
        suggestions = []

        # Dividir el texto en palabras
        words = corrected_text.split()
        final_words = []

        for word in words:
            # Buscar coincidencias en todas las tablas
            town_matches = find_similar_names(word, "towns")
            church_district_matches = find_similar_names(word, "church_districts")
            lastname_matches = find_similar_names(word, "lastnames")

            # Si hay coincidencias, usar la mejor
            if town_matches or church_district_matches or lastname_matches:
                all_matches = town_matches + church_district_matches + lastname_matches
                best_match = max(all_matches, key=lambda x: x["similarity"])
                corrections.append(Correction(
                    original=word,
                    corrected=best_match["name"],
                    similarity=best_match["similarity"],
                    source=best_match["source"]
                ))
                final_words.append(best_match["name"])
            else:
                suggestions.append(f"Word '{word}' might be incorrect")
                final_words.append(word)

        corrected_text = " ".join(final_words)

        result = SpellCheckResponse(
            corrected_text=corrected_text,
            corrections=corrections,
            suggestions=suggestions
        )
        logger.info(f"Spellcheck result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in check_spell: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
