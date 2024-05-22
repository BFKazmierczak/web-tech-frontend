import { useEffect, useState } from 'react'
import { SkyMap } from '../components/SkyMap'
import { SkyElements } from '../components/SkyElements'
import { StarObject } from '../shared/interfaces'
import { Button, Drawer } from '@mui/material'
import { ObjectEditor } from '../components/ObjectEditor'

import EditNoteIcon from '@mui/icons-material/EditNote'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { ConstellationObject } from '../shared/interfaces/interfaces'

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
      color: '#234445'
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
    },
    {
      id: 3,
      name: 'Beta Centauri',
      positionX: 50,
      positionY: 50,
      spikes: 11,
      innerRadius: 10,
      outerRadius: 40,
      layer: 0,
      color: '#ffffff'
    }
  ])
  const [selectedStar, setSelectedStar] = useState<StarObject>()
  const [editedObject, setEditedObject] = useState<StarObject>()

  const [constellations, setConstellations] = useState<ConstellationObject[]>([
    {
      id: 1,
      name: 'test constellation',
      starConnections: {
        1: [stars[1]],
        2: [stars[2]]
      }
    }
  ])

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
      <SkyMap
        stars={stars}
        constellations={constellations}
        onStarSelect={setSelectedStar}
        editedStar={editedObject}
      />

      <hr />

      {selectedStar && !editedObject && (
        <>
          <span>
            Wybrano: {selectedStar.name}{' '}
            <Button
              variant="outlined"
              startIcon={<EditNoteIcon />}
              onClick={() => setEditedObject(selectedStar)}>
              Edytuj
            </Button>
          </span>
        </>
      )}

      {editedObject && (
        <ObjectEditor
          skyObject={editedObject}
          onObjectChange={handleObjectChange}
          onSaveChanges={() => setEditedObject(undefined)}
        />
      )}

      {/* <p>Elementy nieba</p>

      <SkyElements stars={stars} /> */}

      {/* <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor="bottom">
        <div className=" flex flex-col gap-y-1 p-3">
          <span className=" font-bold text-xl">{selectedStar?.name}</span>
          <hr />
          <span>Odległość: {selectedStar?.layer}</span>
        </div>
      </Drawer> */}
    </div>
  )
}

export default HomePage
