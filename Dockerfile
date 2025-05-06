# Etapa 1: Construir el frontend
FROM node:18-alpine as frontend

WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY frontend/package*.json ./

RUN npm install

# Copiar todo el código fuente del frontend
COPY frontend/ .

# Debug: Verifica que App.tsx esté en src
RUN ls -la /app/src

# Construir la aplicación React
RUN npm run build

# Etapa 2: Backend con Python + servir frontend
FROM python:3.10-slim as backend

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar dependencias del backend
COPY backend/requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código backend
COPY backend/ .

# Copiar build del frontend
COPY --from=frontend /app/build ./frontend

# Exponer el puerto del backend
EXPOSE 8000

# Comando para ejecutar la aplicación FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


