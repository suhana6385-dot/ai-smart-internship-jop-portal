# ==============================================================================
# AI Microservice - Production Dockerfile
# ==============================================================================
FROM python:3.12-slim

WORKDIR /app

# System dependencies required by pdfplumber/PyPDF2 (font/image parsing).
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p uploads logs trained_models

EXPOSE 8000

ENV APP_HOST=0.0.0.0 \
    APP_PORT=8000 \
    DEBUG=false \
    PYTHONUNBUFFERED=1

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
