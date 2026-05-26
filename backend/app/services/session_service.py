import json
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.db_models import CompilerSession, User


class SessionService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def save(
        self,
        user: User,
        *,
        source_code: str,
        tokens: list[Any],
        errors: list[Any],
        syntax_status: str,
    ) -> CompilerSession:
        row = CompilerSession(
            user_id=user.id,
            source_code=source_code,
            tokens=json.dumps(tokens),
            errors=json.dumps(errors),
            syntax_status=syntax_status,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def list_for_user(self, user: User, limit: int = 50) -> list[CompilerSession]:
        stmt = (
            select(CompilerSession)
            .where(CompilerSession.user_id == user.id)
            .order_by(CompilerSession.created_at.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def get_for_user(self, user: User, session_id: str) -> CompilerSession | None:
        row = self.db.get(CompilerSession, session_id)
        if row and row.user_id == user.id:
            return row
        return None

    def delete_for_user(self, user: User, session_id: str) -> bool:
        row = self.get_for_user(user, session_id)
        if not row:
            return False
        self.db.delete(row)
        self.db.commit()
        return True

    def stats(self, user: User) -> dict[str, Any]:
        total = self.db.scalar(
            select(func.count())
            .select_from(CompilerSession)
            .where(CompilerSession.user_id == user.id)
        ) or 0
        error_count = self.db.scalar(
            select(func.count())
            .select_from(CompilerSession)
            .where(
                CompilerSession.user_id == user.id,
                CompilerSession.syntax_status != "success",
            )
        ) or 0
        return {
            "total_compilations": total,
            "saved_programs": total,
            "error_runs": error_count,
            "success_runs": max(0, total - error_count),
        }

    @staticmethod
    def to_dict(row: CompilerSession) -> dict[str, Any]:
        return {
            "id": row.id,
            "user_id": row.user_id,
            "source_code": row.source_code,
            "tokens": json.loads(row.tokens or "[]"),
            "errors": json.loads(row.errors or "[]"),
            "syntax_status": row.syntax_status,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
