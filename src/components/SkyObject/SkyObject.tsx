import React, { RefObject, createRef, useEffect, useRef, useState } from 'react'
import { StarObject } from '../../shared/interfaces'
import { drawConnection, drawStar } from '../SkyMap/functions'
import { relative } from 'path'

interface SkyObjectProps {
  parentRef: RefObject<HTMLDivElement>
  skyObject: StarObject
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  editing?: boolean
  onPositionUpdate: (star: StarObject, x: number, y: number) => void
}

const SkyObject = ({
  parentRef,
  skyObject,
  onClick,
  editing = false,
  onPositionUpdate
}: SkyObjectProps) => {
  const objectRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const connectionRefs: { [id: number | string]: HTMLCanvasElement } = {}

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

    const widthDiff = passedObjectWidth - innerObjectWidth
    const heightDiff = passedObjectHeight - innerObjectHeight

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

      const x =
        transform.x + (innerSkyObject.innerRadius + innerSkyObject.outerRadius)
      const y =
        transform.y + (innerSkyObject.innerRadius + innerSkyObject.outerRadius)

      onPositionUpdate(innerSkyObject, x, y)
    }
  }, [transform, objectRef.current])

  useEffect(() => {
    console.log('NEW INNER OBJECT:', { innerSkyObject })
  }, [innerSkyObject])

  useEffect(() => {
    if (parentRef.current) {
      const skyObjectWidth = Math.abs(
        (innerSkyObject.innerRadius + innerSkyObject.outerRadius) * 2
      )
      const skyObjectHeight = Math.abs(
        (innerSkyObject.innerRadius + innerSkyObject.outerRadius) * 2
      )

      const relativeX = innerSkyObject.positionX - skyObjectWidth / 2
      const relativeY = innerSkyObject.positionY - skyObjectHeight / 2

      // console.log('POS:', innerSkyObject.positionX, innerSkyObject.positionY)
      // console.log({ skyObjectWidth, skyObjectHeight })

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

  // useEffect(() => {
  //   const starConnections =
  //     innerSkyObject.constellation?.starConnections[innerSkyObject.id]

  //   if (
  //     starConnections !== undefined &&
  //     Object.keys(connectionRefs).length === starConnections.length
  //   ) {
  //     Object.entries(connectionRefs).forEach((entry) => {
  //       const starId = entry[0]
  //       const canvas = entry[1]
  //       const ctx = canvas.getContext('2d')

  //       const connectedStar = starConnections.find(
  //         (star) => star.id === Number(starId)
  //       )

  //       if (ctx && connectedStar) {
  //         const parent = canvas.parentElement

  //         if (parent) {
  //           const { width, height } = parent.getBoundingClientRect()

  //           canvas.width = width
  //           canvas.height = height
  //         }

  //         console.log(
  //           'position:',
  //           innerSkyObject.positionX,
  //           innerSkyObject.positionY
  //         )

  //         console.log('wtf?')

  //         const x =
  //           transform.x +
  //           (innerSkyObject.innerRadius + innerSkyObject.outerRadius)
  //         const y =
  //           transform.y +
  //           (innerSkyObject.innerRadius + innerSkyObject.outerRadius)

  //         const beginPositions = [x, y] as [x: number, y: number]

  //         drawConnection(ctx, beginPositions, connectedStar)
  //       }
  //     })
  //   }
  // }, [connectionRefs, transform])

  useEffect(() => {
    if (editing && objectRef.current)
      objectRef.current.style.border = '2px dotted red'
  }, [editing, objectRef])

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

        setTransform({
          x: offsetX,
          y: offsetY
        })
      }
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!editing) event.currentTarget.style.border = 'none'
  }

  return (
    <>
      <div
        ref={objectRef}
        className=" absolute z-10"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={onClick}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  )
}

export default SkyObject
