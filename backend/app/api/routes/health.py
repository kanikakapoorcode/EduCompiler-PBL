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
        "phases": ["lexical", "syntax", "compile"],
        "endpoints": {
            "health": "GET /health",
            "lexical": "POST /lexical/analyze",
            "syntax": "POST /syntax/analyze",
            "compile": "POST /compile",
        },
    }
