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

import { constants } from "buffer";
import type { Socket } from "net";
import type { Command } from "./util/commands.js";
import { ConnectionStatus, On, SignedIn } from "./util/constants.js";
import { parseMessage, type ErrorMessage, type Query } from "./util/messages.js";
import { isCheckAccountResponse, isCheckUpdateResponse, isClearQueueResponse, isCommandUnderProcessResponse, isEventResponse, isFailedResponse, isGetGroupMuteResponse, isGetGroupsResponse, isGetGroupVolumeResponse, isGetMusicSourcesResponse, isGetNowPlayingMediaResponse, isGetPlayerInfoResponse, isGetPlayerMuteResponse, isGetPlayersResponse, isGetPlayerVolumeResponse, isGetPlayModeResponse, isGetPlayStateResponse, isGetQueueResponse, isGetQuickselectsResponse, isGroupsChangedResponse, isGroupVolumeChangedResponse, isGroupVolumeDownResponse, isGroupVolumeUpResponse, isHeartBeatResponse, isMoveQueueItemResponse, isPlayerNowPlayingChangedResponse, isPlayerNowPlayingProgressResponse, isPlayerPlaybackErrorResponse, isPlayerQueueChangedResponse, isPlayersChangedResponse, isPlayerStateChangedResponse, isPlayerVolumeChangedResponse, isPlayerVolumeDownResponse, isPlayerVolumeUpResponse, isPlayNextResponse, isPlayPreviousResponse, isPlayQueueResponse, isPlayQuickselectResponse, isRebootResponse, isRegisterForChangeEventsResponse, isRemoveFromQueueResponse, isRepeatModeChangedResponse, isSaveQueueResponse, isSetGroupMuteResponse, isSetGroupResponse, isSetGroupVolumeResponse, isSetPlayerMuteResponse, isSetPlayerVolumeResponse, isSetPlayModeResponse, isSetPlayStateResponse, isSetQuickselectResponse, isShuffleModeChangedResponse, isSignInResponse, isSignOutResponse, isSourcesChangedResponse, isToggleGroupMuteResponse, isTogglePlayerMuteResponse, isUserChangedResponse, type CommandResponse, type Response, isGetGroupInfoResponse, isGetSourceInfoResponse, isGetSearchCriteriaResponse, isBrowseResponse, isSearchResponse } from "./util/responses.js";
import type { PromiseReject, PromiseResolve, RoutingInfo } from "./util/types.js";
import ConnectionWithListeners from "./withListeners.js";

/**
 * Stores required data to fully await a HEOS command response
 */
type CommandCache = {
  /** The command currently waiting for a response */
  command: Command;

  /** The resolve callback for the promise awaiting the response */
  resolve: PromiseResolve<never>;

  /** The reject callback for the promise awaiting the response */
  reject: PromiseReject<ErrorMessage>;

  /** The buffer holding all incoming data sections until the message is complete */
  buffer: Buffer | null;
};

/**
 * Builds upon {@link ConnectionWithListeners} and implements generic command sending functionality
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class ConnectionWithSendFunction extends ConnectionWithListeners {
  /**
   * The current command awaiting a response from the HEOS system transported through the command socket
   */
  protected currentCommand: CommandCache | null = null;

  /**
   * The current command awaiting a response from the HEOS system transported through the event socket
   */
  protected currentEventCommand: CommandCache | null = null;

  /**
   * Calls the parent constructor and sets the status to {@link ConnectionStatus.Connecting}
   * 
   * @param device The device to connect to
   */
  constructor(device: RoutingInfo) {
    super(device);
    this.status = ConnectionStatus.Connecting;
  }

  /**
   * Resolves or rejects a previously stored promise for command execution
   * 
   * @param response The full response send by the HEOS system
   */
  protected resolveCommandPromise(response: CommandResponse): void {
    let currentCommand = null;
    if (isRegisterForChangeEventsResponse(response)) {
      if (!this.currentEventCommand) {
        console.error('No command data for incoming event response!');
        return;
      }
      currentCommand = this.currentEventCommand;
      this.currentEventCommand = null;
    } else if (isCommandUnderProcessResponse(response)) {
      console.log('Command under process!');
      return;
    } if (!this.currentCommand) {
      console.error('No command data for incoming command response!');
      return;
    } else {
      currentCommand = this.currentCommand;
      this.currentCommand = null;

      if (isFailedResponse(response)) {
        currentCommand.reject(parseMessage(response) as ErrorMessage);
        return;
      }
    }

    this.handleResponse(response, [currentCommand.resolve]);
  }

  /**
   * Handles incoming command response data from the HEOS system
   * 
   * @param data The data buffer provided by the socket connection
   */
  protected handleCommandData(data: Buffer): void {
    if (!this.currentCommand) {
      console.error('No command data for incoming command response!');
      return;
    }

    // Concat stored command buffer (if existing) with the current incoming data
    const buffer = this.currentCommand.buffer
      ? Buffer.concat([this.currentCommand.buffer, data])
      : data;

    /*
     * HEOS messages are terminated by CRLF, so we need to store the current buffer
     * back in the command cache, if this was not the last part
     */
    if (data.subarray(data.length - 2).toString() !== '\r\n') {
      this.currentCommand.buffer = buffer;
      return;
    }

    // Let's hope this never happens
    if (buffer.length > constants.MAX_STRING_LENGTH) {
      console.error('MAX STRING LENGTH EXCEEDED!', buffer.length, constants.MAX_STRING_LENGTH);
      return;
    }

    this.resolveCommandPromise(JSON.parse(buffer.toString()) as CommandResponse);
  }

  /**
   * Handles incoming eveng data from the HEOS system
   *
   * @param data The data buffer provided by the socket connection
   */
  protected handleEventData(data: Buffer): void {
    // The socket buffer could contain multiple event messages
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

  /**
   * Handles a HEOS response and transforms it into a proper JavaScript structure
   * 
   * @param response The full response sent by the HEOS system
   * @param callbacks A list of functions that should be called with the transformed response data
   */
  protected handleResponse(response: Response, callbacks: Array<CallableFunction>): void {
    const args = this.getCallbackArguments(response);
    callbacks.forEach((func) => {
      func(...args);
    });
  }

  /**
   * Extracts parameters from a HEOS response
   * 
   * @param response The full response sent by the HEOS system
   * @returns A list of parameters to be passed in any callback functions
   */
  protected getCallbackArguments(response: Response): Array<unknown> {
    const message = parseMessage(response);
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
      case isGetGroupInfoResponse(response):
      case isGetMusicSourcesResponse(response):
      case isGetSourceInfoResponse(response):
      case isGetSearchCriteriaResponse(response):
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
      case isPlayerStateChangedResponse(response):
        return [message.pid, message.state];
      case isPlayerNowPlayingChangedResponse(response):
      case isPlayerQueueChangedResponse(response):
        return [message.pid];
      case isPlayerNowPlayingProgressResponse(response):
        return [message.pid, message.cur_pos, message.duration];
      case isPlayerPlaybackErrorResponse(response):
        return [message.pid, message.error];
      case isPlayerVolumeChangedResponse(response):
        return [message.pid, message.level, message.mute === On];
      case isRepeatModeChangedResponse(response):
        return [message.pid, message.repeat];
      case isShuffleModeChangedResponse(response):
        return [message.pid, message.shuffle];
      case isGroupVolumeChangedResponse(response):
        return [message.gid, message.level, message.mute === On];
      case isUserChangedResponse(response):
        return [message.fragment === SignedIn ? message.un : null];
      case isBrowseResponse(response):
      case isSearchResponse(response):
        return [{
          results: response.payload,
          options: response.options,
        }];
      default:
        console.error('Unknown response type', response);
    }

    return [];
  }

  /**
   * Sends the given command with the given query string to the given socket instance
   * 
   * @param command The HEOS command to send
   * @param query The query string (parameters) to send with the command
   * @param socket The socket instance to send the command to. Defaults to the command socket
   * 
   * @returns A promise for the command response
   */
  protected send<T>(command: Command, query: Query = {}, socket: Socket | null = this.commandSocket): Promise<T> {
    (Object.keys(query) as Array<keyof Query>).forEach(key => query[key] === undefined && delete query[key]);

    if (socket === null) {
      throw new Error('Requested socket is not ready!');
    }

    const isEventSocket = socket === this.eventSocket;
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

      // Map all passed query string parameters to the HEOS format
      const queryString =
        Object.keys(query).length === 0 ? ''
          : '?' + Object.entries(query)
            .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
            .reduce((previous, current) => `${previous}&${current}`);

      socket.write(['heos://', command, queryString, '\r\n'].join(''));
    });
  }
}