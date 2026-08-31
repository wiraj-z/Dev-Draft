# FastAPI Blog

A blog application with a **FastAPI backend** and a **Next.js frontend**. The backend provides a REST API with JWT authentication, post management, and user profiles. The frontend is a modern React/TypeScript app that consumes the API.

## Tech stack

### Backend (`backend/`)

- Python 3.14+
- FastAPI
- SQLAlchemy 2 async ORM
- SQLite + aiosqlite
- Pydantic + pydantic-settings
- JWT authentication with PyJWT
- Password hashing with pwdlib
- Cloudinary (profile images)
- Jinja2 templates (legacy server-rendered UI)

### Frontend (`frontend/`)

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS


## Project structure

```text
Fastapi-blog/
├── backend/          # FastAPI API + legacy Jinja templates
│   ├── main.py
│   ├── routers/
│   └── src/
└── frontend/         # Next.js frontend
    ├── src/app/
    ├── src/components/
    ├── src/config/
    ├── src/lib/api/
    └── FRONTEND_DOCUMENTATION.md
```

## Quick start

### Backend

```bash
cd backend
uv sync
# Configure .env (SECRET_KEY, DATABASE_URL, Cloudinary, etc.)
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API docs: http://127.0.0.1:8000/docs
- Legacy web UI: http://127.0.0.1:8000/

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

- Frontend: http://localhost:3000

## Authentication

The API uses JWT Bearer tokens. Login with **email** as the username field:

```bash
curl -X POST "http://127.0.0.1:8000/api/users/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice@example.com&password=secret123"
```


## Current status

