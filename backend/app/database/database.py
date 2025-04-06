from abc import ABC, abstractmethod
from typing import List, Optional

from app.models.models import Protein, FunctionalAnnotation, ProteinInteraction


class Database(ABC):
    """Abstract base class for database implementations."""

    @abstractmethod
    def search_proteins(self, query: str, limit: int = 100) -> List[Protein]:
        """
        Search for proteins by identifier.

        Args:
            query: The search query string
            limit: Maximum number of results to return

        Returns:
            List of matching Protein objects
        """
        pass

    @abstractmethod
    def get_protein(self, protein_id: str) -> Optional[Protein]:
        """
        Get a protein by its ID.

        Args:
            protein_id: The protein ID

        Returns:
            Protein object if found, None otherwise
        """
        pass

    @abstractmethod
    def get_functional_annotations(self, protein_id: str) -> List[FunctionalAnnotation]:
        """
        Get functional annotations for a protein.

        Args:
            protein_id: The protein ID

        Returns:
            List of FunctionalAnnotation objects
        """
        pass

    @abstractmethod
    def get_protein_interactions(self, protein_id: str) -> List[ProteinInteraction]:
        """
        Get protein-protein interactions for a protein.

        Args:
            protein_id: The protein ID

        Returns:
            List of ProteinInteraction objects
        """
        pass

    @abstractmethod
    def get_proteins_by_go_term(self, go_term_id: str, min_score: float = 0.0, limit: int = 100) -> List[Protein]:
        """
        Get proteins associated with a specific GO term.

        Args:
            go_term_id: The GO term ID
            min_score: Minimum score threshold for annotations
            limit: Maximum number of results to return

        Returns:
            List of Protein objects
        """
        pass

