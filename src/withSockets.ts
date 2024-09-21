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

import { Socket } from "net";
import BaseConnection from "./withRoutingInfo.js";
import { ConnectionStatus } from "./util/constants.js";
import type { PromiseReject } from "./util/types.js";

/**
 * Builds upon {@link BaseConnection} and can open socket connections to a HEOS device
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class ConnectionWithSockets extends BaseConnection {
  /**
   * The socket used to send commands to and receive responses from the HEOS system
   */
  protected commandSocket: Socket | null = null;

  /**
   * The socket used to receive events from the HEOS system
   */
  protected eventSocket: Socket | null = null;

  /**
   * The current status of this connection instance
   */
  protected status: ConnectionStatus = ConnectionStatus.Pending;

  /**
   * Ends and clears all socket connections. Stores the given {@link status} as the current connection status
   * 
   * @param status The current connection status (the reason for clearing the sockets)
   */
  protected clearSockets(status: ConnectionStatus): void {
    console.log('Sockets closed. Connection status:', status);
    this.status = status;
    if (this.commandSocket) {
      this.commandSocket.end();
      this.commandSocket = null;
    }
    if (this.eventSocket) {
      this.eventSocket.end();
      this.eventSocket = null;
    }
  }

  /**
   * Opens a socket connection on port 1255 to {@link device}
   * 
   * @param dataListener The callback to execute when a portion of data is received
   * @param reject A promise reject callback to call when a connection can not be established
   * @param connectListener The callback to execute when a connection is established
   * 
   * @returns A successfully established Socket instance
   */
  protected createSocket(dataListener: (data: Buffer) => void, reject: PromiseReject<ConnectionStatus>, connectListener: () => void): Socket {
    return new Socket()
      .on('data', (data: Buffer) => dataListener.call(this, data))
      .on('timeout', () => {
        this.clearSockets(ConnectionStatus.Timeout);
        reject(ConnectionStatus.Timeout);
      })
      .on('error', () => this.clearSockets(ConnectionStatus.Error))
      .connect(1255, this.device.address, () => connectListener.call(this));
  }

  /**
   * Initializes command and event socket connections to {@link device}
   * 
   * @param commandHandler The callback to execute when data is coming via the command socket
   * @param eventHandler The callback to execute when data is coming via the event socket
   * 
   * @returns A promise for the connection process
   */
  protected initSockets(
    commandHandler: (data: Buffer) => void,
    eventHandler: (data: Buffer) => void,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.commandSocket = this.createSocket(commandHandler, reject, () => {
        console.log('Command socket connected!');
        this.eventSocket = this.createSocket(eventHandler, reject, () => {
          console.log('Event socket connected!');
          this.status = ConnectionStatus.Connected;
          resolve();
        });
      });
    });
  }

  /**
   * Closes all socket connections
   */
  close(): void {
    this.clearSockets(ConnectionStatus.Closed);
  }
}