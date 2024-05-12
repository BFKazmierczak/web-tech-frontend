import React, { RefObject, useEffect, useRef, useState } from 'react'
import { StarObject } from '../../shared/interfaces'
import { drawStar } from '../SkyMap/functions'

interface SkyObjectProps {
  parentRef: RefObject<HTMLDivElement>
  skyObject: StarObject
}

const SkyObject = ({ parentRef, skyObject }: SkyObjectProps) => {
  const objectRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    skyObject.positionX,
    skyObject.positionY
  ])

  // useEffect(() => {
  //   if (objectRef.current) {
  //     console.log('current useeffect')

  //     const div = objectRef.current
  //     const rect = div.getBoundingClientRect()

  //     const skyObjectWidth = (skyObject.innerRadius + skyObject.outerRadius) * 2
  //     const skyObjectHeight =
  //       (skyObject.innerRadius + skyObject.outerRadius) * 2

  //     const relativeX = initialPosition[0]
  //     const relativeY = initialPosition[1]

  //     console.log({ initialPosition })
  //     console.log({ skyObjectWidth, skyObjectHeight })

  //     div.style.left = `${relativeX}px`
  //     div.style.top = `${relativeY}px`
  //   }
  // }, [objectRef.current, initialPosition])

  useEffect(() => {
    console.log('useeffect')
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      const canvasSize = skyObject.innerRadius * 2 + skyObject.outerRadius * 2

      canvas.width = canvasSize
      canvas.height = canvasSize

      drawStar(ctx, skyObject)
    }
  }, [canvasRef, skyObject])

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons > 0 && objectRef.current) {
      const div = objectRef.current
      if (parentRef.current) {
        const parentBoundingRect = parentRef.current.getBoundingClientRect()
        const boundingRect = div.getBoundingClientRect()

        const relativePointerX = event.clientX - parentBoundingRect.left
        const relativePointerY = event.clientY - parentBoundingRect.top

        const objectCenterX = boundingRect.width / 2
        const objectCenterY = boundingRect.height / 2

        console.log({ objectCenterX, objectCenterY })

        const offsetX = relativePointerX - objectCenterX
        const offsetY = relativePointerY - objectCenterY

        div.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`
      }
    }
  }

  return (
    <div
      ref={objectRef}
      className=" absolute"
      onPointerMove={handlePointerMove}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default SkyObject
