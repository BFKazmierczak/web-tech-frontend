import drawStar from "../"

skyObjectLoader()

function skyObjectLoader() {
  console.log('test')
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('skyCanvas')
    const ctx = canvas.getContext('2d')

    console.log('filling the canvas')

    drawStar(ctx, 10, 10, 150, 100)
  })
}
