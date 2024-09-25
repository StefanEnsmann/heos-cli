/**
 * A list of possible unsolicited events sent by the HEOS system, if the client requested events to be sent.
 */
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

/**
 * Checks if a given string matches a HEOS event name
 * 
 * @param e The string to check
 * 
 * @returns If the given string matches a HEOS event
 */
export function isEvent(e: string): e is Event {
  return e.startsWith("event") && Object.values(Event as Record<string, string>).includes(e);
}