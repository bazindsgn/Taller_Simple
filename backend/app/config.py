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

    database_url: str

    # Auth (reservado para feature auth)
    secret_key: str
    access_token_expire_minutes: int = 60
    algorithm: str = "HS256"


settings = Settings()
