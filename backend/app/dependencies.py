from app.database.database import Database

_db_instance: Database | None = None

def init_db(db: Database):
    global _db_instance
    _db_instance = db

def get_db() -> Database:
    if _db_instance is None:
        raise RuntimeError("Database not initialized.")
    return _db_instance
