from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.database.database import Database
from app.database.parquet_db import ParquetDatabase
from app.api import proteins

app = FastAPI(title="Biographica Protein Information API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_instance: Database | None = None

@app.on_event("startup")
async def startup_db_client():
    global db_instance
    db_type = os.environ.get("DATABASE_TYPE", "parquet").lower()
    if db_type == "sql":
        raise NotImplementedError("SQL backend not yet implemented.")
    db_instance = ParquetDatabase(
        protein_nodes_path="data/protein_nodes.parquet",
        go_term_nodes_path="data/go_term_nodes.parquet",
        edges_path="data/edges.parquet",
        id_records_path="data/protein_id_records.parquet"
    )

@app.on_event("shutdown")
async def shutdown_db_client():
    global db_instance
    if hasattr(db_instance, 'conn') and db_instance.conn:
        db_instance.conn.close()

def get_db() -> Database:
    if db_instance is None:
        raise RuntimeError("Database not initialized.")
    return db_instance

app.include_router(proteins.router, prefix="/api/proteins", tags=["proteins"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Protein Information API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
