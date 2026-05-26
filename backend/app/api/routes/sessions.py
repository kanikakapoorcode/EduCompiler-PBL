from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.models.db_models import User
from app.models.session_schemas import (
    DashboardStatsResponse,
    SaveSessionRequest,
    SessionListResponse,
    SessionResponse,
)
from app.services.session_service import SessionService

router = APIRouter()


def _to_response(row) -> SessionResponse:
    d = SessionService.to_dict(row)
    return SessionResponse(**d)


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def save_session(
    body: SaveSessionRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    """Save a compilation run for the authenticated user."""
    row = SessionService(db).save(
        user,
        source_code=body.source_code,
        tokens=body.tokens,
        errors=body.errors,
        syntax_status=body.syntax_status,
    )
    return _to_response(row)


@router.get("", response_model=SessionListResponse)
def list_sessions(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    limit: int = 50,
):
    rows = SessionService(db).list_for_user(user, limit=limit)
    sessions = [_to_response(r) for r in rows]
    return SessionListResponse(sessions=sessions, count=len(sessions))


@router.get("/stats/dashboard", response_model=DashboardStatsResponse)
def dashboard_stats(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    svc = SessionService(db)
    stats = svc.stats(user)
    recent = [_to_response(r) for r in svc.list_for_user(user, limit=8)]
    return DashboardStatsResponse(**stats, recent_sessions=recent)


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(
    session_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    row = SessionService(db).get_for_user(user, session_id)
    if not row:
        raise HTTPException(status_code=404, detail="Session not found")
    return _to_response(row)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if not SessionService(db).delete_for_user(user, session_id):
        raise HTTPException(status_code=404, detail="Session not found")
