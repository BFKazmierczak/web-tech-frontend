import { ConstellationObject } from '../interfaces/interfaces'

export function transformConstellations(
  prev: ConstellationObject[],
  fetchedConstellations: any[]
) {
  const mappedConstellations = fetchedConstellations.map(
    (fetchedConstellation: any) => {
      const mappedConnections: { [key: number]: any } = {}

      fetchedConstellation.starConnections.forEach((connection: any) => {
        mappedConnections[connection.origin.id as number] = {
          origin: connection.origin,
          destination: connection.destination
        }
      })

      const length = fetchedConstellation.starConnections.length
      const lastConnection = fetchedConstellation.starConnections[length - 1]
      if (lastConnection) {
        mappedConnections[lastConnection.destination.id] = {
          origin: lastConnection.destination.id,
          destination: lastConnection.destination.id
        }
      }

      const newConstellationObject = {
        ...fetchedConstellation,
        starConnections: mappedConnections
      } as ConstellationObject

      return newConstellationObject
    }
  )

  return mappedConstellations
}
