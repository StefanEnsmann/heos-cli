import {
  SignedOut,
  type OnOff,
  type PlayState,
  type RepeatMode,
  SignedIn,
} from "./constants.js";
import type { PID } from "./responses/base.js";
import type { GroupId } from "./types.js";

export const Event = {
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

export type Event = (typeof Event)[keyof typeof Event];

type BaseEventResponse<
  E extends Event,
  Message extends string | undefined = undefined
> = Message extends undefined
  ? {
      heos: {
        command: E;
      };
    }
  : {
      heos: {
        command: E;
        message: Message;
      };
    };

export type SourcesChanged = BaseEventResponse<typeof Event.SourcesChanged>;

export type PlayersChanged = BaseEventResponse<typeof Event.PlayersChanged>;

export type GroupsChanged = BaseEventResponse<typeof Event.GroupsChanged>;

export type PlayerStateChanged = BaseEventResponse<
  typeof Event.PlayerStateChanged,
  `${PID}&state=${PlayState}`
>;

export type PlayerNowPlayingChanged = BaseEventResponse<
  typeof Event.PlayerNowPlayingChanged,
  PID
>;

export type PlayerNowPlayingProgress = BaseEventResponse<
  typeof Event.PlayerNowPlayingProgress,
  `${PID}&cur_pos=${number}&duration=${number}`
>;

export type PlayerPlaybackError = BaseEventResponse<
  typeof Event.PlayerPlaybackError,
  `${PID}&error=${string}`
>;

export type PlayerQueueChanged = BaseEventResponse<
  typeof Event.PlayerQueueChanged,
  PID
>;

export type PlayerVolumeChanged = BaseEventResponse<
  typeof Event.PlayerVolumeChanged,
  `${PID}&level=${number}&mute=${OnOff}`
>;

export type RepeatModeChanged = BaseEventResponse<
  typeof Event.RepeatModeChanged,
  `${PID}&repeat=${RepeatMode}`
>;

export type ShuffleModeChanged = BaseEventResponse<
  typeof Event.ShuffleModeChanged,
  `${PID}&shuffle=${OnOff}`
>;

export type GroupVolumeChanged = BaseEventResponse<
  typeof Event.GroupVolumeChanged,
  `gid=${GroupId}&level=${number}&mute=${OnOff}`
>;

export type UserChanged = BaseEventResponse<
  typeof Event.UserChanged,
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
