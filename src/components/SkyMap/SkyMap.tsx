import React, { useEffect, useRef, useState } from 'react'
import { drawStar } from './functions'
import { StarObject } from '../../shared/interfaces'
import { SkyObject } from '../SkyObject'
import {
  ConstellationHighlight,
  ConstellationObject,
  ConstellationStars
} from '../../shared/interfaces/interfaces'
import { Constellation } from '../ConstellationObject'

interface SkyMapProps {
  className?: string
  stars: StarObject[]
  draftStar?: StarObject
  disableChanges?: boolean
  constellations: ConstellationObject[]
  draftConstellation?: ConstellationObject
  highlightedConstellations: ConstellationHighlight
  onStarSelect: (star: StarObject) => void
  editedStar?: StarObject
  onConstellationUpdate: (
    updatedConstellation: ConstellationObject,
    index: number
  ) => void
  onPositionUpdate: (star: StarObject) => void
}

const SkyMap = ({
  className,
  stars,
  draftStar,
  disableChanges = false,
  constellations,
  draftConstellation,
  highlightedConstellations,
  onStarSelect,
  editedStar = undefined,
  onConstellationUpdate,
  onPositionUpdate
}: SkyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)

  const [skyObjects, setSkyObjects] = useState<StarObject[]>(stars)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (stars.length !== skyObjects.length) {
      setSkyObjects(stars)
    } else {
      skyObjects.forEach((object, index) => {
        const passedObj = stars[index]

        const passedObjString = JSON.stringify(passedObj)
        const currentObjString = JSON.stringify(object)

        if (passedObjString !== currentObjString) {
          setSkyObjects((prev) => {
            const newArr = [...prev]
            newArr[index] = passedObj
            return newArr
          })
        }
      })
    }
  }, [stars])

  function loadObjects(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')

    if (ctx) {
      stars.forEach((star) => drawStar(ctx, star))
    }
  }

  function handleGenericPointer(event: React.PointerEvent<HTMLDivElement>) {
    const boundingRect = event.currentTarget.getBoundingClientRect()
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons > 0) handleGenericPointer(event)
  }

  useEffect(() => {
    if (canvasRef.current) {
      loadObjects(canvasRef.current)
    }
  }, [canvasRef])

  function handlePositionUpdate(star: StarObject, x: number, y: number) {
    const constellationIndex = constellations.findIndex(
      (constellation) => constellation.starConnections[star.id]
    )

    console.log({ constellations })

    if (editedStar?.id === star.id || draftStar?.id === star.id) {
      onPositionUpdate({ ...star, positionX: x, positionY: y })
    }

    console.log({ constellationIndex })

    if (constellationIndex >= 0) {
      const updatedConstellation = {
        ...constellations[constellationIndex]
      } as ConstellationObject

      const updatedStar = { ...star, positionX: x, positionY: y } as StarObject

      Object.entries(updatedConstellation.starConnections).forEach(
        (entry: ConstellationStars) => {
          if (entry[1].origin.id === updatedStar.id)
            entry[1].origin = updatedStar
          if (entry[1].destination?.id === updatedStar.id)
            entry[1].destination = updatedStar
        }
      )

      onConstellationUpdate(updatedConstellation, constellationIndex)
    }
  }

  return (
    <div
      className={` relative w-full h-[70vh] min-h-48 overflow-auto bg-slate-900 ${className}`}
      ref={mapContainer}
      onPointerMove={handlePointerMove}
      onPointerDown={handleGenericPointer}>
      <>
        {skyObjects.map((object) => (
          <SkyObject
            key={object.id}
            editing={editedStar?.id === object.id}
            otherEdited={editedStar && editedStar.id !== object.id}
            parentRef={mapContainer}
            skyObject={object}
            preventChanges={disableChanges}
            onClick={(event) => {
              if (!draftStar) onStarSelect(object)
            }}
            onPositionUpdate={handlePositionUpdate}
          />
        ))}

        {constellations.map((constellation) => (
          <Constellation
            constellation={constellation}
            highlight={highlightedConstellations[constellation.id]}
          />
        ))}

        {draftStar && (
          <SkyObject
            key={draftStar.id}
            editing
            otherEdited={editedStar && editedStar.id !== draftStar.id}
            parentRef={mapContainer}
            skyObject={draftStar}
            onClick={(event) => {}}
            onPositionUpdate={handlePositionUpdate}
          />
        )}

        {draftConstellation && (
          <Constellation
            constellation={draftConstellation}
            highlight={highlightedConstellations[draftConstellation.id]}
          />
        )}
      </>
    </div>
  )
}

export default SkyMap
