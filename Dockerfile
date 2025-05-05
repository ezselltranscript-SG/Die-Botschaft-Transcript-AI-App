# Etapa 1: Construir el frontend
FROM node:18 AS frontend
WORKDIR /app
COPY src/ ./src
COPY src/package*.json ./
RUN npm install
RUN npm run build

# Etapa 2: Backend + frontend estático
FROM python:3.9-slim
WORKDIR /app

# Crear usuario no root (opcional)
RUN useradd -m user
USER user

# Copiar el backend
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=user main.py .
COPY --chown=user app/ ./app

# Copiar el frontend construido
COPY --chown=user --from=frontend /app/build ./static

# Exponer el puerto
EXPOSE 8000

# Correr el backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

