import React from "react"
import Table, { Column } from "../molecules/Table"
import { Link } from "react-router-dom"
import type { Protein } from "../../types"

const columns: Column<Protein>[] = [
  {
    header: "Accession Number",
    accessor: (protein) => protein.name || "N/A"
  },
  {
    header: "ID",
    accessor: "id"
  },
  {
    header: "External ID",
    accessor: (protein) => protein.external_id ?? "N/A"
  },
  {
    header: "Organism",
    accessor: (protein) => protein.organism_name || protein.organism || "N/A"
  },
  {
    header: "Actions",
    accessor: (protein) => (
      <Link
        to={`/proteins/${protein.id}`}
        className="text-blue-600 hover:text-blue-900"
      >
        View Protein
      </Link>
    )
  }
]

const ProteinSearchResultsTable: React.FC<{ proteins: Protein[] }> = ({ proteins }) => {
  return (
    <Table
      columns={columns}
      data={proteins}
      rowKey={(protein, index) => `${protein.id}-${index}`}
    />
  )
}

export default ProteinSearchResultsTable
