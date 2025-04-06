import React from "react"

interface ScoreCellProps {
  mlScore?: number | null
  stringScore?: number | null
}

const ScoreCell: React.FC<ScoreCellProps> = ({ mlScore, stringScore }) => {
  const value = mlScore ?? stringScore
  return <span>{value != null ? value : "N/A"}</span>
}

export default ScoreCell
