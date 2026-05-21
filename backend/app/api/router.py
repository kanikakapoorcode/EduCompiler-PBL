from fastapi import APIRouter

from app.api.routes import compile, health, lexical, syntax

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(lexical.router, prefix="/lexical", tags=["Lexical Analysis"])
api_router.include_router(syntax.router, prefix="/syntax", tags=["Syntax Analysis"])
api_router.include_router(compile.router, tags=["Compile"])
