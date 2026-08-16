# FastAPI Blog

A small blog application built with FastAPI, SQLAlchemy, SQLite, JWT authentication, and server-rendered HTML templates. The project includes both a user-facing web UI and a REST API for posts and users.

## Tech stack

- Python 3.14+
- FastAPI
- SQLAlchemy 2 async ORM
- SQLite + aiosqlite
- Pydantic + pydantic-settings
- JWT authentication with PyJWT
- Password hashing with pwdlib
- Jinja2 templates for the frontend pages

## Project structure

- `main.py` — app entry point, startup lifecycle, template routes, and global exception handling
- `database.py` — database engine, session factory, and `Base` model setup
- `models.py` — SQLAlchemy models for `User` and `Post`
- `schemas.py` — Pydantic response/request schemas
- `auth.py` — JWT helpers, password hashing, token verification, and current-user dependency
- `config.py` — environment/config loading from `.env`
- `routers/` — API route modules for users and posts
- `templates/` — Jinja HTML templates
- `static/` — CSS, JS, and profile image defaults
- `media/` — uploaded user media files
- `blog.db` — local SQLite database created automatically at runtime

## Prerequisites

Before you start, make sure you have:

- Python 3.14 or newer installed
- `pip` or `uv` available
- A terminal with access to the project directory

## Environment setup

This project expects a `.env` file in the project root. The app reads it automatically via `pydantic-settings` in `config.py`.

Create a `.env` file:

```bash
SECRET_KEY="replace-this-with-a-long-random-secret"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTS=30
```

Generate a strong secret key if needed:

```bash
python - <<'PY'
import secrets
print(secrets.token_urlsafe(32))
PY
```

### Install dependencies with `uv`

```bash
cd /path/to/Fastapi-blog
uv sync
```

This creates the project environment and installs the dependencies from `pyproject.toml`.

## Run the app

Start the development server with `uv`:

```bash
cd /path/to/Fastapi-blog
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You can also activate the environment explicitly if you prefer:

```bash
cd /path/to/Fastapi-blog
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then open:

- Web UI: http://127.0.0.1:8000/
- API docs: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

The app initializes the database automatically on startup by calling `Base.metadata.create_all()` inside the lifespan hook in `main.py`.

## Authentication

The app uses JWT-based authentication.

### Register a user

```bash
curl -X POST "http://127.0.0.1:8000/api/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "secret123"
  }'
```

### Log in and get a token

```bash
curl -X POST "http://127.0.0.1:8000/api/users/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice@example.com&password=secret123"
```

This endpoint expects the email as the `username` field.

### Use the token

```bash
curl "http://127.0.0.1:8000/api/users/me" \
  -H "Authorization: Bearer <your_access_token>"
```

## Useful development commands

```bash
# Install project dependencies
uv sync

# Run the app in development mode
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Activate the virtual environment manually if needed
source .venv/bin/activate

# Run a Python command inside the project environment
uv run python -c "print('hello from uv')"

# Add a package (if needed later)
uv add <package-name>

# Remove the local SQLite database to reset the app state
rm -f blog.db

# View the API schema in JSON
curl http://127.0.0.1:8000/openapi.json
```

## Database notes

- The database is SQLite.
- The file is `blog.db` in the project root.
- Table creation happens automatically on server startup.
- There are no migrations configured in this repo right now, so local schema changes are usually handled by dropping the DB and recreating it during development.

## Local workflow for contributors

- Keep environment values in `.env` and do not commit secrets.
- Use `main.py` for high-level app wiring and page routes.
- Keep business logic in the router modules and helper modules instead of mixing it into templates.
- Validate new endpoints through the Swagger UI at `/docs` and with `curl` when needed.
- If you add new database models, update the startup creation flow or recreate the database locally for testing.

## Known conventions in this codebase

- API routes are prefixed under `/api/users` and `/api/posts`.
- HTML pages are served at root routes such as `/`, `/login`, `/register`, and `/account`.
- Files under `static/` are exposed at `/static`, and files under `media/` are exposed at `/media`.
- Authenticated requests are protected using the `CurrentUser` dependency defined in `auth.py`.

## Troubleshooting

### `Settings error: secret_key not found`

This usually means the `.env` file is missing or incomplete. Make sure your `.env` contains `SECRET_KEY`.

### Database errors or stale schema

Delete the local SQLite file and restart the server:

```bash
rm -f blog.db
uvicorn main:app --reload
```

### App runs but the frontend looks broken

Check that the static assets are being served correctly and that the template files exist under `templates/` and `static/`.

## Current status

This project is a lightweight blog app for local development and learning. There is no formal test suite in the repository at the moment, so manual verification through the FastAPI docs and browser UI is the main validation path.

## Quick start summary

```bash
cd /path/to/Fastapi-blog
uv sync
cat > .env <<'EOF'
SECRET_KEY="your-super-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTS=30
EOF
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then visit http://127.0.0.1:8000/ and http://127.0.0.1:8000/docs.
