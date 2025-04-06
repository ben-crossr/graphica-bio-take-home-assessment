import React from "react"
import Table, { Column } from "../molecules/Table"
import type { ProteinInteraction } from "../../types"
import { Link } from "react-router-dom"
import ScoreCell from "../atoms/ScoreCell"

const columns: Column<ProteinInteraction>[] = [
  { header: "Target Name", accessor: "target_protein_name" },
  { header: "Target ID", accessor: "target_protein_id" },
  {
    header: "Score",
    accessor: (row) => (
      <ScoreCell mlScore={row.ML_prediction_score} stringScore={row.string_combined_score} />
    )
  },
  {
    header: "Actions",
    accessor: (row) => (
      <Link
        to={`/proteins/${row.target_protein_id}`}
        className="text-blue-600 hover:text-blue-900"
      >
        View Protein
      </Link>
    )
  }
]

const ProteinInteractionsTable: React.FC<{
  interactions: ProteinInteraction[]
}> = ({ interactions }) => {
  return (
    <Table
      columns={columns}
      data={interactions}
      rowKey={(row, i) => `${row.target_protein_id}-${i}`}
    />
  )
}

export default ProteinInteractionsTable
