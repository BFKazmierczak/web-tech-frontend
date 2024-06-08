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

      const newConstellationObject = {
        ...fetchedConstellation,
        starConnections: mappedConnections
      } as ConstellationObject

      return newConstellationObject
    }
  )

  return [...mappedConstellations]
}
