# Etapa 1: Build del frontend
FROM node:18 AS frontend

WORKDIR /app

# Copiar todo excepto lo excluido en .dockerignore
COPY . .

# Verificar archivos copiados
RUN ls -la ./src

# Instalar dependencias y construir frontend
RUN npm install
RUN npm run build

# Etapa 2: Backend con FastAPI + servir frontend
FROM python:3.10-slim

WORKDIR /app

# Copiar requerimientos e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar aplicación backend
COPY app ./app
COPY main.py .

# Copiar frontend compilado desde la etapa anterior
COPY --from=frontend /app/build ./frontend

# Instalar dependencias adicionales necesarias
RUN pip install fastapi uvicorn python-multipart aiofiles

EXPOSE 8000

# Ejecutar la app con Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


