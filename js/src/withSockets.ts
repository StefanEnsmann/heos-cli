import { Socket } from "net";
import BaseConnection from "./withRoutingInfo.js";
import { ConnectionStatus } from "./util/constants.js";
import type { PromiseReject } from "./util/types.js";

export default class ConnectionWithSockets extends BaseConnection {
  protected commandSocket: Socket | null = null;
  protected eventSocket: Socket | null = null;
  protected status: ConnectionStatus = ConnectionStatus.Pending;

  protected clearSockets(status: ConnectionStatus): void {
    console.log('Sockets closed', status);
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

  close(): void {
    this.clearSockets(ConnectionStatus.Closed);
  }
}