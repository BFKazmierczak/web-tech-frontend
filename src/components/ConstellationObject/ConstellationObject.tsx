import { PointerEvent, useEffect, useRef, useState } from 'react'
import {
  ConstellationConnection,
  ConstellationHighlight,
  ConstellationObject,
  ConstellationStars
} from '../../shared/interfaces/interfaces'
import { drawConnection } from '../SkyMap/functions'

interface ConstellationProps {
  constellation: ConstellationObject
  highlight?: ConstellationHighlight
  draft?: boolean
}

const Constellation = ({
  constellation,
  highlight = {},
  draft = false
}: ConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [position, setPosition] = useState<{ x: number; y: number }>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement

    if (parent) {
      const { width, height } = parent.getBoundingClientRect()

      canvas.width = width
      canvas.height = height
    }

    Object.entries(constellation.starConnections).forEach(
      (entry: ConstellationStars) => {
        const highlighted = highlight[entry[1].origin.id]
          ? highlight[entry[1].origin.id] !== undefined
          : false

        if (entry[1].destination) {
          drawConnection(
            ctx,
            entry[1].origin,
            entry[1].destination,
            highlighted
          )
        }
      }
    )
  }, [canvasRef.current, constellation, highlight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const connectionWithoutDestination = Object.values(
      constellation.starConnections
    ).find(
      (connection: ConstellationConnection) =>
        connection.destination === undefined
    )

    if (!connectionWithoutDestination) return

    drawConnection(
      ctx,
      connectionWithoutDestination.origin,
      connectionWithoutDestination.destination,
      true,
      position
    )
  }, [position])

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const { left, top } = event.currentTarget.getBoundingClientRect()

    setPosition({
      x: event.clientX - left,
      y: event.clientY - top
    })
  }

  return (
    <div className=" absolute" style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onPointerMove={(event) => {
          if (draft) handlePointerMove(event)
        }}
      />
    </div>
  )
}

export default Constellation
