import {
  SignedOut,
  type OnOff,
  type PlayState,
  type RepeatMode,
  SignedIn,
} from "./constants.js";
import type { PID } from "./responses/base.js";
import type { GroupId } from "./types.js";

export const Events = {
  SourcesChanged: "event/sources_changed",
  PlayersChanged: "event/players_changed",
  GroupsChanged: "event/groups_changed",
  PlayerStateChanged: "event/player_state_changed",
  PlayerNowPlayingChanged: "event/player_now_playing_changed",
  PlayerNowPlayingProgress: "event/player_now_playing_progress",
  PlayerPlaybackError: "event/player_playback_error",
  PlayerQueueChanged: "event/player_queue_changed",
  PlayerVolumeChanged: "event/player_volume_changed",
  RepeatModeChanged: "event/repeat_mode_changed",
  ShuffleModeChanged: "event/shuffle_mode_changed",
  GroupVolumeChanged: "event/group_volume_changed",
  UserChanged: "event/user_changed",
} as const;

export type Events = (typeof Events)[keyof typeof Events];

type BaseEventResponse<
  Event extends Events,
  Message extends string | undefined = undefined
> = Message extends undefined
  ? {
      heos: {
        command: Event;
      };
    }
  : {
      heos: {
        command: Event;
        message: Message;
      };
    };

export type SourcesChanged = BaseEventResponse<typeof Events.SourcesChanged>;

export type PlayersChanged = BaseEventResponse<typeof Events.PlayersChanged>;

export type GroupsChanged = BaseEventResponse<typeof Events.GroupsChanged>;

export type PlayerStateChanged = BaseEventResponse<
  typeof Events.PlayerStateChanged,
  `${PID}&state=${PlayState}`
>;

export type PlayerNowPlayingChanged = BaseEventResponse<
  typeof Events.PlayerNowPlayingChanged,
  PID
>;

export type PlayerNowPlayingProgress = BaseEventResponse<
  typeof Events.PlayerNowPlayingProgress,
  `${PID}&cur_pos=${number}&duration=${number}`
>;

export type PlayerPlaybackError = BaseEventResponse<
  typeof Events.PlayerPlaybackError,
  PID
>;

export type PlayerQueueChanged = BaseEventResponse<
  typeof Events.PlayerQueueChanged,
  PID
>;

export type PlayerVolumeChanged = BaseEventResponse<
  typeof Events.PlayerVolumeChanged,
  `${PID}&level=${number}&mute=${OnOff}`
>;

export type RepeatModeChanged = BaseEventResponse<
  typeof Events.RepeatModeChanged,
  `${PID}&repeat=${RepeatMode}`
>;

export type ShuffleModeChanged = BaseEventResponse<
  typeof Events.ShuffleModeChanged,
  `${PID}&shuffle=${OnOff}`
>;

export type GroupVolumeChanged = BaseEventResponse<
  typeof Events.GroupVolumeChanged,
  `gid=${GroupId}&level=${number}&mute=${OnOff}`
>;

export type UserChanged = BaseEventResponse<
  typeof Events.UserChanged,
  `${typeof SignedIn}&un=${string}` | typeof SignedOut
>;

export type EventResponse =
  | SourcesChanged
  | PlayersChanged
  | GroupsChanged
  | PlayerStateChanged
  | PlayerNowPlayingChanged
  | PlayerNowPlayingProgress
  | PlayerPlaybackError
  | PlayerQueueChanged
  | PlayerVolumeChanged
  | RepeatModeChanged
  | ShuffleModeChanged
  | GroupVolumeChanged
  | UserChanged;
