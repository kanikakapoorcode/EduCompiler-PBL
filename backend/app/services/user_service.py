from sqlalchemy.orm import Session

from app.models.db_models import User

LOCAL_USER_ID = "local_user"


class UserService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_or_create_local_user(self) -> User:
        user = self.db.get(User, LOCAL_USER_ID)
        if user:
            return user
        user = User(
            id=LOCAL_USER_ID,
            email="user@educompiler.local",
            username="learner",
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
