import { Control, LineOut, Network, NonStation, Options, Station } from "./constants"

export type PlayerId = number
export type QueueId = number
export type CommaSeparatedList = string
export type QuickselectId = number

export type PlayerInfo = {
  name: string
  pid: string
  gid: string | undefined
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
  mid: string
  qid: QueueId
} & ({
  type: 'song'
  album_id: string
  sid: NonStation
} | {
  type: 'station'
  station: string
  sid: Station
})

export type QueueItem = Omit<Extract<PlayingMedia, {type: 'song'}>, 'type' | 'sid'>

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

export type QuickselectInfo = {
  id: QuickselectId
  name: string
}
