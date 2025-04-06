import type { Protein, FunctionalAnnotation, ProteinInteraction } from "../types"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Function to search for proteins
export async function searchProteins(query: string, limit = 10): Promise<Protein[]> {

  try {
    let x = `${API_URL}/proteins/search?query=${encodeURIComponent(query)}&limit=${limit}`
    console.log(x)
    const response = await fetch(`${API_URL}/proteins/search?query=${encodeURIComponent(query)}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching proteins:", error)
    throw error
  }
}

// Function to get a specific protein by ID
export async function getProtein(proteinId: string): Promise<Protein> {
  try {
    const response = await fetch(`${API_URL}/proteins/${encodeURIComponent(proteinId)}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting protein:", error)
    throw error
  }
}

// Function to get functional annotations for a protein
export async function getProteinFunctionalAnnotations(proteinId: string): Promise<FunctionalAnnotation[]> {
  try {
    const response = await fetch(`${API_URL}/proteins/${encodeURIComponent(proteinId)}/functional-annotations`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting functional annotations:", error)
    throw error
  }
}

// Function to get protein-protein interactions
export async function getProteinInteractions(proteinId: string): Promise<ProteinInteraction[]> {
  try {
    const response = await fetch(`${API_URL}/proteins/${encodeURIComponent(proteinId)}/interactions`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting protein interactions:", error)
    throw error
  }
}

// Function to get proteins by GO term
export async function getProteinsByGoTerm(goTermId: string, minScore = 0.0, limit = 10): Promise<Protein[]> {
  try {
    const response = await fetch(
      `${API_URL}/go-terms/${encodeURIComponent(goTermId)}/proteins?min_score=${minScore}&limit=${limit}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting proteins by GO term:", error)
    throw error
  }
}

