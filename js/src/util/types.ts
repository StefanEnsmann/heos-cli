import type { Control, LineOut, MediaType, MusicSource, MusicSourceType, Network, NonStation, Options, Role, SearchCriteria, Station, YesNo } from "./constants.js";
import type { Message } from "./messages.js";

export type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export type PromiseReject<T = undefined> = (reason: T) => void;

export type RoutingInfo = {
  address: string;
  family: string;
  port: number;
  size: number;
};

export type PlayerId = number;
export type GroupId = number;
export type QueueId = number;
export type AlbumId = string;

export type QuickselectId = number;
export type ContainerId = number;
export type MediaId = string;

export type PlayMode = Required<Pick<Message, "repeat" | "shuffle">>;

export type PlayerInfo = {
  control?: Control,
  gid?: GroupId;
  lineout: LineOut,
  model: string;
  name: string;
  network: Network;
  pid: PlayerId;
  serial?: string;
  version: string;
};

export type PlayingMedia = {
  album_id: AlbumId;
  album: string;
  artist: string;
  image_url: string;
  mid: MediaId;
  qid: QueueId;
  sid: NonStation;
  song: string;
  type: "song";
} | {
  album: string;
  artist: string;
  image_url: string;
  mid: MediaId;
  qid: QueueId;
  sid: Station;
  song: string;
  station: string;
  type: "station";
};

export type QueueItem = Omit<
  Extract<PlayingMedia, { type: "song"; }>,
  "type" | "sid"
>;

export type PlayingStationOption = {
  play: Array<{
    id: typeof Options.ThumbsUp | typeof Options.ThumbsDown | typeof Options.AddToHEOSFavorites;
    name: string;
  }>;
};

export type BrowseOption = {
  browse: Array<{
    id: Options;
    name: string;
    scid?: SearchCriteria;
  }>;
};

export type QuickselectInfo = {
  id: QuickselectId;
  name: string;
};

export type GroupMemberInfo = {
  name: string;
  pid: PlayerId;
  role: Role;
};

export type GroupInfo = {
  gid: GroupId;
  name: string;
  players: Array<GroupMemberInfo>;
};

export type MusicSourceData = {
  image_url: string;
  name: string;
  sid: MusicSource;
  type: MusicSourceType;
};

export type BrowseOtherEntry = {
  image_url: string;
  mid: MediaId;
  name: string;
  playable: YesNo;
  type: Exclude<MediaType, typeof MediaType.Album | typeof MediaType.Song>;
};

export type BrowseAlbumEntry = {
  artist: string;
  image_url: string;
  mid: MediaId;
  name: string;
  playable: YesNo;
  type: typeof MediaType.Album;
};

export type BrowseSongEntry = {
  album: string;
  artist: string;
  image_url: string;
  mid: MediaId;
  name: string;
  playable: YesNo;
  type: typeof MediaType.Song;
};

export type BrowseEntry = {
  album: string;
  artist: string;
  cid?: ContainerId;
  container: YesNo;
  image_url: string;
  mid: MediaId;
  name: string;
  playable: YesNo;
  sid?: MusicSource;
  type: MusicSourceType | MediaType;
};

export type MusicSourceInfo = {
  available?: "true" | "false";
  image_url: string;
  name: string;
  service_username?: string;
  sid: MusicSource;
  type: MusicSourceType;
};

export type SearchCriteriaInfo = {
  cid?: `SEARCHED_TRACKS-${string}`;
  name: string;
  playable?: YesNo;
  scid: SearchCriteria;
  wildcard: YesNo;
};

type Length<T extends unknown[]> = T extends { length: infer L extends number; } ? L : never;
type BuildTuple<L extends number, T extends unknown[] = []> = T extends {
  length: L;
}
  ? T
  : BuildTuple<L, [...T, unknown]>;
type Inc<A extends number> = Length<[...BuildTuple<A>, unknown]>;
export type CommaSeparatedList<
  T extends string | number,
  Min extends number = 1,
  Max extends number | undefined = undefined
> = Max extends undefined
  ? `${T}_${Min},${T}_${Inc<Min>},...`
  : `${T}_${Min},${T}_${Inc<Min>},...,${T}_${Max}`;

export type OptionalString<T extends string> = T | "";