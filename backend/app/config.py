from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    app_name: str = "Taller Simple API"
    app_env: str = "development"  # development | production | test
    debug: bool = True
    api_prefix: str = "/api/v1"

    # Database — ej: postgresql+psycopg://user:pass@localhost:5432/taller_simple
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/taller_simple"

    # Auth (reservado para feature auth)
    secret_key: str = "change-me-in-env"
    access_token_expire_minutes: int = 60
    algorithm: str = "HS256"


settings = Settings()
