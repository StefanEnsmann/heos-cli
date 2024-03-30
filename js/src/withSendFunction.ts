import { constants } from "buffer";
import type { Socket } from "net";
import type { Connection } from "./index.js";
import type { Command } from "./util/commands.js";
import { ConnectionStatus, On, SignedIn } from "./util/constants.js";
import { parseMessage, type ErrorMessage, type Query } from "./util/messages.js";
import { isCheckAccountResponse, isCheckUpdateResponse, isClearQueueResponse, isCommandUnderProcessResponse, isEventResponse, isFailedResponse, isGetGroupMuteResponse, isGetGroupsResponse, isGetGroupVolumeResponse, isGetMusicSourcesResponse, isGetNowPlayingMediaResponse, isGetPlayerInfoResponse, isGetPlayerMuteResponse, isGetPlayersResponse, isGetPlayerVolumeResponse, isGetPlayModeResponse, isGetPlayStateResponse, isGetQueueResponse, isGetQuickselectsResponse, isGroupsChangedResponse, isGroupVolumeDownResponse, isGroupVolumeUpResponse, isHeartBeatResponse, isMoveQueueItemResponse, isPlayersChangedResponse, isPlayerVolumeDownResponse, isPlayerVolumeUpResponse, isPlayNextResponse, isPlayPreviousResponse, isPlayQueueResponse, isPlayQuickselectResponse, isRebootResponse, isRegisterForChangeEventsResponse, isRemoveFromQueueResponse, isSaveQueueResponse, isSetGroupMuteResponse, isSetGroupResponse, isSetGroupVolumeResponse, isSetPlayerMuteResponse, isSetPlayerVolumeResponse, isSetPlayModeResponse, isSetPlayStateResponse, isSetQuickselectResponse, isSignInResponse, isSignOutResponse, isSourcesChangedResponse, isToggleGroupMuteResponse, isTogglePlayerMuteResponse, type Response } from "./util/responses.js";
import type { PromiseReject, PromiseResolve } from "./util/types.js";
import ConnectionWithListeners from "./withListeners.js";

type CommandCache = {
  command: Command;
  resolve: PromiseResolve<never>;
  reject: PromiseReject<ErrorMessage>;
  buffer: Buffer | null;
};

export default class ConnectionWithSendFunction extends ConnectionWithListeners {
  protected currentCommand: CommandCache | null = null;
  protected currentEventCommand: CommandCache | null = null;

  protected initSockets(resolve: PromiseResolve<Connection>, reject: PromiseReject<Error>): void {
    this.status = ConnectionStatus.Connecting;
    this.commandSocket = this.createSocket(this.handleCommandData, reject, () => {
      console.log('Command socket connected!');
      this.eventSocket = this.createSocket(this.handleEventData, reject, () => {
        console.log('Event socket connected!');
        this.status = ConnectionStatus.Connected;
        resolve(this as unknown as Connection);
      });
    });
  }

  protected resolveCommandPromise(response: Response): void {
    let currentCommand = null;
    if (isEventResponse(response)) {
      if (!this.currentEventCommand) {
        console.error('No command data for incoming event response!');
        return;
      }
      currentCommand = this.currentEventCommand;
      this.currentEventCommand = null;
    } else {
      if (isCommandUnderProcessResponse(response)) {
        console.log('Command under process!');
        return;
      }

      if (!this.currentCommand) {
        console.error('No command data for incoming command response!');
        return;
      }
      currentCommand = this.currentCommand;
      this.currentCommand = null;

      if (isFailedResponse(response)) {
        currentCommand.reject(parseMessage(response) as ErrorMessage);
        return;
      }
    }

    this.handleResponse(response, [currentCommand.resolve]);
  }

  protected handleCommandData(data: Buffer): void {
    if (!this.currentCommand) {
      console.error('No command data for incoming command response!');
      return;
    }

    const buffer = this.currentCommand.buffer
      ? Buffer.concat([this.currentCommand.buffer, data])
      : data;

    if (data.subarray(data.length - 2).toString() !== '\r\n') {
      this.currentCommand.buffer = buffer;
      return;
    }

    if (buffer.length > constants.MAX_STRING_LENGTH) {
      console.error('MAX STRING LENGTH EXCEEDED!', buffer.length, constants.MAX_STRING_LENGTH);
      return;
    }

    this.resolveCommandPromise(JSON.parse(buffer.toString()) as Response);
  }

  protected handleEventData(data: Buffer): void {
    data.toString().split('\r\n')
      .filter((part: string) => part.trim().length > 0)
      .forEach((part: string) => {
        const response = JSON.parse(part) as Response;
        if (isEventResponse(response)) {
          const callbackSet = this.callbacks.get(response.heos.command);
          if (!callbackSet) {
            return;
          }

          this.handleResponse(response, Array.from(callbackSet));
        } else if (isRegisterForChangeEventsResponse(response)) {
          this.resolveCommandPromise(response);
        } else {
          console.error("Unknown response type in event socket", response);
        }
      });
  }

  protected handleResponse(response: Response, callbacks: Array<CallableFunction>): void {
    const args = this.getCallbackArguments(response);
    callbacks.forEach((func) => {
      func(...args);
    });
  }

  protected getCallbackArguments(response: Response): Array<unknown> {
    const message = parseMessage(response);
    //     case Event.PlayerStateChanged:
    // func(message.pid, message.state);
    // break;
    //     case Event.PlayerNowPlayingChanged:
    //     case Event.PlayerQueueChanged:
    // func(message.pid);
    // break;
    //     case Event.PlayerNowPlayingProgress:
    // func(message.pid, message.cur_pos, message.duration);
    // break;
    //     case Event.PlayerPlaybackError:
    // func(message.pid, message.error);
    // break;
    //     case Event.PlayerVolumeChanged:
    // func(message.pid, message.level, message.mute === On);
    // break;
    //     case Event.RepeatModeChanged:
    // func(message.pid, message.repeat);
    // break;
    //     case Event.ShuffleModeChanged:
    // func(message.pid, message.shuffle === On);
    // break;
    //     case Event.GroupVolumeChanged:
    // func(message.gid, message.level, message.mute === On);
    // break;
    //     case Event.UserChanged:
    // func(message.fragment === SignedIn ? message.un : null);
    // break;
    //     default:
    // throw new Error('Can not extract payload from unknown event!');
    switch (true) {
      case isSignInResponse(response):
      case isSignOutResponse(response):
      case isHeartBeatResponse(response):
      case isRebootResponse(response):
      case isSetPlayStateResponse(response):
      case isSetPlayerVolumeResponse(response):
      case isPlayerVolumeUpResponse(response):
      case isPlayerVolumeDownResponse(response):
      case isSetPlayerMuteResponse(response):
      case isTogglePlayerMuteResponse(response):
      case isSetPlayModeResponse(response):
      case isPlayQueueResponse(response):
      case isRemoveFromQueueResponse(response):
      case isSaveQueueResponse(response):
      case isClearQueueResponse(response):
      case isMoveQueueItemResponse(response):
      case isPlayNextResponse(response):
      case isPlayPreviousResponse(response):
      case isSetQuickselectResponse(response):
      case isPlayQuickselectResponse(response):
      case isSetGroupVolumeResponse(response):
      case isGroupVolumeUpResponse(response):
      case isGroupVolumeDownResponse(response):
      case isSetGroupMuteResponse(response):
      case isToggleGroupMuteResponse(response):
      case isSourcesChangedResponse(response):
      case isPlayersChangedResponse(response):
      case isGroupsChangedResponse(response):
        return [];
      case isRegisterForChangeEventsResponse(response):
        return [message.enable === On];
      case isCheckAccountResponse(response):
        return [message.fragment === SignedIn ? message.un : null];
      case isGetPlayersResponse(response):
      case isGetPlayerInfoResponse(response):
      case isGetNowPlayingMediaResponse(response):
      case isGetQueueResponse(response):
      case isGetQuickselectsResponse(response):
      case isGetGroupsResponse(response):
      case isGetMusicSourcesResponse(response):
        return [response.payload];
      case isGetPlayStateResponse(response):
        return [message.state];
      case isGetPlayerVolumeResponse(response):
      case isGetGroupVolumeResponse(response):
        return [message.level];
      case isGetPlayerMuteResponse(response):
      case isGetGroupMuteResponse(response):
        return [message.state === On];
      case isGetPlayModeResponse(response):
        return [{
          repeat: message.repeat,
          shuffle: message.shuffle === On,
        }];
      case isCheckUpdateResponse(response):
        return [response.payload.update];
      case isSetGroupResponse(response):
        return message.gid !== undefined ? [message] : [];
      default:
        console.error('Unknown response type', response);
    }

    return [];
  }

  protected send<T>(command: Command, query: Query = {}, socket: Socket | null = this.commandSocket): Promise<T> {
    if (socket === null) {
      throw new Error('Requested socket is not ready!');
    }

    const isEventSocket = socket !== this.eventSocket;
    if (!isEventSocket && this.currentCommand || isEventSocket && this.currentEventCommand) {
      throw new Error('There is another command pending!');
    }

    return new Promise<T>((resolve, reject) => {
      const commandCache = {
        command,
        resolve,
        reject,
        buffer: null
      };

      if (isEventSocket) {
        this.currentEventCommand = commandCache;
      } else {
        this.currentCommand = commandCache;
      }

      const queryString =
        Object.keys(query).length === 0 ? ''
          : '?' + Object.entries(query)
            .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
            .reduce((previous, current) => `${previous}&${current}`);

      socket.write(['heos://', command, queryString, '\r\n'].join(''));
    });
  }
}