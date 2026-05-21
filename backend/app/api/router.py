from fastapi import APIRouter

from app.api.routes import compile, health, lexical, semantic, symbol_table, syntax

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(lexical.router, prefix="/lexical", tags=["Lexical Analysis"])
api_router.include_router(syntax.router, prefix="/syntax", tags=["Syntax Analysis"])
api_router.include_router(semantic.router, prefix="/semantic", tags=["Semantic Analysis"])
api_router.include_router(
    symbol_table.router, prefix="/symbol-table", tags=["Symbol Table"]
)
api_router.include_router(compile.router, tags=["Compile"])
