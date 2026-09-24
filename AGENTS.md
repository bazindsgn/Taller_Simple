# AGENTS.md — Taller Simple

Reglas de trabajo permanentes para cualquier agente que modifique este repositorio.

## Stack

- Frontend: Vite + React + TypeScript + Tailwind + shadcn/Radix (existente en `src/`)
- Backend: Python 3.12+, FastAPI, PostgreSQL, SQLAlchemy 2.x, Alembic, Pydantic v2, pydantic-settings
- Package manager backend: `pyproject.toml` (PEP 517/518) + `uv` o `pip` + `.venv`

## Estructura

```
.
├── frontend/            # Vite + React + TypeScript (ex-`src/` en raíz)
│   ├── src/
│   │   ├── app/
│   │   └── styles/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   └── default_shadcn_theme.css
├── backend/
│   ├── app/
│   │   ├── main.py          # crea FastAPI app, registra routers
│   │   ├── config.py        # Settings (pydantic-settings), expone `settings`
│   │   ├── database.py      # engine, SessionLocal, Base, get_db dependency
│   │   ├── <feature>/       # un directorio por dominio (clients, work_orders, ...)
│   │   │   ├── router.py
│   │   │   ├── schemas.py
│   │   │   ├── model.py
│   │   │   └── service.py
│   │   └── integrations/    # clientes externos (google_calendar, afip, etc.)
│   │       └── <service>/
│   ├── migrations/          # Alembic (alembic.ini en backend/)
│   ├── tests/               # pytest, mirrors app/
│   ├── .env                 # no commitear, valores reales
│   ├── .env.example         # plantilla commiteada
│   ├── alembic.ini
│   └── pyproject.toml
├── pnpm-workspace.yaml  # workspaces: ['frontend']
└── AGENTS.md
```

## Organización por feature/dominio

- Un feature = un agregado de negocio (ej: `clients`, `vehicles`, `work_orders`, `budgets`, `invoices`, `stock`, `calendar`, `auth`).
- Cada feature tiene **exactamente** `router.py`, `schemas.py`, `model.py`, `service.py` solo si los necesita. No crear capas vacías preventivas.
- No crear `app/models/` centralizado. Cada modelo vive en su feature.
- `integrations/` nunca importa routers. Features importan integrations vía service, no al revés.

## Responsabilidades

- **router.py**: HTTP puro. Declara `APIRouter`, endpoints, `Depends`, valida con schemas, llama a `service`. Sin lógica de negocio, sin SQL directo.
- **schemas.py**: Pydantic `BaseModel` de entrada/salida. Contrato de API. No usar como modelo DB. Usar `Decimal` para dinero, `datetime`/`date` con zona explícita, validación en backend (no confiar en frontend).
- **model.py**: SQLAlchemy `DeclarativeBase`, `Mapped`, `mapped_column`, `relationship`. Tablas, FKs, índices, constraints. Un archivo por feature.
- **service.py**: Lógica de negocio. Recibe tipos Python / schemas / sesión DB inyectada. No import `Request`, `Response` ni nada de FastAPI. Testeable aislado.

Regla mental: `router → schema → service → model/database`. Router nunca toca `model` directo si existe `service`.

## Dependency Injection

- Usar `Depends` de FastAPI desde el día 0.
- Inyectar: `Session` DB, `settings`, usuario autenticado, clientes HTTP, integrations.
- Definir `get_db()` en `app/database.py` como generator `yield`. Nunca crear `Session()` global en services.
- Tests reemplazan dependencias con `app.dependency_overrides`.

## Configuración

- Solo `app/config.py` lee `.env` vía `pydantic-settings` (`Settings(BaseSettings)` con `env_file=".env"`).
- Exponer instancia `settings`. Resto del código importa `from app.config import settings`.
- Nunca `os.getenv` disperso ni hardcodear secretos/URLs. `.env.example` documenta todas las vars.

## Base de datos

- SQLAlchemy 2.x estilo tipado: `class Base(DeclarativeBase)`, `Mapped[...]`, `mapped_column(...)`, `relationship(...)`.
- Alembic para **todo** cambio de esquema. No `ALTER TABLE` manual en prod. `alembic revision --autogenerate -m "..."` + `alembic upgrade head`.
- Transacciones: una operación de negocio = una transacción. Usar `session.commit()` / `rollback` en service o dependency, no en router.
- Dinero: `Numeric(precision, scale)` + `Decimal`, nunca `Float`. Fechas: `DateTime(timezone=True)` o `Date`.

## Clean Code

- Claridad > brevedad. Nombres descriptivos, funciones pequeñas, bajo acoplamiento.
- Evitar: funciones > 50 líneas, archivos > 300 líneas, duplicación, nesting > 3, `Any` sin razón, `except Exception: pass`, comentarios obvios, abstracciones prematuras.
- Tipar todo (`mypy`/`pyright` friendly). Usar `Annotated` + `Depends` cuando aporte claridad.

## Cuándo introducir nueva abstracción

No implementar Clean/Hexagonal/CQRS/DDD preventivo. Antes de agregar capa/abstracción explicar:

1. Qué problema resuelve
2. Por qué la estructura actual no alcanza
3. Qué complejidad extra introduce

Si no hay 2 de 3 claros, no abstraer. Si la decisión es relevante y no está aquí, actualizar este `AGENTS.md`.

## Testing

- `pytest` + `httpx`/`TestClient` desde el inicio.
- Services testeables sin HTTP: inyectar sesión fake o DB de test.
- Endpoints: usar `dependency_overrides` para DB y mocks de integrations. Nunca llamar APIs reales en tests.
- Nombrar `tests/test_<feature>*.py` espejando `app/<feature>/`.

## Integraciones externas

- Viven en `app/integrations/<servicio>/` (ej: `app/integrations/arca/`, `app/integrations/google_calendar/`).
- Exponen cliente/funciones puras. No conocen routers.
- Inyectar cliente vía `Depends` para poder mockear en tests.
- ARCA/WSFE debe quedar encapsulado en `app/integrations/arca/` — routers/services solo llaman `arca_client.emitir(...)`. Facilita reemplazo/mock por taller.

## Seguridad (mínimos no negociables)

- Passwords con `bcrypt`/`passlib`, nunca texto plano.
- JWT (access corto + refresh) o sesión; validar expiración y `aud`/`iss` si aplica.
- RBAC por `role` (gerente/admin/tecnico) en dependency `get_current_user`.
- Validar todo input en `schemas.py` (Pydantic). Sanitizar salidas.
- No loguear secretos. No exponer stack traces en prod.

## Convenciones

- Python 3.12+, `ruff` + `black` (o `ruff format`) si se agrega lint.
- Commits en español consistente, sin secretos.
- No reescribir archivos completos para cambios puntuales. No tocar código no relacionado a la tarea.
- Antes de cambio grande: analizar estructura, listar archivos afectados, implementar localizado, correr `pytest`, verificar `AGENTS.md`.

## Forma de trabajar (checklist)

1. Analizar estructura existente y dependencias.
2. Proponer cambio breve + archivos a crear/modificar.
3. Implementar.
4. Ejecutar tests relevantes.
5. Revisar que no se violen estas reglas ni se introduzcan problemas.
