import { useEffect, useState } from 'react'
import { SkyCanvas } from '../components/SkyCanvas'
import { SkyElements } from '../components/SkyElements'
import { StarObject } from '../shared/interfaces'
import { Drawer } from '@mui/material'

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const [stars, setStars] = useState<StarObject[]>([
    {
      id: 2,
      name: 'Gwiazda Betlejemska',
      cx: 250,
      cy: 80,
      spikes: 9,
      innerRadius: 5,
      outerRadius: 15,
      layer: 0
    },
    {
      id: 2,
      name: 'Alpha Centauri',
      cx: 100,
      cy: 60,
      spikes: 11,
      innerRadius: 10,
      outerRadius: 40,
      layer: 0
    }
  ])
  const [selectedStar, setSelectedStar] = useState<StarObject>()

  useEffect(() => {
    if (selectedStar) setDrawerOpen(true)
  }, [selectedStar])

  useEffect(() => {
    if (!drawerOpen) setSelectedStar(undefined)
  }, [drawerOpen])

  return (
    <div className=" flex flex-col gap-y-2 p-2">
      <p className=" leading-none">Mapa nieba</p>
      <hr />
      <SkyCanvas stars={stars} onStarSelect={setSelectedStar} />

      <hr />

      <p>Elementy nieba</p>

      <SkyElements stars={stars} />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="bottom">
        <div className=" flex flex-col gap-y-1 p-3">
          <span className=" font-bold text-xl">{selectedStar?.name}</span>
          <hr />
          <span>Odległość: {selectedStar?.layer}</span>
        </div>
      </Drawer>
    </div>
  )
}

export default HomePage
