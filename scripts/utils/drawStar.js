export default function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  const rot = (Math.PI / 2) * 3
  const x = cx
  const y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (i = 0; i < spikes; i++) {
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
  ctx.lineWidth = 5
  ctx.strokeStyle = 'blue'
  ctx.stroke()
  ctx.fillStyle = 'skyblue'
  ctx.fill()
}
