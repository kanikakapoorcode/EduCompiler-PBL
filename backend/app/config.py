"""Application configuration."""

import os


class Settings:
    app_name: str = "EduCompiler API"
    version: str = "1.0.0"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    host: str = os.getenv("EDU_HOST", "0.0.0.0")
    port: int = int(os.getenv("EDU_PORT", "8000"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./educompiler.db")
    clerk_jwks_url: str = os.getenv("CLERK_JWKS_URL", "")
    clerk_issuer: str = os.getenv("CLERK_ISSUER", "")
    auth_disabled: bool = os.getenv("AUTH_DISABLED", "false").lower() == "true"


settings = Settings()
