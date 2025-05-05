# Etapa 1: Construcción del frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install && npm run build

# Etapa 2: Backend + frontend como estáticos
FROM python:3.10-slim

# Crear directorio de trabajo
WORKDIR /app

# Copiar backend y requerimientos
COPY app/ ./app
COPY app/requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar frontend build generado en la etapa 1
COPY --from=frontend /app/frontend/build ./frontend_build

# Instalar servidor para archivos estáticos
RUN pip install uvicorn serve

# Exponer el puerto por donde responderá Hugging Face
EXPOSE 7860

# Comando para servir frontend y backend
CMD ["sh", "-c", "serve -s ./frontend_build -l 3000 & uvicorn app.main:app --host 0.0.0.0 --port 7860"]
