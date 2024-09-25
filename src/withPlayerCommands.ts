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
  /**
   * Gets information about all connected HEOS players
   * 
   * @returns A list of all HEOS players in the local network
   * 
   * @category Player Commands
   */
  getPlayers(): Promise<Array<PlayerInfo>> {
    return this.send(PlayerCommand.GetPlayers);
  }

  /**
   * Gets information about a specific HEOS player
   * 
   * @param pid The player ID
   * 
   * @returns Information about the given player
   * 
   * @category Player Commands
   */
  getPlayerInfo(pid: PlayerId): Promise<PlayerInfo> {
    return this.send(PlayerCommand.GetPlayerInfo, { pid });
  }

  /**
   * Returns the current play state of a given player
   * 
   * @param pid The player ID
   * 
   * @returns Play state of the given player
   * 
   * @category Player Commands
   */
  getPlayState(pid: PlayerId): Promise<PlayState> {
    return this.send(PlayerCommand.GetPlayState, { pid });
  }

  /**
   * Sets the play state of a given player
   * 
   * @param pid The player ID
   * @param state The play state to transition this player to
   * 
   * @category Player Commands
   */
  setPlayState(pid: PlayerId, state: PlayState): Promise<void> {
    return this.send(PlayerCommand.SetPlayState, { pid, state });
  }

  /**
   * Returns information about the media playing on a specific player
   * 
   * @param pid The player ID
   * 
   * @returns Media information
   * 
   * @category Player Commands
   */
  getNowPlayingMedia(pid: PlayerId): Promise<PlayingMedia> {
    return this.send(PlayerCommand.GetNowPlayingMedia, { pid });
  }

  /**
   * Returns the current volume of a specific player (regardless of group volume)
   * 
   * @param pid The player ID
   * 
   * @returns The volume between 0 and 100
   * 
   * @category Player Commands
   */
  getPlayerVolume(pid: PlayerId): Promise<number> {
    return this.send(PlayerCommand.GetVolume, { pid });
  }

  /**
   * Sets the volume of a specific player. Changes group volume value, if this is the loudest player
   * 
   * @param pid The player ID
   * @param level The volume the player should be set to between 1 and 100
   * 
   * @category Player Commands
   */
  setPlayerVolume(pid: PlayerId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error('Volume needs to be between 1 and 100!');
    }
    return this.send(PlayerCommand.SetVolume, { pid, level });
  }

  /**
   * Increases the volume of a specific player
   * 
   * @param pid The player ID
   * @param step The step size between 1 and 10
   * 
   * @category Player Commands
   */
  playerVolumeUp(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(PlayerCommand.VolumeUp, { pid, step });
  }

  /**
   * Decreases the volume of a specific player
   * 
   * @param pid The player ID
   * @param step The step size between 1 and 10
   * 
   * @category Player Commands
   */
  playerVolumeDown(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(PlayerCommand.VolumeDown, { pid, step });
  }

  /**
   * Returns the current mute state of a specific player
   * 
   * @param pid The player ID
   * 
   * @returns If the player is currently muted
   * 
   * @category Player Commands
   */
  getPlayerMute(pid: PlayerId): Promise<boolean> {
    return this.send(PlayerCommand.GetMute, { pid });
  }

  /**
   * Sets the current mute state of a specific player
   * 
   * @param pid The player ID
   * @param state String indicating, if the player should be muted
   * 
   * @category Player Commands
   */
  setPlayerMute(pid: PlayerId, state: OnOff): Promise<void> {
    return this.send(PlayerCommand.SetMute, { pid, state });
  }

  /**
   * Toggles the current mute state of a specific player
   * 
   * @param pid The player ID
   * 
   * @category Player Commands
   */
  togglePlayerMute(pid: PlayerId): Promise<void> {
    return this.send(PlayerCommand.ToggleMute, { pid });
  }

  /**
   * Returns the current play mode of a specific player
   * 
   * @param pid The player ID
   * 
   * @returns The current play mode of the given player
   * 
   * @category Player Commands
   */
  getPlayMode(pid: PlayerId): Promise<PlayMode> {
    return this.send(PlayerCommand.GetPlayMode, { pid });
  }

  /**
   * Set the play mode of a specific player
   * 
   * @param pid The player ID
   * @param repeat If and how the queue should be repeated
   * @param shuffle If the queue should be shuffled
   * 
   * @category Player Commands
   */
  setPlayMode(pid: PlayerId, repeat: RepeatMode, shuffle: OnOff): Promise<void> {
    return this.send(PlayerCommand.SetPlayMode, { pid, repeat, shuffle });
  }

  /**
   * Returns a section of the current HEOS queue
   * 
   * @param pid The player ID
   * @param from The start index of the section beginning at 0
   * @param count The size of the section between 1 and 100
   * 
   * @returns A list of queue items
   * 
   * @category Player Commands
   */
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
   * @returns String indicating, if the given player can be updated
   * 
   * @category Player Commands
   */
  checkForFirmwareUpdate(pid: PlayerId): Promise<FirmwareVersion> {
    return this.send(PlayerCommand.CheckUpdate, { pid });
  }
}