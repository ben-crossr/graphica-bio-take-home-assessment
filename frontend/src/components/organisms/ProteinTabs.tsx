import React from "react"

const tabs = ["overview", "sequence", "annotations", "interactions"]

const ProteinTabs: React.FC<{
  activeTab: string
  setActiveTab: (tab: string) => void
  annotationCount: number
  interactionCount: number
}> = ({ activeTab, setActiveTab, annotationCount, interactionCount }) => (
  <div className="border-b border-gray-200 mb-6">
    <nav className="-mb-px flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 text-sm font-medium border-b-2 capitalize ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab === "annotations"
            ? `Functional Annotations (${annotationCount})`
            : tab === "interactions"
            ? `Interactions (${interactionCount})`
            : tab}
        </button>
      ))}
    </nav>
  </div>
)

export default ProteinTabs
