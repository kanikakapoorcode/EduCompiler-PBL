"""Quick check: database and HTTP connectivity."""

from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from sqlalchemy import inspect, select

from app.database.connection import SessionLocal, engine, init_db
from app.models.db_models import CompilerSession
from app.services.session_service import SessionService
from app.services.user_service import UserService


def main() -> None:
    print("=== Database ===")
    init_db()
    print(f"  URL: {engine.url}")
    tables = inspect(engine).get_table_names()
    print(f"  Tables: {tables}")

    with SessionLocal() as db:
        user = UserService(db).get_or_create_local_user()
        print(f"  Local user: {user.username} ({user.id})")
        count = len(db.scalars(select(CompilerSession)).all())
        print(f"  Sessions:   {count}")

        row = SessionService(db).save(
            user,
            source_code="int x = 1;",
            tokens=[],
            errors=[],
            syntax_status="success",
        )
        print(f"  Test save:  OK (id={row.id[:8]}...)")

    print("\n=== HTTP ===")
    try:
        import json
        import urllib.request

        with urllib.request.urlopen("http://localhost:8000/health", timeout=3) as r:
            print(f"  GET /health: {r.status} {r.read().decode()[:80]}")

        req = urllib.request.Request(
            "http://localhost:8000/compile",
            data=json.dumps(
                {
                    "source": "int x = 10;",
                    "enable_semantic": True,
                    "enable_symbol_table": True,
                }
            ).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            body = json.loads(r.read().decode())
            tokens = len(body.get("tokens", []))
            print(f"  POST /compile: {r.status} ({tokens} tokens)")

        with urllib.request.urlopen(
            "http://localhost:8000/sessions/stats/dashboard", timeout=3
        ) as r:
            stats = json.loads(r.read().decode())
            print(
                f"  GET /sessions/stats/dashboard: {r.status} "
                f"({stats.get('total_compilations', 0)} saved)"
            )
    except Exception as e:
        print(f"  HTTP: OFFLINE or error ({e})")
        print("  Start: .\\venv\\Scripts\\python.exe main.py")


if __name__ == "__main__":
    main()
