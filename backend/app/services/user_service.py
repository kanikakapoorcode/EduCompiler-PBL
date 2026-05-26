from typing import Any

from sqlalchemy.orm import Session

from app.models.db_models import User


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def upsert_from_clerk(self, claims: dict[str, Any]) -> User:
        user_id = str(claims.get("sub", ""))
        email = (
            claims.get("email")
            or claims.get("email_address")
            or f"{user_id}@clerk.local"
        )
        username = (
            claims.get("username")
            or claims.get("preferred_username")
            or email.split("@")[0]
        )

        user = self.db.get(User, user_id)
        if user:
            user.email = email
            user.username = username
        else:
            user = User(id=user_id, email=email, username=username)
            self.db.add(user)

        self.db.commit()
        self.db.refresh(user)
        return user
