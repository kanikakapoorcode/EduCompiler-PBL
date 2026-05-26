from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.db_models import User
from app.services.user_service import UserService


async def get_optional_user(
    db: Annotated[Session, Depends(get_db)],
) -> User:
    # Always resolve directly to the permanent local dev user
    payload = {
        "sub": "dev_user_local",
        "email": "dev@educompiler.local",
        "username": "devuser",
    }
    return UserService(db).upsert_from_clerk(payload)


async def get_current_user(
    user: Annotated[User, Depends(get_optional_user)],
) -> User:
    # Return the resolved dev user instantly
    return user
