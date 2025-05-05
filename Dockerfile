# Etapa 1: Construir el frontend (React)
FROM node:18 AS frontend
WORKDIR /app
COPY src/package*.json ./src/
COPY src ./src
WORKDIR /app/src
RUN npm install
RUN npm run build

# Etapa 2: Backend + frontend estático
FROM python:3.9-slim

# Crear directorio de trabajo
WORKDIR /app

# Crear usuario no root (opcional pero recomendado)
RUN useradd -m user
USER user

# Copiar archivos de backend
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user main.py .
COPY --chown=user app/ ./app

# Copiar frontend ya compilado
COPY --chown=user --from=frontend /app/src/build ./static

# Exponer el puerto de FastAPI
EXPOSE 8000

# Comando para ejecutar FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


