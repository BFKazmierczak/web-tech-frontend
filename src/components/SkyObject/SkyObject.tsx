import React, { RefObject, useEffect, useRef, useState } from 'react'
import { StarObject } from '../../shared/interfaces'
import { drawStar } from '../SkyMap/functions'
import { relative } from 'path'

interface SkyObjectProps {
  parentRef: RefObject<HTMLDivElement>
  skyObject: StarObject
}

const SkyObject = ({ parentRef, skyObject }: SkyObjectProps) => {
  const objectRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [innerSkyObject, setInnerSkyObject] = useState<StarObject>(skyObject)

  const [transform, setTransform] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  useEffect(() => {
    // check the diff here...

    const passedObjectWidth = Math.abs(
      2 * (skyObject.innerRadius + skyObject.outerRadius)
    )
    const passedObjectHeight = Math.abs(
      2 * (skyObject.innerRadius + skyObject.outerRadius)
    )

    const innerObjectWidth = Math.abs(
      2 * (innerSkyObject.innerRadius + innerSkyObject.outerRadius)
    )
    const innerObjectHeight = Math.abs(
      2 * (innerSkyObject.innerRadius + innerSkyObject.outerRadius)
    )

    console.log(skyObject)
    console.log(innerSkyObject)

    const widthDiff = passedObjectWidth - innerObjectWidth
    const heightDiff = passedObjectHeight - innerObjectHeight

    console.log('WIDTH DIFFERENCE:', widthDiff)
    console.log('HEIGHT DIFFERENCE:', heightDiff)

    const div = objectRef.current
    if (div) {
      setTransform((prev) => ({
        x: prev.x - widthDiff / 2,
        y: prev.y - heightDiff / 2
      }))
    }

    setInnerSkyObject(skyObject)
  }, [skyObject])

  useEffect(() => {
    const div = objectRef.current
    if (div) {
      div.style.transform = `translateX(${transform.x}px) translateY(${transform.y}px)`
    }
  }, [transform, objectRef.current])

  useEffect(() => {
    if (parentRef.current) {
      console.log('current useeffect')

      const skyObjectWidth = Math.abs(
        (innerSkyObject.innerRadius + innerSkyObject.outerRadius) * 2
      )
      const skyObjectHeight = Math.abs(
        (innerSkyObject.innerRadius + innerSkyObject.outerRadius) * 2
      )

      const relativeX = innerSkyObject.positionX - skyObjectWidth / 2
      const relativeY = innerSkyObject.positionY - skyObjectHeight / 2

      console.log('POS:', innerSkyObject.positionX, innerSkyObject.positionY)
      console.log({ skyObjectWidth, skyObjectHeight })

      setTransform({
        x: relativeX,
        y: relativeY
      })
    }
  }, [
    objectRef.current,
    parentRef.current,
    innerSkyObject.positionX,
    innerSkyObject.positionY
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (ctx && canvas) {
      const canvasSize =
        innerSkyObject.innerRadius * 2 + innerSkyObject.outerRadius * 2

      canvas.width = canvasSize
      canvas.height = canvasSize

      drawStar(ctx, innerSkyObject)
    }
  }, [canvasRef, innerSkyObject])

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons > 0) {
      const div = event.currentTarget
      if (parentRef.current) {
        div.style.border = '2px dotted red'

        const parentBoundingRect = parentRef.current.getBoundingClientRect()
        const boundingRect = div.getBoundingClientRect()

        const relativePointerX = event.clientX - parentBoundingRect.left
        const relativePointerY = event.clientY - parentBoundingRect.top

        const objectCenterX = boundingRect.width / 2
        const objectCenterY = boundingRect.height / 2

        const offsetX = relativePointerX - objectCenterX
        const offsetY = relativePointerY - objectCenterY

        div.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`
      }
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.border = 'none'
  }

  return (
    <div
      ref={objectRef}
      className=" absolute"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default SkyObject
