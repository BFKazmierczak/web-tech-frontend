import { useEffect, useState } from 'react'
import {
  ConstellationObject,
  ConstellationStars,
  StarObject
} from '../../shared/interfaces/interfaces'

interface ConstellationCreatorProps {
  starConnections: ConstellationStars
}

const ConstellationCreator = ({
  starConnections
}: ConstellationCreatorProps) => {
  const [constellation, setConstellation] = useState<ConstellationObject>({
    id: -1,
    name: 'Nowa konstelacja',
    starConnections
  })

  useEffect(() => {
    setConstellation((prev) => ({
      ...prev,
      starConnections
    }))
  }, [starConnections])

  return (
    <div className=" flex flex-col gap-y-1">
      {Object.entries(constellation.starConnections).map(
        (entry: ConstellationStars) => (
          <div className=" flex gap-x-1">
            <span>Z: {entry[1].origin.name}</span>
            <span>Do: {entry[1].destination?.name}</span>
          </div>
        )
      )}
    </div>
  )
}

export default ConstellationCreator
