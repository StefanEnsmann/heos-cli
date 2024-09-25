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
   * 
   * @category Connection Management
   */
  close(): void {
    this.clearSockets(ConnectionStatus.Closed);
  }
}