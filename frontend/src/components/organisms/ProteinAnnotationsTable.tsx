import React from "react"
import Table, { Column } from "../molecules/Table"
import type { FunctionalAnnotation } from "../../types"
import ScoreCell from "../atoms/ScoreCell"

const columns: Column<FunctionalAnnotation>[] = [
  { header: "GO Term ID", accessor: "go_term_id" },
  { header: "GO Term Name", accessor: "go_term_name" },
  { header: "GO Code", accessor: "go_code" },
  {
    header: "Score",
    accessor: (row) => (
      <ScoreCell mlScore={row.ML_prediction_score} stringScore={row.string_combined_score} />
    )
  }
]

const ProteinAnnotationsTable: React.FC<{
  annotations: FunctionalAnnotation[]
}> = ({ annotations }) => {
  return (
    <Table
      columns={columns}
      data={annotations}
      rowKey={(row, i) => `${row.go_term_id}-${i}`}
    />
  )
}

export default ProteinAnnotationsTable
