import type { Player } from "../commands/player.js";
import type {
  FirmwareVersion,
  OnOff,
  PlayState,
  RepeatMode,
} from "../constants.js";
import type {
  PlayerInfo,
  PlayingMedia,
  PlayingStationOptions,
  QueueItem,
  QuickselectInfo,
} from "../payloads.js";
import type { CommaSeparatedList, QueueId, QuickselectId } from "../types.js";
import type {
  SuccessfulResponse,
  WithOptions,
  WithPayload,
  PID,
} from "./base.js";

export type GetPlayers = WithPayload<
  SuccessfulResponse<typeof Player.GetPlayers, "">,
  Array<PlayerInfo>
>;

export type GetPlayerInfo = WithPayload<
  SuccessfulResponse<typeof Player.GetPlayerInfo, PID>,
  PlayerInfo
>;

export type GetPlayState = SuccessfulResponse<
  typeof Player.GetPlayState,
  `${PID}&state=${PlayState}`
>;

export type SetPlayState = SuccessfulResponse<
  typeof Player.SetPlayState,
  `${PID}&state=${PlayState}`
>;

export type GetNowPlayingMedia =
  | WithPayload<
      SuccessfulResponse<typeof Player.GetNowPlayingMedia, PID>,
      Extract<PlayingMedia, { type: "song" }>
    >
  | WithOptions<
      WithPayload<
        SuccessfulResponse<typeof Player.GetNowPlayingMedia, PID>,
        Extract<PlayingMedia, { type: "station" }>
      >,
      PlayingStationOptions
    >;

export type GetVolume = SuccessfulResponse<
  typeof Player.GetVolume,
  `${PID}&level=${number}`
>;

export type SetVolume = SuccessfulResponse<
  typeof Player.SetVolume,
  `${PID}&level=${number}`
>;

export type VolumeUp = SuccessfulResponse<
  typeof Player.VolumeUp,
  `${PID}&step=${number}`
>;

export type VolumeDown = SuccessfulResponse<
  typeof Player.VolumeDown,
  `${PID}&step=${number}`
>;

export type GetMute = SuccessfulResponse<
  typeof Player.GetMute,
  `${PID}&state=${OnOff}`
>;

export type SetMute = SuccessfulResponse<
  typeof Player.SetMute,
  `${PID}&state=${OnOff}`
>;

export type ToggleMute = SuccessfulResponse<typeof Player.ToggleMute, PID>;

export type GetPlayMode = SuccessfulResponse<
  typeof Player.GetPlayMode,
  `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`
>;

export type SetPlayMode = SuccessfulResponse<
  typeof Player.SetPlayMode,
  `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`
>;

export type GetQueue = WithPayload<
  SuccessfulResponse<
    typeof Player.GetQueue,
    PID | `${PID}&range=${number},${number}`
  >,
  Array<QueueItem>
>;

export type PlayQueue = SuccessfulResponse<
  typeof Player.PlayQueue,
  `${PID}&qid=${QueueId}`
>;

export type RemoveFromQueue = SuccessfulResponse<
  typeof Player.RemoveFromQueue,
  `${PID}&qid=${CommaSeparatedList<QueueId>}`
>;

export type SaveQueue = SuccessfulResponse<
  typeof Player.SaveQueue,
  `${PID}&name=${string}`
>;

export type ClearQueue = SuccessfulResponse<typeof Player.ClearQueue, PID>;

export type MoveQueueItem = SuccessfulResponse<
  typeof Player.MoveQueueItem,
  `${PID}&sqid=${CommaSeparatedList<QueueId>}&dqid=${QueueId}`
>;

export type PlayNext = SuccessfulResponse<typeof Player.PlayNext, PID>;

export type PlayPrevious = SuccessfulResponse<typeof Player.PlayPrevious, PID>;

export type SetQuickselect = SuccessfulResponse<
  typeof Player.SetQuickselect,
  `${PID}$id=${QuickselectId}`
>;

export type PlayQuickselect = SuccessfulResponse<
  typeof Player.PlayQuickselect,
  `${PID}&id=${QuickselectId}`
>;

export type GetQuickselects = WithPayload<
  SuccessfulResponse<typeof Player.GetQuickselects, PID>,
  Array<QuickselectInfo>
>;

export type CheckUpdate = WithPayload<
  SuccessfulResponse<typeof Player.CheckUpdate, PID>,
  { update: FirmwareVersion }
>;

export type PlayerResponse =
  | GetPlayers
  | GetPlayerInfo
  | GetPlayState
  | SetPlayState
  | GetNowPlayingMedia
  | GetVolume
  | SetVolume
  | VolumeUp
  | VolumeDown
  | GetMute
  | SetMute
  | ToggleMute
  | GetPlayMode
  | SetPlayMode
  | GetQueue
  | PlayQueue
  | RemoveFromQueue
  | SaveQueue
  | ClearQueue
  | MoveQueueItem
  | PlayNext
  | PlayPrevious
  | SetQuickselect
  | PlayQuickselect
  | GetQuickselects
  | CheckUpdate;
