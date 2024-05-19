import { useEffect, useState } from 'react'
import { SkyMap } from '../components/SkyMap'
import { SkyElements } from '../components/SkyElements'
import { StarObject } from '../shared/interfaces'
import { Drawer } from '@mui/material'
import { ObjectEditor } from '../components/ObjectEditor'

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const [stars, setStars] = useState<StarObject[]>([
    {
      id: 1,
      name: 'Gwiazda Betlejemska',
      positionX: 250,
      positionY: 80,
      spikes: 9,
      innerRadius: 5,
      outerRadius: 15,
      layer: 0,
      color: '#ffffff'
    },
    {
      id: 2,
      name: 'Alpha Centauri',
      positionX: 0,
      positionY: 0,
      spikes: 11,
      innerRadius: 10,
      outerRadius: 40,
      layer: 0,
      color: '#ffffff'
    }
  ])
  const [selectedStar, setSelectedStar] = useState<StarObject>()

  useEffect(() => {
    if (selectedStar) setDrawerOpen(true)
  }, [selectedStar])

  useEffect(() => {
    if (!drawerOpen) setSelectedStar(undefined)
  }, [drawerOpen])

  function handleObjectChange(obj: StarObject) {
    const indexOf = stars.findIndex((object) => object.id === obj.id)

    if (indexOf >= 0) {
      setStars((prev) => {
        const newArr = [...prev]
        newArr[indexOf] = obj
        return newArr
      })
    }
  }

  return (
    <div className=" flex flex-col gap-y-2 p-2">
      <p className=" leading-none">Mapa nieba</p>
      <hr />
      <SkyMap stars={stars} onStarSelect={setSelectedStar} />

      <hr />

      <ObjectEditor skyObject={stars[0]} onObjectChange={handleObjectChange} />

      {/* <p>Elementy nieba</p>

      <SkyElements stars={stars} /> */}

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
