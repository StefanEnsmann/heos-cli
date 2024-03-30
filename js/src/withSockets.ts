import { Socket } from "net";
import BaseConnection from "./withRoutingInfo.js";
import { ConnectionStatus } from "./util/constants.js";
import type { PromiseReject } from "./util/types.js";

export default class ConnectionWithSockets extends BaseConnection {
  protected commandSocket: Socket | null = null;
  protected eventSocket: Socket | null = null;
  protected status: ConnectionStatus = ConnectionStatus.Pending;

  protected createSocket(
    dataListener: (data: Buffer) => void,
    reject: PromiseReject<Error>,
    connectListener: () => void
  ): Socket {
    return new Socket()
      .on('data', (data: Buffer) => dataListener.call(this, data))
      .on('timeout', () => {
        this.status = ConnectionStatus.Timeout;
        if (this.commandSocket) {
          this.commandSocket.end();
          this.commandSocket = null;
        }
        if (this.eventSocket) {
          this.eventSocket.end();
          this.eventSocket = null;
        }
        reject(new Error('Socket timeout'));
      })
      .on('error', (error: Error) => {
        this.status = ConnectionStatus.Error;
        this.commandSocket = null;
        reject(error);
      })
      .connect(1255, this.device.address, () => connectListener.call(this));
  }

  close(): void {
    if (this.commandSocket !== null) {
      this.commandSocket.end();
      this.commandSocket = null;
    }
    if (this.eventSocket !== null) {
      this.eventSocket.end();
      this.eventSocket = null;
    }
    this.status = ConnectionStatus.Closed;
  }
}