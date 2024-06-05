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
import axios from 'axios'

const apiToken =
  '85bd68be469190334cbfee55c9b32cad23e6da4d44144fac8be69dd0766cb6079510e9d8189bbd73cb48867b009fc13fd08a0577c07174ddb167d6434dcd0280692bd45363070bdaaba47eac0aa054af42bb8d8828fb931cec3548cbd3903f64a49df09673dd9b98e9480c41ddaee75a2b04a11f88e583bb338d103ca86fe7ca'

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

  useEffect(() => {
    axios({
      method: 'GET',
      url: 'http://localhost:1337/api/stars',
      headers: {
        Authorization: `bearer ${apiToken}`
      }
    }).then((result) => {
      if (result.status === 200) {
        const stars = result.data.data as StarObject[]
        setStars(stars)
      }
    })
  }, [])

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

        const connectionWithoutDestination = Object.values(newConnections).find(
          (connection: ConstellationConnection) =>
            connection.destination === undefined &&
            connection.origin.id !== star.id
        )

        if (!entry && !connectionWithoutDestination) {
          newConnections[star.id] = { origin: star, destination: undefined }
        } else if (connectionWithoutDestination) {
          newConnections[connectionWithoutDestination.origin.id] = {
            origin: connectionWithoutDestination.origin,
            destination: star
          }
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

      {display === 'editor' && editedObject && (
        <ObjectEditor
          skyObject={editedObject}
          onObjectChange={handleObjectChange}
          onSaveChanges={(star) => setEditedObject(undefined)}
        />
      )}

      {display === 'draft' && draftObject && (
        <ObjectEditor
          skyObject={draftObject}
          onObjectChange={handleDraftChange}
          onSaveChanges={(newStar) => {
            axios('http://localhost:1337/api/stars', {
              method: 'POST',
              data: { data: { ...newStar, id: undefined } },
              headers: {
                Authorization: `bearer ${apiToken}`
              }
            })

            setStars((prev) => [...prev, newStar])
            setDraftObject(undefined)
          }}
        />
      )}

      {display === 'constellations' && (
        <div className=" flex flex-col gap-y-3">
          <span>Lista konstelacji</span>
          <div className=" flex flex-col gap-y-1">
            {constellations.map((constellation) => (
              <ConstellationTile
                key={constellation.id}
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
                      key={value.origin.id}
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
          onConstellationCreate={(constellation) => {
            setConstellations((prev) => [...prev, constellation])
            setDraftConstellation((prev) => ({ ...prev, starConnections: {} }))
            setDisplay('main')
          }}
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
