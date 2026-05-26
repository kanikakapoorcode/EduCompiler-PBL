"""Shared FastAPI dependencies (no authentication)."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.db_models import User
from app.services.user_service import UserService

LOCAL_USER_ID = "local_user"


def get_local_user(db: Annotated[Session, Depends(get_db)]) -> User:
    """Single local profile for saved sessions — no login required."""
    return UserService(db).get_or_create_local_user()
