---
title: AI Internship Job Service
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

<div align="center">

# AI Smart Internship & Job Portal
### AI Microservice

**Intelligent resume analysis, skill-gap assessment, and career recommendations.**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Hugging Face Spaces](https://img.shields.io/badge/Hosted%20on-Hugging%20Face-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/spaces/suhana6385/ai-internship-job-service)

</div>

---

## Overview

The **AI Smart Internship & Job Portal — AI Microservice** is the Python-based intelligence layer of a full-stack campus placement platform. It exposes AI capabilities through REST APIs so the main backend can request resume analysis, ATS scoring, skill-gap assessment, and career-related recommendations.

The service is built with FastAPI and packaged with Docker for deployment on Hugging Face Spaces.

## Core Capabilities

| Module | Purpose |
|---|---|
| Resume Analysis | Extract and analyze relevant resume information |
| ATS Scoring | Evaluate resume relevance against job requirements |
| Skill-Gap Analysis | Identify skills that may need improvement |
| Career Recommendations | Suggest relevant career and certification paths |
| Job Recommendations | Support matching candidates with relevant opportunities |
| Interview Preparation | Provide interview-question functionality |
| Candidate Ranking | Support candidate comparison and ranking |
| Industry Trends | Provide industry-trend functionality |

> Availability of each capability depends on the implemented routes, configured models, and required data files.

## Architecture

```text
┌──────────────────────────────┐
│     React + TypeScript       │
│          Frontend            │
└──────────────┬───────────────┘
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│     Node.js + Express        │
│       Backend API            │
└──────────────┬───────────────┘
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│      FastAPI AI Service      │
│                              │
│  Resume Analysis             │
│  ATS Scoring                 │
│  Skill-Gap Analysis          │
│  Recommendations             │
└──────────────────────────────┘
```

## Technology Stack

- **Language:** Python 3.12
- **API Framework:** FastAPI
- **ASGI Server:** Uvicorn
- **Data Processing:** Pandas, NumPy
- **Machine Learning:** Scikit-learn
- **Containerization:** Docker
- **Deployment Platform:** Hugging Face Spaces

The exact dependencies and versions are defined in `requirements.txt`.

## Repository Structure

```text
ai-internship-job-service/
├── api/                 # API routes and endpoint modules
├── services/            # Service-layer logic
├── tests/               # Automated tests
├── utils/               # Shared utilities
├── uploads/              # Runtime upload directory
├── logs/                 # Runtime logs
├── app.py                # FastAPI application entry point
├── main.py               # Additional application entry point
├── requirements.txt      # Python dependencies
├── Dockerfile             # Container build configuration
├── .env.example           # Environment configuration template
├── .gitignore             # Git exclusions
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Python 3.12
- Git
- pip

### 1. Clone the repository

```bash
git clone https://huggingface.co/spaces/suhana6385/ai-internship-job-service
cd ai-internship-job-service
```

### 2. Create a virtual environment

**Windows PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS**

```bash
python3.12 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a local `.env` file from `.env.example` and configure the values required by the application.

Never commit credentials, private keys, access tokens, or real user data.

### 5. Start the service

```bash
uvicorn app:app --host 0.0.0.0 --port 7860
```

The local API server should listen on port `7860`.

## API Documentation

When the application is running, FastAPI's interactive documentation is typically available at:

- **Swagger UI:** `/docs`
- **ReDoc:** `/redoc`
- **OpenAPI schema:** `/openapi.json`

These routes are available only if they have not been disabled or customized in the application.

## Deployment

The service is configured for Docker-based deployment on Hugging Face Spaces.

Deployment configuration:

- Docker SDK
- Application port: `7860`
- ASGI server: Uvicorn
- Application target: `app:app`

**Deployment URL:**  
https://huggingface.co/spaces/suhana6385/ai-internship-job-service

Check the Space build logs and test the deployed endpoints before connecting the service to the production backend.

## Integration

The main application backend should call the deployed AI service using its configured base URL.

```text
Frontend → Backend API → AI Microservice
                 │
                 └── Database operations
```

Configure the backend's AI-service URL through its environment configuration. Use the actual deployed endpoint and ensure CORS, networking, timeouts, and error handling are configured appropriately.

## Configuration & Security

- Keep secrets in environment variables or hosting-platform secrets.
- Exclude `.env` files and private datasets from version control.
- Validate uploaded files and enforce appropriate size limits.
- Avoid committing resumes or other personally identifiable information.
- Restrict CORS to trusted origins where appropriate.
- Configure production logging without exposing sensitive data.
- Confirm that required model and dataset files are available at runtime.

## Testing

Run the project's automated tests from the repository root:

```bash
pytest
```

Test availability depends on the installed development dependencies and the repository's test configuration.

## Project Status

This repository provides the AI-service component of the AI Smart Internship & Job Portal. Build status, endpoint availability, model loading, and integration with the main backend must be verified in the target deployment environment.

## License

Specify the appropriate project license before distributing this software.

---

<div align="center">

**AI Smart Internship & Job Portal**  
*Building smarter connections between candidates and career opportunities.*

</div>
