from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    import os

    auth_disabled = os.getenv("AUTH_DISABLED", "false").lower() == "true"
    return {
        "status": "ok",
        "service": settings.app_name,
        "auth_disabled": auth_disabled,
        "sessions_require_clerk": not auth_disabled,
    }


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
            "sessions": "POST/GET /sessions (auth required)",
        },
    }
