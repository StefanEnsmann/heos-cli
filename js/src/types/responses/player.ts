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
  FailableResponse,
  FailableResponseWithPayload,
  FailableResponseWithPayloadAndOptions,
  PID,
} from "./base.js";

export type GetPlayers = FailableResponseWithPayload<
  typeof Player.GetPlayers,
  "",
  Array<PlayerInfo>
>;
export type GetPlayerInfo = FailableResponseWithPayload<
  typeof Player.GetPlayerInfo,
  PID,
  PlayerInfo
>;
export type GetPlayState = FailableResponse<
  typeof Player.GetPlayState,
  `${PID}&state=${PlayState}`
>;
export type SetPlayState = FailableResponse<
  typeof Player.SetPlayState,
  `${PID}&state=${PlayState}`
>;
export type GetNowPlayingMedia =
  | FailableResponseWithPayload<
      typeof Player.GetNowPlayingMedia,
      PID,
      Extract<PlayingMedia, { type: "song" }>
    >
  | FailableResponseWithPayloadAndOptions<
      typeof Player.GetNowPlayingMedia,
      PID,
      Extract<PlayingMedia, { type: "station" }>,
      PlayingStationOptions
    >;
export type GetVolume = FailableResponse<
  typeof Player.GetVolume,
  `${PID}&level=${number}`
>;
export type SetVolume = FailableResponse<
  typeof Player.GetVolume,
  `${PID}&level=${number}`
>;
export type VolumeUp = FailableResponse<
  typeof Player.VolumeUp,
  `${PID}&step=${number}`
>;
export type VolumeDown = FailableResponse<
  typeof Player.VolumeDown,
  `${PID}&step=${number}`
>;
export type GetMute = FailableResponse<
  typeof Player.GetMute,
  `${PID}&state=${OnOff}`
>;
export type SetMute = FailableResponse<
  typeof Player.SetMute,
  `${PID}&state=${OnOff}`
>;
export type ToggleMute = FailableResponse<typeof Player.ToggleMute, PID>;
export type GetPlayMode = FailableResponse<
  typeof Player.GetPlayMode,
  `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`
>;
export type SetPlayMode = FailableResponse<
  typeof Player.SetPlayMode,
  `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`
>;
export type GetQueue = FailableResponseWithPayload<
  typeof Player.GetQueue,
  PID | `${PID}&range=${number},${number}`,
  Array<QueueItem>
>;
export type PlayQueue = FailableResponse<
  typeof Player.PlayQueue,
  `${PID}&qid=${QueueId}`
>;
export type RemoveFromQueue = FailableResponse<
  typeof Player.RemoveFromQueue,
  `${PID}&qid=${CommaSeparatedList<QueueId>}`
>; // No typing possible for comma separated list
export type SaveQueue = FailableResponse<
  typeof Player.SaveQueue,
  `${PID}&name=${string}`
>;
export type ClearQueue = FailableResponse<typeof Player.ClearQueue, PID>;
export type MoveQueueItem = FailableResponse<
  typeof Player.MoveQueueItem,
  `${PID}&sqid=${CommaSeparatedList<QueueId>}&dqid=${QueueId}`
>;
export type PlayNext = FailableResponse<typeof Player.PlayNext, PID>;
export type PlayPrevious = FailableResponse<typeof Player.PlayPrevious, PID>;
export type SetQuickselect = FailableResponse<
  typeof Player.SetQuickselect,
  `${PID}$id=${QuickselectId}`
>;
export type PlayQuickselect = FailableResponse<
  typeof Player.PlayQuickselect,
  `${PID}&id=${QuickselectId}`
>;
export type GetQuickselects = FailableResponseWithPayload<
  typeof Player.GetQuickselects,
  PID,
  Array<QuickselectInfo>
>;
export type CheckUpdate = FailableResponseWithPayload<
  typeof Player.CheckUpdate,
  PID,
  { update: FirmwareVersion }
>;
