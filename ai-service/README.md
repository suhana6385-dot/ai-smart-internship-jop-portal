# AI-Powered Smart Internship & Job Recommendation Portal — AI Microservice

An independent, production-ready **FastAPI** microservice that powers an AI-driven
internship/job recommendation portal. It communicates with a MERN backend over
plain REST APIs and provides resume parsing, ATS analysis, skill-gap analysis,
job/internship/career/certification recommendations, AI interview question
generation, candidate ranking, and industry trend prediction.

## Tech Stack

- **Framework:** FastAPI + Uvicorn, Pydantic v2
- **ML/Data:** scikit-learn (TF-IDF + cosine similarity), pandas, NumPy, Joblib
- **File Parsing:** PyPDF2, pdfplumber, python-docx
- **Text Matching:** RapidFuzz (fuzzy skill matching)
- **DB (optional):** MongoDB via Motor/PyMongo
- **Logging:** Loguru (console + rotating file sink)
- **Testing:** pytest + FastAPI TestClient

> **Design note on the NLP stack:** the master spec lists Sentence Transformers /
> Transformers / spaCy / NLTK. This build uses a lightweight, fully-offline
> TF-IDF + cosine-similarity + RapidFuzz pipeline by default so the service
> installs and runs instantly with no large model downloads. The heavy stack is
> listed (commented out) in `requirements.txt` and `utils/similarity.py`
> documents exactly where to swap in embeddings if you want semantic search.

## Project Structure

```
ai-service/
├── requirements.txt
├── main.py                    # Entry point (uvicorn runner)
├── app.py                     # FastAPI app factory, CORS, exception handlers
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── api/                       # HTTP routers (thin, one per module)
│   ├── resume.py
│   ├── ats.py
│   ├── skill_gap.py
│   ├── recommendation.py
│   ├── career.py
│   ├── certification.py
│   ├── interview.py
│   ├── ranking.py
│   └── trends.py
├── models/                    # Pydantic request/response schemas
├── services/                  # Business logic (one class per module)
├── utils/                     # Reusable helpers (parsers, matchers, logger…)
├── datasets/                  # Sample CSV datasets
├── trained_models/            # Joblib training/inference scripts
├── uploads/                   # Temp storage for uploaded resumes
└── tests/                     # pytest suite
```

## Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit values as needed
python main.py                  # or: uvicorn app:app --reload
```

The service starts on `http://localhost:8000`. Interactive API docs are at
`http://localhost:8000/docs` (Swagger) and `http://localhost:8000/redoc`.

### Docker

```bash
docker compose up --build
```

### Tests

```bash
pytest -v
```

### Optional: pre-train the TF-IDF vectorizer

```bash
python trained_models/train_tfidf_vectorizer.py
```

## API Overview

All responses follow a standard envelope:

```json
{ "success": true, "message": "...", "data": { ... }, "errors": null }
```

| Module | Method & Path | Purpose |
|---|---|---|
| Resume | `POST /api/resume/parse` | Upload PDF/DOCX → structured resume data |
| ATS | `POST /api/ats/analyze` | Upload resume (+ optional job description) → ATS score breakdown |
| Skill Gap | `POST /api/skill-gap/analyze` | Compare student vs job skills → gap + roadmap |
| Recommendation | `POST /api/recommend/jobs` | Candidate profile → top-N matching jobs |
| Recommendation | `POST /api/recommend/internships` | Candidate profile → top-N matching internships |
| Career | `POST /api/career/recommend` | Skills → ranked career paths |
| Certification | `POST /api/certification/recommend` | Missing skills → matching courses/certs |
| Interview | `POST /api/interview/generate` | Skills/role → technical/HR/coding/MCQ/behavioral Q&A |
| Ranking | `POST /api/ranking/rank` | List of candidates → ranked by composite score |
| Trends | `GET /api/trends` | Top skills, growing domains, top companies, future careers |
| Core | `GET /health` | Health check |

See `/docs` for full request/response schemas and try-it-out consoles.

## Security & Performance Notes

- Uploads are validated for extension, MIME-implied type, and size
  (`MAX_UPLOAD_SIZE_MB`, default 5MB) before any parsing occurs.
- Filenames are sanitized to prevent path traversal.
- CORS origins are configurable via `CORS_ORIGINS` in `.env`.
- All datasets and skill/matching utilities are loaded **once** per process via
  `functools.lru_cache`-backed singleton factories in `services/*.py`, then
  reused across requests — no repeated CSV/model loading per call.
- All I/O-heavy endpoints (`resume`, `ats`) are `async def` so the event loop
  isn't blocked waiting on other concurrent requests' network I/O.

## Extending

- Swap the TF-IDF similarity engine for Sentence Transformers by editing
  `utils/similarity.py::cosine_similarity_matrix` (see the module docstring).
- Persist parsed resumes / rankings to MongoDB by wiring `motor` in a new
  `utils/db.py` (connection string already scaffolded in `utils/config.py`).
- Add real datasets by replacing the CSVs in `datasets/` — column names must
  stay the same for the services to keep working unmodified.
