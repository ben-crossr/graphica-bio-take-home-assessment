import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  getProtein,
  getProteinFunctionalAnnotations,
  getProteinInteractions
} from "../../api/proteinApi"
import type { Protein, FunctionalAnnotation, ProteinInteraction } from "../../types"
import ProteinMetaPanel from "../molecules/ProteinMetaPanel"
import ProteinTabs from "../organisms/ProteinTabs"
import ProteinAnnotationsTable from "../organisms/ProteinAnnotationsTable"
import ProteinInteractionsTable from "../organisms/ProteinInteractionsTable"

const ProteinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [protein, setProtein] = useState<Protein | null>(null)
  const [annotations, setAnnotations] = useState<FunctionalAnnotation[]>([])
  const [interactions, setInteractions] = useState<ProteinInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) throw new Error("Protein ID is required")
        setLoading(true)
        const [proteinData, annotationData, interactionData] = await Promise.all([
          getProtein(id),
          getProteinFunctionalAnnotations(id),
          getProteinInteractions(id)
        ])
        setProtein(proteinData)
        setAnnotations(annotationData)
        setInteractions(interactionData)
      } catch (err) {
        setError("Error loading protein data. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-xl text-gray-600">Loading...</div>
  }

  if (error || !protein) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Protein not found"}
        </div>
        <Link to="/" className="text-blue-600 hover:underline">← Back to Search</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Search</Link>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">{protein.name || "Unnamed Protein"}</h1>
          <p className="text-gray-600">
            {protein.organism_name ? `${protein.organism_name} (${protein.organism})` : protein.organism || "Unknown organism"}
          </p>
        </div>

        <ProteinMetaPanel protein={protein} />
      </div>

      <ProteinTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        annotationCount={annotations.length}
        interactionCount={interactions.length}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {activeTab === "overview" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Protein Overview</h2>
            <p className="mb-4">This page displays detailed information about the protein {protein.name || protein.id}.</p>
            <p>Use the tabs above to view the sequence, annotations, and interactions.</p>
          </div>
        )}

        {activeTab === "sequence" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Protein Sequence</h2>
            {protein.protein_sequence ? (
              <>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                  {protein.protein_sequence}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Length: {protein.protein_sequence.length} amino acids
                </div>
              </>
            ) : (
              <p>No sequence data available for this protein.</p>
            )}
          </div>
        )}

        {activeTab === "annotations" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Functional Annotations</h2>
            {annotations.length > 0 ? (
              <ProteinAnnotationsTable annotations={annotations} />
            ) : (
              <p>No annotations available.</p>
            )}
          </div>
        )}

        {activeTab === "interactions" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Protein-Protein Interactions</h2>
            {interactions.length > 0 ? (
              <ProteinInteractionsTable interactions={interactions} />
            ) : (
              <p>No interactions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProteinDetails
