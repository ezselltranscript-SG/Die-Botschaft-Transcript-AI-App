# Etapa 1: Construcción del frontend
FROM node:18 AS frontend

WORKDIR /app

# Copia los archivos necesarios del frontend (que están en raíz y src/)
COPY package*.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Etapa 2: Backend con FastAPI
FROM python:3.9

RUN useradd -m -u 1000 user
USER user

ENV PATH="/home/user/.local/bin:$PATH"
WORKDIR /app

COPY --chown=user requirements.txt main.py ./
COPY --chown=user app ./app
COPY --from=frontend --chown=user /app/dist ./frontend

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]



