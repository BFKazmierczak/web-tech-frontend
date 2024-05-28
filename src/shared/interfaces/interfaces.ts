type AssertPositive<N extends number> = number extends N
  ? N
  : `${N}` extends `-${string}`
  ? never
  : N

export type ConstellationConnection = {
  origin: StarObject
  destination: StarObject | undefined
}

export interface ConstellationStars {
  [starId: number]: ConstellationConnection
}

export interface ConstellationHighlight {
  [constellationId: number]: {
    [originId: number]: ConstellationConnection
  }
}

export interface StarObject {
  id: AssertPositive<number>
  name: string
  positionX: AssertPositive<number>
  positionY: AssertPositive<number>
  spikes: AssertPositive<number>
  outerRadius: AssertPositive<number>
  innerRadius: AssertPositive<number>
  layer: number
  color: string
  constellation?: ConstellationObject
}

export interface ConstellationObject {
  id: number
  name: string
  starConnections: ConstellationStars
}

export type Display =
  | 'main'
  | 'editor'
  | 'draft'
  | 'selectedStar'
  | 'constellations'
  | 'selectedConstellation'
  | 'newConstellation'
