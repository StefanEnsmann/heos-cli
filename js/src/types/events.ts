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
