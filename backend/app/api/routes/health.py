from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "service": settings.app_name}


@router.get("/")
def api_info():
    return {
        "name": settings.app_name,
        "version": settings.version,
        "phases": ["lexical", "syntax", "semantic", "symbol_table", "compile", "sessions"],
        "endpoints": {
            "health": "GET /health",
            "lexical": "POST /lexical/analyze",
            "syntax": "POST /syntax/analyze",
            "semantic": "POST /semantic/analyze",
            "symbol_table": "POST /symbol-table/build",
            "compile": "POST /compile",
            "sessions": "POST/GET /sessions",
        },
    }
