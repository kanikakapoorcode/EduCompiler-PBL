"""
EduCompiler FastAPI entry point.
"""

from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.database.connection import init_db
from app.middleware.error_handler import register_exception_handlers

init_db()

app = FastAPI(
    title=settings.app_name,
    description=(
        "Lexical analysis, syntax analysis, parse tree construction, "
        "and intelligent syntax error detection for EduCompiler."
    ),
    version=settings.version,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
