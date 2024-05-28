import { StarObject } from '../../../shared/interfaces'

function drawConnection(
  ctx: CanvasRenderingContext2D,
  origin: StarObject,
  destination: StarObject,
  highlighted?: boolean
) {
  let highlightColor = '#58b9d6'

  ctx.beginPath()
  ctx.moveTo(origin.positionX, origin.positionY)
  ctx.lineTo(destination.positionX, destination.positionY)

  ctx.lineWidth = 2
  ctx.shadowColor = highlighted ? highlightColor : 'white'
  ctx.shadowBlur = 12
  ctx.strokeStyle = highlighted ? highlightColor : 'white'
  ctx.stroke()
}

export default drawConnection
