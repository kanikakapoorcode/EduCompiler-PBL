"""Initialize database tables. Run: python init_db.py"""

from app.database.connection import init_db

if __name__ == "__main__":
    init_db()
    print("Database tables created.")
