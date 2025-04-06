import React from "react"
import type { Protein } from "../../types"

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p>{value || "N/A"}</p>
  </div>
)

const ProteinMetaPanel: React.FC<{ protein: Protein }> = ({ protein }) => (
  <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <MetaItem label="ID" value={protein.id} />
    <MetaItem label="External ID" value={protein.external_id ?? "N/A"} />
    <MetaItem label="Dataset" value={protein.dataset ?? "N/A"} />
    {protein.secondary_ids?.length > 0 && (
      <div className="col-span-2">
        <MetaItem label="Secondary IDs" value={protein.secondary_ids.join(", ")} />
      </div>
    )}
    {protein.ambiguous_secondary_ids?.length > 0 && (
      <div className="col-span-2">
        <MetaItem label="Ambiguous Secondary IDs" value={protein.ambiguous_secondary_ids.join(", ")} />
      </div>
    )}
  </div>
)

export default ProteinMetaPanel
