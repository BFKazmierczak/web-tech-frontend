import { StarObject } from '../../../shared/interfaces'

function drawStar(ctx: CanvasRenderingContext2D, star: StarObject) {
  const { spikes, outerRadius, innerRadius } = star

  let cx = ctx.canvas.width / 2
  let cy = ctx.canvas.height / 2

  let rot = (Math.PI / 2) * 3
  let x = cx
  let y = cy
  let step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'white'
  ctx.stroke()
  ctx.fillStyle = 'skyblue'
  ctx.fill()
}

export default drawStar
