import { useEffect, useState } from 'react'
import { SkyMap } from '../components/SkyMap'
import { StarObject } from '../shared/interfaces'
import { Button } from '@mui/material'
import { ObjectEditor } from '../components/ObjectEditor'

import EditNoteIcon from '@mui/icons-material/EditNote'
import UndoIcon from '@mui/icons-material/Undo'
import {
  ConstellationConnection,
  ConstellationHighlight,
  ConstellationObject,
  ConstellationStars,
  Display
} from '../shared/interfaces/interfaces'
import {
  ConstellationConnectionDisplay,
  ConstellationCreator,
  ConstellationTile
} from '../components/ConstellationComponents'
import { Add } from '@mui/icons-material'

const HomePage = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const [stars, setStars] = useState<StarObject[]>([
    {
      id: 1,
      name: 'Gwiazda Betlejemska',
      positionX: 370,
      positionY: 60,
      spikes: 9,
      innerRadius: 5,
      outerRadius: 15,
      layer: 0,
      color: '#234445'
    },
    {
      id: 2,
      name: 'Alpha Centauri',
      positionX: 100,
      positionY: 100,
      spikes: 11,
      innerRadius: 10,
      outerRadius: 40,
      layer: 0,
      color: '#ffffff'
    },
    {
      id: 3,
      name: 'Beta Centauri',
      positionX: 250,
      positionY: 120,
      spikes: 11,
      innerRadius: 10,
      outerRadius: 40,
      layer: 0,
      color: '#ffffff'
    }
  ])
  const [selectedStar, setSelectedStar] = useState<StarObject>()
  const [editedObject, setEditedObject] = useState<StarObject>()
  const [draftObject, setDraftObject] = useState<StarObject>()

  const [constellations, setConstellations] = useState<ConstellationObject[]>([
    // {
    //   id: 1,
    //   name: 'test constellation',
    //   starConnections: {
    //     1: {
    //       origin: stars[0],
    //       destination: stars[1]
    //     },
    //     2: {
    //       origin: stars[1],
    //       destination: stars[2]
    //     },
    //     3: {
    //       origin: stars[2],
    //       destination: stars[2]
    //     }
    //   }
    // }
  ])
  const [draftConstellation, setDraftConstellation] =
    useState<ConstellationObject>({
      id: -1,
      name: 'Nowa konstelacja',
      starConnections: {}
    })

  const [highlightedConstellations, setHighlightedConstellations] =
    useState<ConstellationHighlight>({})

  const [display, setDisplay] = useState<Display>('main')

  const [selectedConstellation, setSelectedConstellation] =
    useState<ConstellationObject>()

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

  function handleDraftChange(obj: StarObject) {
    setDraftObject(obj)
  }

  function handleStarSelect(star: StarObject) {
    if (display === 'newConstellation') {
      setDraftConstellation((draft) => {
        const newConnections = { ...draft.starConnections }

        const entry = newConnections[star.id]

        console.log({ entry })

        // sprawdź czy istnieje jakiś bez destination
        const noDestinationConnection = Object.values(newConnections).find(
          (connection: ConstellationConnection) =>
            connection.destination === undefined
        )

        if (entry === undefined) {
          newConnections[star.id] = { origin: star, destination: undefined }
        } else if (entry && entry.destination === undefined) {
          newConnections[star.id] = { ...entry, destination: star }
        }

        return {
          ...draft,
          starConnections: { ...newConnections }
        }
      })
    } else {
      setDisplay((prev) => {
        if (prev === 'editor') return prev
        return 'selectedStar'
      })
      setSelectedStar(star)
    }
  }

  return (
    <div className=" flex flex-col gap-y-2 p-2">
      <p className=" leading-none">Mapa nieba</p>
      <hr />
      <SkyMap
        stars={stars}
        draftStar={draftObject}
        disableChanges={draftObject !== undefined}
        constellations={constellations}
        draftConstellation={draftConstellation}
        highlightedConstellations={highlightedConstellations}
        onStarSelect={handleStarSelect}
        editedStar={editedObject}
        onConstellationUpdate={(constellation, index) => {
          setConstellations((prev) => {
            const newArr = [...prev]
            newArr[index] = constellation
            return newArr
          })
        }}
      />

      <hr />

      {selectedStar && !editedObject && (
        <>
          <div className=" flex flex-col gap-y-1">
            <span>Wybrano: {selectedStar.name}</span>
            <div className=" flex gap-x-3">
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditNoteIcon />}
                onClick={() => {
                  setDisplay('editor')
                  setEditedObject(selectedStar)
                }}>
                Edytuj
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<UndoIcon />}
                onClick={() => {
                  setDisplay('main')
                  setSelectedStar(undefined)
                }}>
                Wróć
              </Button>
            </div>
          </div>
        </>
      )}

      {display === 'editor' && (
        <ObjectEditor
          skyObject={editedObject as StarObject}
          onObjectChange={handleObjectChange}
          onSaveChanges={(star) => setEditedObject(undefined)}
        />
      )}

      {display === 'draft' && (
        <ObjectEditor
          skyObject={draftObject as StarObject}
          onObjectChange={handleDraftChange}
          onSaveChanges={(newStar) => {
            setDraftObject(undefined)
            setStars((prev) => [...prev, newStar])
          }}
        />
      )}

      {display === 'constellations' && (
        <div className=" flex flex-col gap-y-3">
          <span>Lista konstelacji</span>
          <div className=" flex flex-col gap-y-1">
            {constellations.map((constellation) => (
              <ConstellationTile
                constellation={constellation}
                onClick={(constellation) => {
                  setSelectedConstellation(constellation)
                  setDisplay('selectedConstellation')
                }}
              />
            ))}

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setDisplay('newConstellation')}>
              Dodaj nową
            </Button>
          </div>
        </div>
      )}

      {display === 'selectedConstellation' && selectedConstellation && (
        <div className=" flex flex-col gap-y-3">
          <span>
            Konstelacja:{' '}
            <span className=" font-bold">{selectedConstellation.name}</span>
          </span>

          <div className=" flex flex-col gap-y-2">
            {Object.values(selectedConstellation.starConnections).map(
              (value: ConstellationConnection, index, array) => (
                <>
                  {index !== array.length - 1 && (
                    <ConstellationConnectionDisplay
                      connection={value}
                      onMouseEnter={(event, connection) => {
                        const newHighlight = {
                          [selectedConstellation.id]: {
                            [connection.origin.id]: connection
                          }
                        }

                        setHighlightedConstellations(newHighlight)
                      }}
                      onMouseLeave={(event) => setHighlightedConstellations({})}
                    />
                  )}
                </>
              )
            )}
          </div>
        </div>
      )}

      {display === 'newConstellation' && (
        <ConstellationCreator
          starConnections={draftConstellation.starConnections}
        />
      )}

      {display === 'main' && (
        <>
          <div className=" flex flex-col gap-y-1 w-full sm:w-64">
            <Button
              variant="contained"
              onClick={() => {
                setDisplay('draft')
                setDraftObject({
                  id: -1,
                  name: 'Nienazwana gwiazda',
                  positionX: 370,
                  positionY: 60,
                  spikes: 9,
                  innerRadius: 5,
                  outerRadius: 15,
                  layer: 0,
                  color: '#234445'
                })
              }}>
              Dodaj gwiazdę
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setDisplay('constellations')
              }}>
              Edytor konstelacji
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
