import { StarObject } from '../../../shared/interfaces'

function moveObject(ctx: CanvasRenderingContext2D, x0: number, y0: number) {
  ctx.clearRect(x0, y0, 50, 50)
}

export default moveObject
