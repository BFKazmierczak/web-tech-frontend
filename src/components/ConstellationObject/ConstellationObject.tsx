import { useEffect, useRef } from 'react'
import {
  ConstellationHighlight,
  ConstellationObject,
  ConstellationStars
} from '../../shared/interfaces/interfaces'
import { drawConnection } from '../SkyMap/functions'

interface ConstellationProps {
  constellation: ConstellationObject
  highlight?: ConstellationHighlight
}

const Constellation = ({
  constellation,
  highlight = {}
}: ConstellationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const parent = canvas.parentElement

      if (parent) {
        const { width, height } = parent.getBoundingClientRect()

        canvas.width = width
        canvas.height = height
      }

      console.log({ highlight })

      if (ctx) {
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
      }
    }
  }, [canvasRef.current, constellation, highlight])

  return (
    <div className=" absolute" style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Constellation
