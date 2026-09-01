from typing import Any

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
    database_url: str

    secret_key: SecretStr
    algorithm: str = "HS256"
    access_token_expire_minuts: int = 30
    posts_per_page: int = 10

    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: SecretStr

    max_upload_size_bytes: int = 5 * 1024 * 1024  # 5 MB

    reset_token_expire_minutes: int = 60

    mail_server: str = "localhost"
    mail_port: int = 587
    mail_username: str = ""
    mail_password: SecretStr = SecretStr("")
    mail_from: str = "noreply@example.com"
    
    redis_url: str = "redis://localhost:6379"

    frontend_url: str = "http://localhost:8000"

    allowed_origins: list[str] = ["http://localhost:3000"]
    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [o.strip() for o in v.split(",")]
        if isinstance(v, str):
            import json
            return json.loads(v)
        return v
    



settings = Settings()  # load from the .env file
