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
import { ConstellationObject } from '../../shared/interfaces/interfaces'

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
  constellations: ConstellationObject[]
  onStarSelect: (star: StarObject) => void
  editedStar?: StarObject
}

const SkyMap = ({
  stars,
  constellations,
  onStarSelect,
  editedStar = undefined
}: SkyMapProps) => {
  const starMap = useRef<StarMap | null>(null)
  const mapContainer = useRef<HTMLDivElement>(null)

  const [skyObjects, setSkyObjects] = useState<StarObject[]>(stars)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasOffsetxX = useRef<number>(0)
  const canvasOffsetY = useRef<number>(0)

  useEffect(() => {
    if (stars.length !== skyObjects.length) {
      setSkyObjects(stars)
    } else {
      let changedObject = undefined

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

    const pointerX = event.clientX - boundingRect.left
    const pointerY = event.clientY - boundingRect.top

    console.log('PARENT:', { pointerX, pointerY })

    // const foundStar = getStar(pointerX, pointerY)

    // if (canvasRef.current) {
    //   if (foundStar) {
    //     if (!Array.isArray(foundStar)) {
    //       const ctx = canvasRef.current.getContext('2d')

    //       if (ctx) {
    //         moveObject(ctx, pointerX, pointerY)
    //       }
    //     }
    //   }
    // }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons > 0) handleGenericPointer(event)
  }

  // useEffect(() => {
  //   if (stars.length) {
  //     stars.forEach((star) => {
  //       const starPixels = getPixelsInCircle(star.cx, star.cy, star.innerRadius)
  //       starPixels.forEach((pixel) => insertStar(starMap, pixel, star))
  //     })

  //     console.log({ starMap })
  //   }

  //   return () => {
  //     starMap.current = null
  //   }
  // }, [stars])

  useEffect(() => {
    if (canvasRef.current) {
      loadObjects(canvasRef.current)
    }
  }, [canvasRef])

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
            // connectedTo={}
            editing={editedStar?.id === object.id}
            parentRef={mapContainer}
            skyObject={object}
            onClick={(event) => onStarSelect(object)}
          />
        ))}
      </>
    </div>
  )
}

export default SkyMap
