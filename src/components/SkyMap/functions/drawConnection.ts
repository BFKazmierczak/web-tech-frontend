import { StarObject } from '../../../shared/interfaces'

function drawConnection(
  ctx: CanvasRenderingContext2D,
  beginPosition: [x: number, y: number],
  connection: StarObject
) {
  ctx.beginPath()
  ctx.moveTo(beginPosition[0], beginPosition[1])
  ctx.lineTo(connection.positionX, connection.positionY)

  ctx.lineWidth = 3
  ctx.strokeStyle = 'white'
  ctx.stroke()
}

export default drawConnection
