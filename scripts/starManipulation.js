document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('skyCanvas')

  console.log('twoja stara')

  canvas.addEventListener('click', (event) => {
    console.log({ event })
  })
})
