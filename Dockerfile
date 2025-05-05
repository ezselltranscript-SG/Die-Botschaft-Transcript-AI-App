# Etapa 1: Construcción del frontend (React, Vite, etc.)
FROM node:18 AS frontend

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./  # solo si usas npm y tienes este archivo
COPY src ./src

RUN npm install
RUN npm run build

# Etapa 2: Backend (FastAPI)
FROM python:3.9

# Crear usuario sin privilegios
RUN useradd -m -u 1000 user
USER user

ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /app

# Copiamos backend y frontend ya construido
COPY --chown=user requirements.txt main.py ./  
COPY --chown=user app ./app
COPY --from=frontend --chown=user /app/dist ./frontend  # resultado del build de React/Vite

RUN pip install --no-cache-dir -r requirements.txt

# Ejecutar el backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]



