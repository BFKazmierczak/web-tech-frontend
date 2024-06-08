import { useEffect, useState } from 'react'
import {
  ConstellationObject,
  ConstellationStars,
  StarObject
} from '../../shared/interfaces/interfaces'
import { Button, Input } from '../Inputs'

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
    <div className=" flex flex-col w-full p-5 gap-y-5">
      <span className=" italic text-sm text-neutral-500">
        <span>Uwaga:</span> gwiazdy łączą się tylko jednokierunkowo.
      </span>

      {Object.keys(constellation.starConnections).length === 0 && (
        <span className=" text-sm text-neutral-500">
          Kliknij na dowolną gwiazdę, aby rozpocząć łączenie
        </span>
      )}

      <div className=" flex flex-col gap-y-1">
        {Object.entries(constellation.starConnections).map(
          (entry: ConstellationStars) => (
            <div className=" flex gap-x-1">
              <span>
                Z: {`(${entry[1].origin.id})`} {entry[1].origin.name}
              </span>
              <span>
                Do: {`(${entry[1].destination?.id})`}{' '}
                {entry[1].destination?.name}
              </span>
            </div>
          )
        )}
      </div>

      <Input
        type="text"
        value={constellation.name}
        onChange={(event) => {
          setConstellation((prev) => ({ ...prev, name: event.target.value }))
        }}
      />

      <Button onClick={() => onConstellationCreate(constellation)}>
        Zapisz
      </Button>
    </div>
  )
}

export default ConstellationCreator
