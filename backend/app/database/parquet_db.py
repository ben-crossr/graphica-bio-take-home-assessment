import pandas as pd
from typing import List, Optional
import os

from app.database.database import Database
from app.database.utils import ensure_string, safe_float, safe_date
from app.models.models import Protein, FunctionalAnnotation, ProteinInteraction


class ParquetDatabase(Database):
    def __init__(self, protein_nodes_path: str, go_term_nodes_path: str, edges_path: str, id_records_path: str):
        self.protein_nodes_path = protein_nodes_path
        self.go_term_nodes_path = go_term_nodes_path
        self.edges_path = edges_path
        self.id_records_path = id_records_path

        self._load_data()
        self._build_indices()

    def _load_data(self):
        for path in [self.protein_nodes_path, self.go_term_nodes_path, self.edges_path, self.id_records_path]:
            if not os.path.exists(path):
                raise FileNotFoundError(f"File not found: {path}")

        self.protein_nodes_df = pd.read_parquet(self.protein_nodes_path, engine="pyarrow")
        self.protein_nodes_df['dataset'] = self.protein_nodes_df['dataset'].apply(ensure_string)

        self.go_term_nodes_df = pd.read_parquet(self.go_term_nodes_path, engine="pyarrow")
        self.edges_df = pd.read_parquet(self.edges_path, engine="pyarrow")
        self.id_records_df = pd.read_parquet(self.id_records_path, engine="pyarrow")

    def _build_indices(self):
        self.id_to_protein = {}
        self.external_id_to_protein_id = {}
        self.secondary_id_to_protein_id = {}
        self.ambiguous_id_to_protein_ids = {}

        for _, row in self.protein_nodes_df.iterrows():
            protein_id = row['id']
            data = row.to_dict()
            self.id_to_protein[protein_id] = data
            if pd.notna(row.get('external_id')):
                self.external_id_to_protein_id[row['external_id']] = protein_id

        external_id_map = {
            protein.get("external_id"): pid
            for pid, protein in self.id_to_protein.items()
            if pd.notna(protein.get("external_id"))
        }

        for _, row in self.id_records_df.iterrows():
            uuid = row['uuid']
            ext_id = row.get('external_id')
            protein_id = external_id_map.get(ext_id)

            if protein_id:
                self.id_to_protein[protein_id]['uuid'] = uuid

                sec_ids = row.get('secondary_ids')
                if pd.notna(sec_ids) and isinstance(sec_ids, list):
                    self.id_to_protein[protein_id]['secondary_ids'] = sec_ids
                    for sid in sec_ids:
                        self.secondary_id_to_protein_id[sid] = protein_id

                amb_ids = row.get('ambiguous_secondary_ids')
                if pd.notna(amb_ids) and isinstance(amb_ids, list):
                    self.id_to_protein[protein_id]['ambiguous_secondary_ids'] = amb_ids
                    for aid in amb_ids:
                        self.ambiguous_id_to_protein_ids.setdefault(aid, set()).add(protein_id)

        self.id_to_go_term = {
            row['id']: row.to_dict()
            for _, row in self.go_term_nodes_df.iterrows()
        }

        self.external_id_to_go_term_id = {
            row['external_id']: row['id']
            for _, row in self.go_term_nodes_df.iterrows()
            if pd.notna(row.get('external_id'))
        }

        self.protein_to_annotations = {}
        self.go_term_to_proteins = {}
        self.protein_to_interactions = {}

        for _, edge in self.edges_df.iterrows():
            source_id, target_id = edge['source'], edge['target']
            relationship = edge['relationship']

            if relationship.endswith('FunctionalAnnotation'):
                if source_id not in self.protein_to_annotations:
                    self.protein_to_annotations[source_id] = []
                go_term = self.id_to_go_term.get(target_id)
                if go_term:
                    self.protein_to_annotations[source_id].append(FunctionalAnnotation(
                        protein_id=source_id,
                        go_term_id=target_id,
                        go_term_name=go_term.get('name'),
                        go_code=edge.get('go_code'),
                        ML_prediction_score=safe_float(edge.get('ML_prediction_score')),
                        string_combined_score=safe_float(edge.get('string_combined_score')),
                        dataset=ensure_string(edge.get('dataset')),
                        date=safe_date(edge.get('date'))
                    ))
                    score = safe_float(edge.get('ML_prediction_score')) or safe_float(edge.get('string_combined_score')) or 0.0
                    self.go_term_to_proteins.setdefault(target_id, []).append((source_id, score))

            elif relationship == 'Protein-Protein-ProteinProteinInteraction':
                if source_id not in self.protein_to_interactions:
                    self.protein_to_interactions[source_id] = []
                target_name = self.id_to_protein.get(target_id, {}).get('name')
                interaction = ProteinInteraction(
                    source_protein_id=source_id,
                    target_protein_id=target_id,
                    target_protein_name=target_name,
                    ML_prediction_score=safe_float(edge.get('ML_prediction_score')),
                    string_combined_score=safe_float(edge.get('string_combined_score')),
                    dataset=ensure_string(edge.get('dataset')),
                    date=safe_date(edge.get('date'))
                )
                self.protein_to_interactions[source_id].append(interaction)

    def _resolve_protein_id(self, identifier: str) -> Optional[str]:
        if identifier in self.id_to_protein:
            return identifier
        if identifier in self.external_id_to_protein_id:
            return self.external_id_to_protein_id[identifier]
        if identifier in self.secondary_id_to_protein_id:
            return self.secondary_id_to_protein_id[identifier]
        if identifier in self.ambiguous_id_to_protein_ids:
            return next(iter(self.ambiguous_id_to_protein_ids[identifier]), None)
        return None

    def search_proteins(self, query: str, limit: int = 10) -> List[Protein]:
        query = query.strip().lower()
        results = set()

        for pid, pdata in self.id_to_protein.items():
            if query in pid.lower():
                results.add(pid)
            elif pd.notna(pdata.get('external_id')) and query in pdata['external_id'].lower():
                results.add(pid)
            elif any(query in sid.lower() for sid in pdata.get('secondary_ids', [])):
                results.add(pid)
            elif any(query in aid.lower() for aid in pdata.get('ambiguous_secondary_ids', [])):
                results.add(pid)
            elif pd.notna(pdata.get('name')) and query in pdata['name'].lower():
                results.add(pid)

        proteins = [Protein(**self.id_to_protein[pid]) for pid in results]

        def _relevance(protein):
            q = query
            if protein.id.lower() == q: return 0
            if protein.external_id and protein.external_id.lower() == q: return 1
            if any(q == sid.lower() for sid in protein.secondary_ids or []): return 2
            if protein.name and protein.name.lower() == q: return 3
            return 4

        return sorted(proteins, key=_relevance)[:limit]

    def get_protein(self, protein_id: str) -> Optional[Protein]:
        pid = self._resolve_protein_id(protein_id)
        return Protein(**self.id_to_protein[pid]) if pid else None

    def get_functional_annotations(self, protein_id: str) -> List[FunctionalAnnotation]:
        pid = self._resolve_protein_id(protein_id)
        return self.protein_to_annotations.get(pid, []) if pid else []

    def get_protein_interactions(self, protein_id: str) -> List[ProteinInteraction]:
        pid = self._resolve_protein_id(protein_id)
        return self.protein_to_interactions.get(pid, []) if pid else []

    def get_proteins_by_go_term(self, go_term_id: str, min_score: float = 0.0, limit: int = 10) -> List[Protein]:
        gid = self.external_id_to_go_term_id.get(go_term_id, go_term_id)
        protein_scores = self.go_term_to_proteins.get(gid, [])

        proteins = [
            Protein(**self.id_to_protein[pid])
            for pid, score in protein_scores
            if score >= min_score and pid in self.id_to_protein
        ]

        proteins.sort(key=lambda p: next((score for pid2, score in protein_scores if pid2 == p.id), 0), reverse=True)
        return proteins[:limit]
