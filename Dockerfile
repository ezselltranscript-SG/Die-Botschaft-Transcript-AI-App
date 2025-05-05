# Etapa 1: Build del frontend
FROM node:18 AS frontend

WORKDIR /app
COPY package.json ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

# Etapa 2: Backend con FastAPI + servir frontend
FROM python:3.10-slim

WORKDIR /app

# Copiar requerimientos y frontend compilado
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY main.py .
COPY --from=frontend /app/build ./frontend

# Servir todo con Uvicorn + permitir servir frontend
RUN pip install fastapi uvicorn python-multipart aiofiles

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

