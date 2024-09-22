/**
 * @license
 * Copyright (c) 2024 Stefan Ensmann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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