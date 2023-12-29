export type PlayerId = number;
export type GroupId = number;
export type QueueId = number;

// recursive types bad, just for exercise
type Length<T extends any[]> = T extends { length: infer L } ? L : never;
type BuildTuple<L extends number, T extends any[] = []> = T extends {
  length: L;
}
  ? T
  : BuildTuple<L, [...T, any]>;
type Inc<A extends number> = Length<[...BuildTuple<A>, any]>;
type CommaSeparatedListSegment<T extends string | number> = `${T}`;
export type CommaSeparatedList<T extends string | number, N = 0> = N extends 46
  ? CommaSeparatedListSegment<T>
  : N extends number
  ?
      | CommaSeparatedList<T, Inc<N>>
      | `${CommaSeparatedListSegment<T>},${CommaSeparatedList<T, Inc<N>>}`
  : never;

export type QuickselectId = number;
export type ContainerId = number;
export type MediaId = string;
export type SearchCriteriaId = number;
