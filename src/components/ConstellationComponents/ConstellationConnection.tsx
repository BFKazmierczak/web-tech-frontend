import React from 'react'
import { ConstellationConnection } from '../../shared/interfaces/interfaces'

interface ConstellationConnectionProps {
  connection: ConstellationConnection
  onMouseEnter: (
    event: React.MouseEvent,
    connection: ConstellationConnection
  ) => void
  onMouseLeave: (event: React.MouseEvent) => void
}

const ConstellationConnectionDisplay = ({
  connection,
  onMouseEnter,
  onMouseLeave
}: ConstellationConnectionProps) => {
  return (
    <div
      className=" flex justify-between gap-x-1 px-3 select-none font-light
        bg-violet-800 hover:bg-violet-900 rounded-xl
        transition-all ease-in-out"
      onMouseEnter={(event) => onMouseEnter(event, connection)}
      onMouseLeave={(event) => onMouseLeave(event)}>
      <span>{connection.origin.name}</span>
      <span>{'->'}</span>
      <span>{connection.destination?.name}</span>
    </div>
  )
}

export default ConstellationConnectionDisplay
