from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database.parquet_db import ParquetDatabase
from app.api import proteins
from app.dependencies import init_db

app = FastAPI(title="Biographica Protein Information API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    db_type = os.environ.get("DATABASE_TYPE", "parquet").lower()
    if db_type == "sql":
        raise NotImplementedError()
    db = ParquetDatabase(
        protein_nodes_path="data/protein_nodes.parquet",
        go_term_nodes_path="data/go_term_nodes.parquet",
        edges_path="data/edges.parquet",
        id_records_path="data/protein_id_records.parquet"
    )
    init_db(db)

app.include_router(proteins.router, prefix="/api/proteins", tags=["proteins"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Protein Information API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
