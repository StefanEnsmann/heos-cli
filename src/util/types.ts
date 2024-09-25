import type { BuiltinMusicSource, Control, LineOut, MediaType, MusicSourceType, Network, Option, Role, SearchCriteria, YesNo } from "./constants.js";
import type { Message } from "./messages.js";

/**
 * A resolve method created via a promise
 * @typeParam T The response type expected on successful resolve
 */
export type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;

/**
 * A reject method created via a promise
 * @typeParam T The type of reason given when the promise is rejected
 */
export type PromiseReject<T = undefined> = (reason: T) => void;

/**
 * Networking information about a discovered HEOS device
 */
export type RoutingInfo = {
  /** The address of the HEOS device */
  address: string;
  /** The address family ('IPv4' or 'IPv6') */
  family: string;
  /** The sender port */
  port: number;
  /** The message size */
  size: number;
};

/**
 * The ID of a HEOS device. Will never change for a given physical device
 */
export type PlayerId = number;

/**
 * The ID of a group of HEOS devices. Will be the {@link PlayerId} of the master device
 */
export type GroupId = PlayerId;

/**
 * The index of an item in a HEOS queue
 */
export type QueueId = number;

/**
 * The ID of an album provided by a media server
 */
export type AlbumId = string;

/**
 * The ID of a device quickselect
 */
export type QuickselectId = number;

/**
 * The ID of a media container provided by a music source
 */
export type ContainerId = string;

/**
 * The ID of a specific media file / stream provided by a music source
 */
export type MediaId = string;

/**
 * The ID of a specific music source
 */
export type SourceId = number;

/**
 * A music source that is not built-in into the HEOS system. Just for readibility in code
 */
export type CustomMusicSource = Exclude<SourceId, BuiltinMusicSource>;

/**
 * Any music source, be it built-in or not. Just for readability in code
 */
export type MusicSource = CustomMusicSource | BuiltinMusicSource;

/**
 * The current combination of repeat and shuffle modes
 */
export type PlayMode = Required<Pick<Message, "repeat" | "shuffle">>;

/**
 * Information about a specific player
 */
export type PlayerInfo = {
  /** The current control type of the player */
  control?: Control,
  /** The current group the player is in, if any */
  gid?: GroupId;
  /** The current volume mode of the player */
  lineout: LineOut,
  /** The model name of the HEOS device */
  model: string;
  /** The name given via the HEOS app */
  name: string;
  /** The connection type of the player */
  network: Network;
  /** The unique ID of the player */
  pid: PlayerId;
  /** The serial number of the player device */
  serial?: string;
  /** The firmware version of the player device */
  version: string;
};

/**
 * Information about the currently playing media
 */
export type PlayingMedia = {
  /** The album ID, if served from a music server */
  album_id?: AlbumId;
  /** The name of the album for the currently playing song */
  album: string;
  /** The name of the artist for the currently playing song */
  artist: string;
  /** The cover image for the currently playing song */
  image_url: string;
  /** The media ID of the currently playing song */
  mid: MediaId;
  /** The position of the currently playing media in the HEOS queue */
  qid: QueueId;
  /** The source ID this media is played from */
  sid: BuiltinMusicSource;
  /** The name of the currently playing song */
  song: string;
  /** The name of the currently playing station */
  station?: string;
  /** The type of the currently playing media */
  type: "song" | "station";
};

/**
 * Information about an entry in the HEOS queue
 */
export type QueueItem = {
  /** The album ID of the song */
  album_id: AlbumId;
  /** The name of the album for the song */
  album: string;
  /** The name of the artist for the song */
  artist: string;
  /** The cover image for the song */
  image_url: string;
  /** The media ID of the song */
  mid: MediaId;
  /** The position of the song in the HEOS queue */
  qid: QueueId;
  /** The name of the song */
  song: string;
};

export type PlayingStationOption = {
  play: Array<{
    id: typeof Option.ThumbsUp | typeof Option.ThumbsDown | typeof Option.AddToHEOSFavorites;
    name: string;
  }>;
};

export type BrowseOption = {
  browse: Array<{
    id: Option;
    name: string;
    scid?: SearchCriteria;
  }>;
};

/**
 * Information about a quickselect entry
 */
export type QuickselectInfo = {
  /** The ID of the quickselect entry */
  id: QuickselectId;
  /** The name of the quickselect entry given via the HEOS app */
  name: string;
};

/**
 * Information about a player inside of a group
 */
export type GroupMemberInfo = {
  /** The name of the player given via the HEOS app */
  name: string;
  /** The unique ID of the player */
  pid: PlayerId;
  /** The role of the player in this group */
  role: Role;
};

/**
 * Information about a group
 */
export type GroupInfo = {
  /** The unique ID of the group. Matches the master player in this group */
  gid: GroupId;
  /** The name of the group */
  name: string;
  /** The list of players in this group */
  players: Array<GroupMemberInfo>;
};

export type MusicSourceData = {
  image_url: string;
  name: string;
  sid: SourceId;
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
  sid?: SourceId;
  type: MusicSourceType | MediaType;
};

/**
 * Information about a specific music source
 */
export type MusicSourceInfo = {
  /** If this music source is available to the user */
  available?: "true" | "false";
  /** The logo image provided for this music source */
  image_url: string;
  /** The name of this music source */
  name: string;
  /** The username used for logging into the external service */
  service_username?: string;
  /** The unique ID of this music source */
  sid: SourceId;
  /** The type of this music source */
  type: MusicSourceType;
};

export type SearchCriteriaInfo = {
  cid?: `SEARCHED_TRACKS-${string}`;
  name: string;
  playable?: YesNo;
  scid: SearchCriteria;
  wildcard: YesNo;
};

/**
 * @internal Used for generating numbers in type annotations
 */
type Length<T extends unknown[]> = T extends { length: infer L extends number; } ? L : never;
/**
 * @internal Used for generating numbers in type annotations
 */
type BuildTuple<L extends number, T extends unknown[] = []> = T extends {
  length: L;
}
  ? T
  : BuildTuple<L, [...T, unknown]>;
/**
 * @internal Used for generating numbers in type annotations
 */
type Inc<A extends number> = Length<[...BuildTuple<A>, unknown]>;

/**
 * Indicates a comma separated list of arbitrary values
 */
export type CommaSeparatedList<
  T extends string | number,
  Min extends number = 1,
  Max extends number | undefined = undefined
> = Max extends undefined
  ? `${T}_${Min},${T}_${Inc<Min>},...`
  : `${T}_${Min},${T}_${Inc<Min>},...,${T}_${Max}`;

/**
 * A string that can also be empty
 */
export type OptionalString<T extends string> = T | "";