import { useEffect, useState, useCallback } from 'react'
import { SkyMap } from '../components/SkyMap'
import { StarObject } from '../shared/interfaces'
import { ObjectEditor } from '../components/ObjectEditor'
import EditNoteIcon from '@mui/icons-material/EditNote'
import UndoIcon from '@mui/icons-material/Undo'
import {
  ConstellationConnection,
  ConstellationHighlight,
  ConstellationObject,
  Display
} from '../shared/interfaces/interfaces'
import {
  ConstellationConnectionDisplay,
  ConstellationCreator,
  ConstellationTile
} from '../components/ConstellationComponents'
import { Add } from '@mui/icons-material'
import axios from 'axios'
import { Button } from '../components/Inputs'
import { transformConstellations } from '../shared/functions'

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
  const [selectedStar, setSelectedStar] = useState<StarObject | undefined>(
    undefined
  )
  const [editedObject, setEditedObject] = useState<StarObject | undefined>(
    undefined
  )
  const [draftObject, setDraftObject] = useState<StarObject | undefined>(
    undefined
  )

  const [constellations, setConstellations] = useState<ConstellationObject[]>(
    []
  )
  const [draftConstellation, setDraftConstellation] =
    useState<ConstellationObject>({
      id: -1,
      name: 'Nowa konstelacja',
      starConnections: {}
    })

  const [highlightedConstellations, setHighlightedConstellations] =
    useState<ConstellationHighlight>({})
  const [display, setDisplay] = useState<Display>('main')
  const [selectedConstellation, setSelectedConstellation] = useState<
    ConstellationObject | undefined
  >(undefined)

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
        const fetchedStars = result.data.data as StarObject[]
        setStars(fetchedStars)
      }
    })

    axios({
      method: 'GET',
      url: 'http://localhost:1337/api/constellations?populate=deep,3',
      headers: {
        Authorization: `bearer ${apiToken}`
      }
    }).then((result) => {
      if (result.status === 200) {
        const fetchedConstellations = result.data.data

        setConstellations((prev) =>
          transformConstellations(prev, fetchedConstellations)
        )
      }
    })
  }, [])

  const handleObjectChange = useCallback(
    (obj: StarObject) => {
      const indexOf = stars.findIndex((object) => object.id === obj.id)

      if (indexOf >= 0) {
        setStars((prev) => {
          const newArr = [...prev]
          newArr[indexOf] = obj
          return newArr
        })
      }
    },
    [stars]
  )

  const handleDraftChange = useCallback((obj: StarObject) => {
    setDraftObject(obj)
  }, [])

  const handleStarSelect = useCallback(
    (star: StarObject) => {
      if (display === 'newConstellation') {
        setDraftConstellation((draft) => {
          const newConnections = { ...draft.starConnections }
          const entry = newConnections[star.id]
          const connectionWithoutDestination = Object.values(
            newConnections
          ).find(
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
        setDisplay((prev) => (prev === 'editor' ? prev : 'selectedStar'))
        setSelectedStar(star)
      }
    },
    [display]
  )

  const handleAcceptChanges = useCallback((star: StarObject) => {
    axios({
      url: `http://localhost:1337/api/stars/${star.id}`,
      method: 'PUT',
      data: {
        data: { ...star }
      },
      headers: {
        Authorization: `bearer ${apiToken}`
      }
    })

    setEditedObject(undefined)
  }, [])

  const handleAddStar = useCallback((star: StarObject) => {
    axios({
      url: 'http://localhost:1337/api/stars',
      method: 'POST',
      data: { data: { ...star, id: undefined } },
      headers: {
        Authorization: `bearer ${apiToken}`
      }
    }).then((result) => {
      const newStar = result.data.data

      setStars((prev) => [...prev, newStar])
      setDraftObject(undefined)
    })
  }, [])

  async function handleAddConstellation(constellation: ConstellationObject) {
    const transformedConnections = Object.entries(
      constellation.starConnections
    ).map(([key, connection]) => {
      return {
        origin: connection.origin.id,
        destination: connection.destination.id
      }
    })

    const relatedConnections = transformedConnections.map(
      async (transformedConn) => {
        const result = await axios({
          method: 'POST',
          url: 'http://localhost:1337/api/connections',
          data: {
            data: {
              origin: transformedConn.origin,
              destination: transformedConn.destination
            }
          },
          headers: {
            Authorization: `bearer ${apiToken}`
          }
        })

        if (result) return result.data.data.id

        return 0
      }
    )

    Promise.all(relatedConnections).then((result: number[]) => {
      addConstellation(result)
    })

    function addConstellation(connections: number[]) {
      axios({
        method: 'POST',
        url: 'http://localhost:1337/api/constellations?populate=deep,3',
        data: {
          data: {
            name: constellation.name,
            starConnections: connections
          }
        },
        headers: {
          Authorization: `bearer ${apiToken}`
        }
      }).then((result) => {
        if (result.status === 200) {
          const newConstellation = transformConstellations([], [
            result.data.data
          ] as any[])[0]

          setConstellations((prev) => [
            ...prev,
            newConstellation as ConstellationObject
          ])
          setDraftConstellation((prev) => ({
            ...prev,
            starConnections: {}
          }))
          setDisplay('main')
        }
      })
    }
  }

  return (
    <div className="flex justify-between gap-x-1 p-2">
      <div className=" flex flex-col w-[75%]">
        <p className=" leading-none bg-neutral-900 text-xl text-white px-2 py-3 rounded-t-xl">
          Mapa nieba
        </p>

        <SkyMap
          className=" rounded-b-xl"
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
          onPositionUpdate={(star) => {
            if (display === 'draft') handleDraftChange(star)
            else handleObjectChange(star)

            if (editedObject) setEditedObject(star)
          }}
        />
      </div>

      <div
        id="sidePanel"
        className=" flex w-[25%] bg-neutral-900 text-white rounded-xl shadow-xl">
        {selectedStar && !editedObject && (
          <div className="flex flex-col w-full p-5 gap-y-1">
            <span className=" font-light">
              Wybrano:{' '}
              <span className=" font-normal">
                {selectedStar.name} {`(${selectedStar.id})`}
              </span>
            </span>
            <div className="flex gap-x-3">
              <Button
                icon={<EditNoteIcon />}
                onClick={() => {
                  setDisplay('editor')
                  setEditedObject(selectedStar)
                }}>
                Edytuj
              </Button>

              <Button
                icon={<UndoIcon />}
                onClick={() => {
                  setDisplay('main')
                  setSelectedStar(undefined)
                }}>
                Wróć
              </Button>
            </div>
          </div>
        )}

        {display === 'editor' && editedObject && (
          <ObjectEditor
            skyObject={editedObject}
            onObjectChange={handleObjectChange}
            onSaveChanges={handleAcceptChanges}
          />
        )}

        {display === 'draft' && draftObject && (
          <ObjectEditor
            skyObject={draftObject}
            onObjectChange={handleDraftChange}
            onSaveChanges={handleAddStar}
          />
        )}

        {display === 'constellations' && (
          <div className=" flex flex-col w-full p-5 gap-y-5">
            <span>Lista konstelacji</span>
            <div className="flex flex-col gap-y-1">
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
            </div>

            <Button
              icon={<Add />}
              onClick={() => setDisplay('newConstellation')}>
              Dodaj nową
            </Button>

            <hr />

            <Button icon={<UndoIcon />} onClick={() => setDisplay('main')}>
              Wróć
            </Button>
          </div>
        )}

        {display === 'selectedConstellation' && selectedConstellation && (
          <div className=" flex flex-col w-full gap-y-5 p-5">
            <span className=" font-light">
              Konstelacja:{' '}
              <span className="font-normal">{selectedConstellation.name}</span>
            </span>

            <div className="flex flex-col gap-y-2">
              <span className=" font-light">Połączone gwiazdy:</span>
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
                        onMouseLeave={(event) =>
                          setHighlightedConstellations({})
                        }
                      />
                    )}
                  </>
                )
              )}
            </div>

            <hr />

            <Button
              icon={<UndoIcon />}
              onClick={() => setDisplay('constellations')}>
              Wróć
            </Button>
          </div>
        )}

        {display === 'newConstellation' && (
          <ConstellationCreator
            starConnections={draftConstellation.starConnections}
            onConstellationCreate={handleAddConstellation}
          />
        )}

        {display === 'main' && (
          <div className="flex flex-col gap-y-1 w-full p-5">
            <Button
              icon={<Add />}
              onClick={() => {
                setDisplay('draft')
                setDraftObject({
                  id: -1,
                  name: 'Nowa gwiazda',
                  positionX: 500,
                  positionY: 100,
                  spikes: 8,
                  innerRadius: 3,
                  outerRadius: 15,
                  layer: 3,
                  color: '#f7f7f7'
                })
              }}>
              Dodaj gwiazdę
            </Button>

            <Button
              onClick={() => {
                setDisplay('constellations')
              }}>
              Edytor konstelacji
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
