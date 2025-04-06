import React, { useState } from "react"
import { getProteinsByGoTerm, searchProteins } from "../../api/proteinApi"
import type { Protein } from "../../types"
import ProteinSearchResultsTable from "../organisms/ProteinSearchResultsTable"

type SearchMode = "protein" | "goterm"

const ProteinSearch: React.FC = () => {
  const [query, setQuery] = useState("")
  const [proteins, setProteins] = useState<Protein[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<SearchMode>("protein")
  const [minScore, setMinScore] = useState<number>(0.5)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      let results: Protein[]

      if (searchMode === "protein") {
        results = await searchProteins(query)
      } else {
        results = await getProteinsByGoTerm(query, minScore)
      }

      setProteins(results)
    } catch (err) {
      setError(`Error searching for ${searchMode === "protein" ? "proteins" : "GO term"}. Please try again.`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSearchMode = (mode: SearchMode) => {
    setSearchMode(mode)
    setProteins([]) // Clear results when switching modes
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Protein Information Search</h1>

      <div className="flex mb-4 border rounded overflow-hidden">
        <button
          onClick={() => toggleSearchMode("protein")}
          className={`flex-1 py-2 px-4 text-center ${
            searchMode === "protein" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Search by Protein
        </button>
        <button
          onClick={() => toggleSearchMode("goterm")}
          className={`flex-1 py-2 px-4 text-center ${
            searchMode === "goterm" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Search by GO Term
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === "protein"
                  ? "Search for proteins by UUID or accession..."
                  : "Enter exact GO term UUID (e.g., BiologicalProcess::1a2d5350-8576-50e4-89c2-af5c42ac1c39)..."
              }
              className="flex-grow p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {searchMode === "goterm" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Minimum Score: {minScore.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={minScore}
                onChange={(e) => setMinScore(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Higher values will return proteins with stronger associations to the GO term.
              </p>
            </div>
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {proteins.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ProteinSearchResultsTable proteins={proteins} />
          </div>
        </div>
      ) : (
        !loading &&
        query && <div className="text-center py-8 text-gray-500">No proteins found. Try a different search term.</div>
      )}
    </div>
  )
}

export default ProteinSearch
