import { useEffect, useRef } from 'react'
import { drawStar } from './functions'
import { StarObject } from '../../shared/interfaces'

const stars: StarObject[] = [
  // {
  //   id: 1,
  //   cx: 20,
  //   cy: 20,
  //   spikes: 10,
  //   innerRadius: 10,
  //   outerRadius: 10
  // },
  {
    id: 2,
    cx: 100,
    cy: 60,
    spikes: 15,
    innerRadius: 10,
    outerRadius: 60
  }
]

const SkyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function starManipulation() {}

  function loadObjects(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')

    if (ctx) {
      stars.forEach((star) => drawStar(ctx, star))
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      loadObjects(canvasRef.current)
    }
  }, [canvasRef])

  return (
    <>
      <canvas
        id="skyCanvas"
        ref={canvasRef}
        className=" bg-indigo-700"
        style={{ width: '100%' }}
      />
    </>
  )
}

export default SkyCanvas
