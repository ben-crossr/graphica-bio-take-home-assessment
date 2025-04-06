export interface Protein {
  id: string
  uuid?: string
  name?: string
  external_id?: string
  protein_sequence?: string
  dataset?: string
  organism?: string
  organism_name?: string
  node_type?: string
  date?: string
  secondary_ids?: string[]
  ambiguous_secondary_ids?: string[]
}

export interface FunctionalAnnotation {
  protein_id: string
  go_term_id: string
  go_term_name?: string
  go_code?: string
  ML_prediction_score?: number
  string_combined_score?: number
  dataset?: string
  date?: string
}

export interface ProteinInteraction {
  source_protein_id: string
  target_protein_id: string
  target_protein_name?: string
  ML_prediction_score?: number
  string_combined_score?: number
  dataset?: string
  date?: string
}

