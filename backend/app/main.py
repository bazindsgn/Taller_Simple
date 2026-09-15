from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

# CORS — en dev permite Vite (5173). Ajustar origins en producción vía settings si hace falta.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get(f"{settings.api_prefix}/health", tags=["health"])
def api_health_check() -> dict[str, str]:
    return {"status": "ok"}


# Los routers de cada feature se registran aquí, ej:
# from app.clients.router import router as clients_router
# app.include_router(clients_router, prefix=f"{settings.api_prefix}/clients", tags=["clients"])
