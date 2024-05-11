type AssertPositive<N extends number> = number extends N
  ? N
  : `${N}` extends `-${string}`
  ? never
  : N

export interface StarObject {
  id: AssertPositive<number>
  cx: AssertPositive<number>
  cy: AssertPositive<number>
  spikes: AssertPositive<number>
  outerRadius: AssertPositive<number>
  innerRadius: AssertPositive<number>
}
