# Taller Simple — API

## Requisitos

- Python 3.11+ (recomendado 3.12)
- PostgreSQL 15+ (o Supabase)

## Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -e ".[dev]"

cp .env.example .env  # completar database_url y secret_key
```

## Migraciones

```bash
alembic revision --autogenerate -m "descripcion"
alembic upgrade head
```

## Dev

```bash
uvicorn app.main:app --reload --port 8000
# http://localhost:8000/docs
```

## Tests

```bash
pytest -q
```
