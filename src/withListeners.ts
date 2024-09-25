import type { PlayState, RepeatMode } from "./util/constants.js";
import type { Event } from "./util/events.js";
import type { GroupId, PlayerId } from "./util/types.js";
import ConnectionWithSockets from "./withSockets.js";

/**
 * Builds upon {@link ConnectionWithSockets} and enables listener registration for HEOS events
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class ConnectionWithListeners extends ConnectionWithSockets {
  /**
   * Maps HEOS event types to a set of event listeners
   * 
   * @category Event Handling
   */
  protected callbacks: Map<Event, Set<CallableFunction>> = new Map<Event, Set<CallableFunction>>();

  /**
   * @overload
   * 
   * @param event Emitted when the available sources have changed
   * 
   * @category Event Handling
   */
  on(event: typeof Event.SourcesChanged, listener: () => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the players have changed
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayersChanged, listener: () => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the group configuration has changed
   * 
   * @category Event Handling
   */
  on(event: typeof Event.GroupsChanged, listener: () => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the state of a player has changed
   * @param listener Called with the player ID and the new play state
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerStateChanged, listener: (pid: PlayerId, state: PlayState) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the queue of a player has changed
   * @param listener Called with the player ID
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerQueueChanged, listener: (pid: PlayerId) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the currently played media has changed
   * @param listener Called with the player ID
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerNowPlayingChanged, listener: (pid: PlayerId) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted on every playback progress tick (approx. every 5 seconds)
   * @param listener Called with the player ID, the current position in milliseconds and the total duration
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerNowPlayingProgress, listener: (pid: PlayerId, cur_pos: number, duration: number) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when a playback error occured
   * @param listener Called with the player ID and an error string
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerPlaybackError, listener: (pid: PlayerId, error: string) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the volume of a player has changed
   * @param listener Called with the player ID, the volume level and if the player is now muted
   * 
   * @category Event Handling
   */
  on(event: typeof Event.PlayerVolumeChanged, listener: (pid: PlayerId, level: number, mute: boolean) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the repeat mode of a player has changed
   * @param listener Called with the player ID and the current repeat mode
   * 
   * @category Event Handling
   */
  on(event: typeof Event.RepeatModeChanged, listener: (pid: PlayerId, repeat: RepeatMode) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the shuffle mode of a player has changed
   * @param listener Called with the player ID and if the queue is currently shuffled
   * 
   * @category Event Handling
   */
  on(event: typeof Event.ShuffleModeChanged, listener: (pid: PlayerId, shuffle: boolean) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the volume of a group has changed
   * @param listener Called with the group ID, the volume level and if the group is now muted
   * 
   * @category Event Handling
   */
  on(event: typeof Event.GroupVolumeChanged, listener: (gid: GroupId, level: number, mute: boolean) => void): ConnectionWithListeners;

  /**
   * @overload
   * 
   * @param event Emitted when the logged in user has changed
   * @param listener Called with the new username or null, if no user is logged in
   * 
   * @category Event Handling
   */
  on(event: typeof Event.UserChanged, listener: (username: string | null) => void): ConnectionWithListeners;

  /**
   * Registers an event listener for the given HEOS event
   * 
   * @param event The HEOS event to listen to
   * @param listener The callback to execute when this event is fired
   * 
   * @category Event Handling
   */
  on(event: Event, listener: (...args: never[]) => void): ConnectionWithListeners {
    let callbackSet = this.callbacks.get(event);

    if (!callbackSet) {
      callbackSet = new Set<CallableFunction>();
      this.callbacks.set(event, callbackSet);
    }

    callbackSet.add(listener);

    return this;
  }
}