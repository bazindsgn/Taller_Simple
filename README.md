
  # Taller Simple

  This is a code bundle for Taller Simple. The original project is available at https://www.figma.com/design/vFNd7Qb7OLTcCjXEv81Nfm/Taller-Simple.

  ## Estructura

  - `frontend/` — Vite + React + TypeScript (app del taller)
  - `backend/` — FastAPI + PostgreSQL + SQLAlchemy

  ## Frontend

  ```bash
  cd frontend
  pnpm install   # o npm install
  pnpm dev       # http://localhost:5173
  pnpm build
  ```

  ## Backend

  ```bash
  cd backend
  cp .env.example .env
  pip install -e ".[dev]"
  alembic upgrade head
  uvicorn app.main:app --reload --port 8000  # http://localhost:8000/docs
  pytest -q
  ```
  