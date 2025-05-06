# Etapa 1: Construir el frontend
FROM node:18-alpine as frontend

WORKDIR /app

# Copiar archivos de configuración de npm desde la raíz
COPY package*.json ./

# Instalar dependencias del frontend
RUN npm install

# Copiar el resto del frontend
COPY public/ ./public
COPY src/ ./src
COPY tsconfig.json ./


# Asegurar dependencias de TypeScript (por si falta alguna)
RUN npm install --save typescript @types/react @types/react-dom

# Construir el proyecto
RUN npm run build

# Etapa 2: Backend con Python + servir frontend
FROM python:3.10-slim as backend

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código backend
COPY app/ ./app
COPY main.py .

# Copiar frontend compilado (desde la carpeta build de React)
COPY --from=frontend /app/build ./frontend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


