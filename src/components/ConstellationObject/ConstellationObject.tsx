import { useEffect, useRef } from 'react'
import { ConstellationObject } from '../../shared/interfaces/interfaces'
import { drawConnection } from '../SkyMap/functions'

interface ConstellationProps {
  constellation: ConstellationObject
}

const Constellation = ({ constellation }: ConstellationProps) => {
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

      if (ctx) {
        Object.entries(constellation.starConnections).forEach((entry) => {
          drawConnection(ctx, entry[1].origin, entry[1].destination)
        })
      }
    }
  }, [canvasRef.current, constellation])

  return (
    <div className=" absolute" style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Constellation
