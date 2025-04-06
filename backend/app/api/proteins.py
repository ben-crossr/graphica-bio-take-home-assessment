from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from app.database.database import Database
from app.models.models import Protein, FunctionalAnnotation, ProteinInteraction
from app.main import get_db

router = APIRouter()

@router.get("/search", response_model=List[Protein])
def search_proteins(
    query: str = Query(..., description="Search query for protein identifiers"),
    limit: int = Query(10, description="Maximum number of results to return"),
    db: Database = Depends(get_db)
):
    try:
        return db.search_proteins(query, limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{protein_id}", response_model=Protein)
def get_protein_details(protein_id: str, db: Database = Depends(get_db)):
    try:
        protein = db.get_protein(protein_id)
        if not protein:
            raise HTTPException(status_code=404, detail="Protein not found")
        return protein
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{protein_id}/functional-annotations", response_model=List[FunctionalAnnotation])
def get_protein_functional_annotations(protein_id: str, db: Database = Depends(get_db)):
    try:
        return db.get_functional_annotations(protein_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{protein_id}/interactions", response_model=List[ProteinInteraction])
def get_protein_interactions(protein_id: str, db: Database = Depends(get_db)):
    try:
        return db.get_protein_interactions(protein_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
