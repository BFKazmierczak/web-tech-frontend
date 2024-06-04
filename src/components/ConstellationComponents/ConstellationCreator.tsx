import { useEffect, useState } from 'react'
import {
  ConstellationObject,
  ConstellationStars,
  StarObject
} from '../../shared/interfaces/interfaces'
import { Button } from '@mui/material'

interface ConstellationCreatorProps {
  starConnections: ConstellationStars
  onConstellationCreate: (constellation: ConstellationObject) => void
}

const ConstellationCreator = ({
  starConnections,
  onConstellationCreate
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
    <div className=" flex flex-col gap-y-5">
      <span className=" italic text-sm text-neutral-500">
        <span>Uwaga:</span> gwiazdy łączą się tylko jednokierunkowo.
      </span>

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

      <Button
        variant="contained"
        onClick={() => onConstellationCreate(constellation)}>
        Zapisz
      </Button>
    </div>
  )
}

export default ConstellationCreator
