from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth.clerk_verify import is_auth_disabled, verify_clerk_token
from app.database.connection import get_db
from app.models.db_models import User
from app.services.user_service import UserService

security = HTTPBearer(auto_error=False)


async def get_optional_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
    db: Annotated[Session, Depends(get_db)],
) -> User | None:
    token = creds.credentials if creds else None
    if is_auth_disabled() and not token:
        token = "dev"
    if not token:
        return None
    payload = verify_clerk_token(token)
    if not payload or not payload.get("sub"):
        return None
    return UserService(db).upsert_from_clerk(payload)


async def get_current_user(
    user: Annotated[User | None, Depends(get_optional_user)],
) -> User:
    if user is None:
        detail = (
            "Authentication required. Sign in via Clerk and pass a Bearer token."
        )
        if is_auth_disabled():
            detail += " (dev: send Authorization: Bearer dev, or omit header)"
        else:
            detail += " (local dev: set AUTH_DISABLED=true in backend/.env and restart)"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
