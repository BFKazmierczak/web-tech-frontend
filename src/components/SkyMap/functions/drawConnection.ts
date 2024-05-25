import { StarObject } from '../../../shared/interfaces'

function drawConnection(
  ctx: CanvasRenderingContext2D,
  origin: StarObject,
  destination: StarObject
) {
  ctx.beginPath()
  ctx.moveTo(origin.positionX, origin.positionY)
  ctx.lineTo(destination.positionX, destination.positionY)

  ctx.lineWidth = 3
  ctx.strokeStyle = 'white'
  ctx.stroke()
}

export default drawConnection
