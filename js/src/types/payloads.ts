import { Control, MusicSource, LineOut, MusicSourceType, Network, NonStation, Options, Station, SearchCriteria, Role, YesNo, MediaType } from "./constants"

export type PlayerId = number
export type GroupId = number
export type QueueId = number
export type CommaSeparatedList<T> = string // TODO: Figure out how to type this
export type QuickselectId = number
export type ContainerId = number
export type MediaId = number
export type SearchCriteriaId = number

export type PlayerInfo = {
  name: string
  pid: PlayerId
  gid: GroupId | undefined
  model: string
  version: string
  network: Network
  serial: string | undefined
} & ({
  lineout: LineOut.Variable
} | {
  lineout: LineOut.Fixed
  control: Control
})

export type PlayingMedia = {
  song: string
  album: string
  artist: string
  image_url: string
  mid: MediaId
  qid: QueueId
} & ({
  type: "song"
  album_id: string
  sid: NonStation
} | {
  type: "station"
  station: string
  sid: Station
})

export type QueueItem = Omit<Extract<PlayingMedia, {type: "song"}>, "type" | "sid">

export type PlayingStationOptions = [
  {
    play: [
      {
        id: Options.ThumbsUp | Options.ThumbsDown | Options.AddToHEOSFavorites
        name: string
      }
    ]
  }
]

export type BrowseOptions = [
  {
    browse: [
      {
        id: Options.CreateNewStation
        name: string
        scid: SearchCriteria
      } | {
        id: Exclude<Options, Options.CreateNewStation>
        name: string
      }
    ]
  }
]

export type QuickselectInfo = {
  id: QuickselectId
  name: string
}

export type GroupMemberInfo = {
  name: string
  pid: PlayerId
  role: Role
}

export type GroupInfo = {
  name: string
  gid: GroupId
  players: Array<GroupMemberInfo>
}

type MusicSourceData = {
  name: string
  image_url: string
  type: MusicSourceType
  sid: MusicSource
}

type BrowseOtherEntry = {
  playable: YesNo
  name: string
  image_url: string
  mid: MediaId
  type: Exclude<MediaType, MediaType.Album | MediaType.Song>
}

type BrowseAlbumEntry = {
  playable: YesNo
  name: string
  image_url: string
  mid: MediaId
  type: MediaType.Album
  artist: string
}

type BrowseSongEntry = {
  playable: YesNo
  name: string
  image_url: string
  mid: MediaId
  type: MediaType.Song
  artist: string
  album: string
}

export type BrowseEntry =
  | MusicSourceData
  | ((BrowseOtherEntry | BrowseAlbumEntry | BrowseSongEntry) & (
    {
      container: YesNo.Yes
      cid: ContainerId
    } | {
      container: YesNo.No
    }
  ))

export type MusicSourceInfo = MusicSourceData & ({
  available: true
  service_username: string
} | {
  available: false
})

export type SearchCriteriaInfo = {
  name: string
  scid: SearchCriteria
  wildcard: YesNo
} | {
  name: string
  scid: SearchCriteria
  wildcard: YesNo
  playable: YesNo
  cid: `SEARCHED_TRACKS-${string}`
}
