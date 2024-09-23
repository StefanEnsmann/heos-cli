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

import { PlayerCommand } from "./util/commands.js";
import type { FirmwareVersion, OnOff, PlayState, RepeatMode } from "./util/constants.js";
import type { PlayMode, PlayerId, PlayerInfo, PlayingMedia, QueueId, QueueItem, QuickselectId, QuickselectInfo } from "./util/types.js";
import ConnectionWithSystemCommands from "./withSystemCommands.js";

/**
 * Builds upon {@link ConnectionWithSystemCommands} and implements player level HEOS commands
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class ConnectionWithPlayerCommands extends ConnectionWithSystemCommands {
  getPlayers(): Promise<Array<PlayerInfo>> {
    return this.send(PlayerCommand.GetPlayers);
  }

  getPlayerInfo(pid: PlayerId): Promise<PlayerInfo> {
    return this.send(PlayerCommand.GetPlayerInfo, { pid });
  }

  getPlayState(pid: PlayerId): Promise<PlayState> {
    return this.send(PlayerCommand.GetPlayState, { pid });
  }

  setPlayState(pid: PlayerId, state: PlayState): Promise<void> {
    return this.send(PlayerCommand.SetPlayState, { pid, state });
  }

  getNowPlayingMedia(pid: PlayerId): Promise<PlayingMedia> {
    return this.send(PlayerCommand.GetNowPlayingMedia, { pid });
  }

  getPlayerVolume(pid: PlayerId): Promise<number> {
    return this.send(PlayerCommand.GetVolume, { pid });
  }

  setPlayerVolume(pid: PlayerId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error('Step value needs to be between 1 and 100!');
    }
    return this.send(PlayerCommand.SetVolume, { pid, level });
  }

  playerVolumeUp(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(PlayerCommand.VolumeUp, { pid, step });
  }

  playerVolumeDown(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(PlayerCommand.VolumeDown, { pid, step });
  }

  getPlayerMute(pid: PlayerId): Promise<boolean> {
    return this.send(PlayerCommand.GetMute, { pid });
  }

  setPlayerMute(pid: PlayerId, state: OnOff): Promise<void> {
    return this.send(PlayerCommand.SetMute, { pid, state });
  }

  togglePlayerMute(pid: PlayerId): Promise<void> {
    return this.send(PlayerCommand.ToggleMute, { pid });
  }

  getPlayMode(pid: PlayerId): Promise<PlayMode> {
    return this.send(PlayerCommand.GetPlayMode, { pid });
  }

  setPlayMode(pid: PlayerId, repeat: RepeatMode, shuffle: OnOff): Promise<void> {
    return this.send(PlayerCommand.SetPlayMode, { pid, repeat, shuffle });
  }

  getQueue(pid: PlayerId, from: number = 0, count: number = 25): Promise<Array<QueueItem>> {
    if (from < 0) {
      throw new Error('Start index must be greater or equal to 0!');
    }
    if (count < 1 || count > 100) {
      throw new Error('Number of entries must be between 1 and 100!');
    }
    return this.send(PlayerCommand.GetQueue, { pid, range: [from, from + count - 1] });
  }

  playQueueItem(pid: PlayerId, qid: QueueId): Promise<void> {
    if (qid < 1) {
      throw new Error('Queue ID must be greater or equal to 1!');
    }
    return this.send(PlayerCommand.PlayQueue, { pid, qid });
  }

  removeFromQueue(pid: PlayerId, qid: Array<QueueId>): Promise<void> {
    if (qid.length < 1) {
      throw new Error('You must remove at least one queue item!');
    }
    qid.forEach((item) => {
      if (item < 1) {
        throw new Error('Queue ID must be greater or equal to 1!');
      }
    });
    return this.send(PlayerCommand.RemoveFromQueue, { pid, qid });
  }

  saveQueue(pid: PlayerId, name: string): Promise<void> {
    if (name.length > 128) {
      throw new Error('A playlist name can have a maximum of 128 characters!');
    }
    return this.send(PlayerCommand.SaveQueue, { pid, name });
  }

  clearQueue(pid: PlayerId): Promise<void> {
    return this.send(PlayerCommand.ClearQueue, { pid });
  }

  moveQueueItems(pid: PlayerId, sqid: Array<QueueId>, dqid: QueueId): Promise<void> {
    if (sqid.length < 1) {
      throw new Error('You have to move at least one queue item!');
    }
    if (dqid < 1) {
      throw new Error('You can not move items higher than the first position!');
    }
    sqid.forEach((item) => {
      if (item < 1) {
        throw new Error('Queue ID must be greater or equal to 1!');
      }
    });
    return this.send(PlayerCommand.MoveQueueItem, { pid, sqid, dqid });
  }

  playNext(pid: PlayerId): Promise<void> {
    return this.send(PlayerCommand.PlayNext, { pid });
  }

  playPrevious(pid: PlayerId): Promise<void> {
    return this.send(PlayerCommand.PlayPrevious, { pid });
  }

  setQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.send(PlayerCommand.SetQuickselect, { pid, id });
  }

  playQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.send(PlayerCommand.PlayQuickselect, { pid, id });
  }

  getQuickselects(pid: PlayerId, id?: QuickselectId): Promise<Array<QuickselectInfo>> {
    return this.send(PlayerCommand.GetQuickselects, { pid, id });
  }

  /**
   * Checks, if a firmware update is available for a given player
   * 
   * @param pid The player ID to check
   * 
   * @returns {@link FirmwareVersion} indicating, if the given player can be updated
   */
  checkForFirmwareUpdate(pid: PlayerId): Promise<FirmwareVersion> {
    return this.send(PlayerCommand.CheckUpdate, { pid });
  }
}