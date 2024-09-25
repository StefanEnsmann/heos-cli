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
   */
  protected callbacks: Map<Event, Set<CallableFunction>> = new Map<Event, Set<CallableFunction>>();

  /**
   * Registers an event listener for the given HEOS event
   * 
   * @param event The HEOS event to listen to
   * @param listener The callback to execute when this event is fired
   * 
   * @category Event Handling
   */
  on(event: typeof Event.SourcesChanged, listener: () => void): ConnectionWithListeners;
  on(event: typeof Event.PlayersChanged, listener: () => void): ConnectionWithListeners;
  on(event: typeof Event.GroupsChanged, listener: () => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerStateChanged, listener: (pid: PlayerId, state: PlayState) => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerQueueChanged, listener: (pid: PlayerId) => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerNowPlayingChanged, listener: (pid: PlayerId) => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerNowPlayingProgress, listener: (pid: PlayerId, cur_pos: number, duration: number) => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerPlaybackError, listener: (pid: PlayerId, error: string) => void): ConnectionWithListeners;
  on(event: typeof Event.PlayerVolumeChanged, listener: (pid: PlayerId, level: number, mute: boolean) => void): ConnectionWithListeners;
  on(event: typeof Event.RepeatModeChanged, listener: (pid: PlayerId, repeat: RepeatMode) => void): ConnectionWithListeners;
  on(event: typeof Event.ShuffleModeChanged, listener: (pid: PlayerId, shuffle: boolean) => void): ConnectionWithListeners;
  on(event: typeof Event.GroupVolumeChanged, listener: (gid: GroupId, level: number, mute: boolean) => void): ConnectionWithListeners;
  on(event: typeof Event.UserChanged, listener: (username: string | null) => void): ConnectionWithListeners;
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