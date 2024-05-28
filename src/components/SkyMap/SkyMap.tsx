import React, {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'
import { drawStar, moveObject } from './functions'
import { StarObject } from '../../shared/interfaces'
import { SkyObject } from '../SkyObject'
import {
  ConstellationHighlight,
  ConstellationObject,
  ConstellationStars
} from '../../shared/interfaces/interfaces'
import { Constellation } from '../ConstellationObject'

interface YPixel {
  [y: number]: StarObject | StarObject[]
}

interface StarMap {
  [x: number]: YPixel
}

function getPixelsInCircle(x0: number, y0: number, radius: number) {
  let pixels: [number, number][] = []

  // Iterate through each pixel in a bounding box that encloses the circle
  for (let x = x0 - radius; x <= x0 + radius; x++) {
    for (let y = y0 - radius; y <= y0 + radius; y++) {
      // Calculate the distance between the current pixel and the circle's center
      let distance = Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0, 2))
      // If the distance is less than or equal to the radius, the pixel is inside the circle
      if (distance <= radius) {
        pixels.push([x, y])
      }
    }
  }

  return pixels
}

function insertStar(
  mapRef: MutableRefObject<StarMap | null>,
  pixel: [number, number],
  star: StarObject
) {
  if (!mapRef.current) mapRef.current = {}

  if (mapRef.current[pixel[0]] === undefined) {
    mapRef.current[pixel[0]] = {}
    mapRef.current[pixel[0]][pixel[1]] = star
  } else {
    if (mapRef.current[pixel[0]][pixel[1]] === undefined) {
      mapRef.current[pixel[0]][pixel[1]] = star
    } else {
      const object = mapRef.current[pixel[0]][pixel[1]]

      if (Array.isArray(object)) {
        mapRef.current[pixel[0]][pixel[1]] = [...object, star]
      } else {
        mapRef.current[pixel[0]][pixel[1]] = [object, star]
      }
    }
  }
}

interface SkyMapProps {
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
}

const SkyMap = ({
  stars,
  draftStar,
  disableChanges = false,
  constellations,
  draftConstellation,
  highlightedConstellations,
  onStarSelect,
  editedStar = undefined,
  onConstellationUpdate
}: SkyMapProps) => {
  const starMap = useRef<StarMap | null>(null)
  const mapContainer = useRef<HTMLDivElement>(null)

  const [skyObjects, setSkyObjects] = useState<StarObject[]>(stars)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    console.log('stars updated')
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

  function getStar(x: number, y: number) {
    if (starMap.current) {
      if (starMap.current[x] && starMap.current[x][y]) {
        const star = starMap.current[x][y]

        return star
      }
    }

    return undefined
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
      className=" relative h-full w-full min-h-48 bg-slate-900"
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
