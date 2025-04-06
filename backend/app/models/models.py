from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Protein(BaseModel):
    id: str
    uuid: Optional[str] = None  # From protein_id_records
    name: Optional[str] = None
    external_id: Optional[str] = None
    protein_sequence: Optional[str] = None
    dataset: Optional[str] = None
    organism: Optional[str] = None
    organism_name: Optional[str] = None
    node_type: Optional[str] = None
    date: Optional[datetime] = None
    secondary_ids: Optional[List[str]] = None
    ambiguous_secondary_ids: Optional[List[str]] = None


class FunctionalAnnotation(BaseModel):
    protein_id: str
    go_term_id: str
    go_term_name: Optional[str] = None
    go_code: Optional[str] = None
    ML_prediction_score: Optional[float] = None
    string_combined_score: Optional[float] = None
    dataset: Optional[str] = None
    date: Optional[datetime] = None

class ProteinInteraction(BaseModel):
    source_protein_id: str
    target_protein_id: str
    target_protein_name: Optional[str] = None
    ML_prediction_score: Optional[float] = None
    string_combined_score: Optional[float] = None
    dataset: Optional[str] = None
    date: Optional[datetime] = None

