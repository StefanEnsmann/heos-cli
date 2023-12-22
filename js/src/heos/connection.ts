import { Socket, createConnection } from "net";
import { ConnectionStatus, RoutingInfo } from "../types/network";
import { HEOS } from "./heos";

export const HEOSPort = 1255;

export class HEOSConnection {
  device: RoutingInfo;
  socket: Socket;
  status: ConnectionStatus = ConnectionStatus.Pending;

  constructor(device: RoutingInfo) {
    this.device = device;
    this.socket = new Socket().on("data", () => {});
  }

  connect(): Promise<HEOSConnection> {
    return new Promise<HEOSConnection>((resolve, reject) => {
      this.status = ConnectionStatus.Connecting;
      this.socket
        .on("timeout", () => {
          this.socket.end();
          this.status = ConnectionStatus.Timeout;
          reject(new Error("Socket timeout"));
        })
        .on("error", (error: Error) => {
          this.status = ConnectionStatus.Error;
          reject(error);
        })
        .connect(
          {
            port: HEOSPort,
            host: this.device.address,
            localPort: 0,
          },
          () => {
            this.status = ConnectionStatus.Connected;
            resolve(this);
          }
        );
    });
  }
}
