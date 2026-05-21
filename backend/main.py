"""
EduCompiler FastAPI entry point.

Structure:
  app/api/routes/     — HTTP endpoints (lexical, syntax, compile)
  app/compiler/       — Compiler phases
    lexical/          — Lexer, tokens, LexicalAnalyzer
    syntax/           — Parser, AST, SyntaxAnalyzer
    errors/           — SyntaxErrorDetector
    pipeline.py       — Full compile orchestration
  app/models/         — Pydantic request/response schemas
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings

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

app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
