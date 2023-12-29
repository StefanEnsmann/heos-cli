import { createSocket } from "dgram";
import { Socket } from "net";
import {
  ConnectionStatus,
  type RoutingInfo,
  type DiscoveryOptions,
} from "../types/network.js";
import type { Command, Query } from "../types/commands/index.js";
import type { PlayerId } from "../types/types.js";
import type { GetNowPlayingMedia } from "../types/responses/player.js";
import { Commands } from "../index.js";
import type { FailableResponse } from "../types/responses/base.js";
import { Result } from "../types/constants.js";

const schemaName = "urn:schemas-denon-com:device:ACT-Denon:1";
const discoverMessage = [
  "M-SEARCH * HTTP/1.1",
  "HOST: 239.255.255.250:1900",
  `ST: ${schemaName}`,
  "MX: 5",
  'MAN: "ssdp:discover"',
  "\r\n",
].join("\r\n");

export function discoverDevices({
  timeout = 5000,
  maxDevices = 1,
  onDiscover,
  onTimeout,
}: DiscoveryOptions = {}): Promise<RoutingInfo[]> {
  return new Promise<RoutingInfo[]>((resolve, reject) => {
    const devices: RoutingInfo[] = [];
    const timeoutReference = setTimeout(stopDiscovery, timeout);
    const socket = createSocket("udp4");

    function stopDiscovery(early: boolean = false) {
      socket.close();
      global.clearTimeout(timeoutReference);
      if (!early && onTimeout) {
        onTimeout(devices);
      }
      devices.length > 0 ? resolve(devices) : reject("No devices found!");
    }

    function handleResponse(msg: string, routingInfo: RoutingInfo) {
      if (!msg.includes(schemaName)) {
        return;
      }

      devices.push(routingInfo);
      if (onDiscover) {
        onDiscover(routingInfo);
      }
      if (maxDevices && devices.length >= maxDevices) {
        stopDiscovery(true);
      }
    }

    socket
      .bind()
      .on("listening", () => {
        socket.send(discoverMessage, 1900, "239.255.255.250");
      })
      .on("message", handleResponse);
  });
}

function buildCommandString(command: Command, query: Query = {}): string {
  const queryString =
    Object.keys(query).length > 0
      ? "?" +
        Object.entries(query)
          .map(
            ([key, value]) =>
              `${key}=${Array.isArray(value) ? value.join(",") : value}`
          )
          .reduce((previous, current) => `${previous}&${current}`)
      : "";

  return [Prefix, command, queryString, Postfix].join("");
}

const Port = 1255;
const Prefix = "heos://";
const Postfix = "\r\n";

type PromiseCallbacks = {
  resolve: (value: any | PromiseLike<any>) => void;
  reject: (reason?: any) => any;
};

export class Connection {
  device: RoutingInfo;
  socket: Socket | null = null;
  status: ConnectionStatus = ConnectionStatus.Pending;
  pendingRequests: Map<Command, PromiseCallbacks>;

  constructor(device: RoutingInfo) {
    this.device = device;
    this.pendingRequests = new Map<Command, PromiseCallbacks>();
  }

  connect(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.status = ConnectionStatus.Connecting;
      this.socket = new Socket()
        .on("data", (data: Buffer) => {
          console.log("Raw data", data.toString());
          const obj = JSON.parse(data.toString()) as FailableResponse<
            Command,
            string
          >;
          console.log("Data", obj);
          const promiseCallbacks = this.pendingRequests.get(obj.heos.command);
          if (promiseCallbacks !== undefined) {
            if (obj.heos.result === Result.Success) {
              promiseCallbacks.resolve(obj);
            } else {
              promiseCallbacks.reject(obj.heos.message);
            }
          }
          this.pendingRequests.delete(obj.heos.command);
        })
        .on("timeout", () => {
          if (this.socket) {
            this.socket?.end();
            this.status = ConnectionStatus.Timeout;
            this.socket = null;
          }
          reject(new Error("Socket timeout"));
        })
        .on("error", (error: Error) => {
          this.status = ConnectionStatus.Error;
          this.socket = null;
          reject(error);
        })
        .on("close", (hadError: boolean) => {})
        .connect(
          {
            port: Port,
            host: this.device.address,
            localPort: 0,
          },
          () => {
            console.log("Socket connected");
            this.status = ConnectionStatus.Connected;
            resolve(this);
          }
        );
    });
  }

  close(): void {
    if (this.socket !== null) {
      this.socket.end();
      this.status = ConnectionStatus.Closed;
      this.socket = null;
    }
  }

  sendRaw(command: string): void {
    if (this.socket) {
      console.log("Sending message", command);
      this.socket.write(command);
    }
  }

  send(command: Command, query: Query = {}): void {
    this.sendRaw(buildCommandString(command, query));
  }

  getNowPlayingMedia(playerId: PlayerId): Promise<GetNowPlayingMedia> {
    if (
      Object.keys(this.pendingRequests).includes(
        Commands.Player.GetNowPlayingMedia
      )
    ) {
      throw new Error(
        "Can not send message, there is still a pending request for the same request!"
      );
    }
    const promise = new Promise<GetNowPlayingMedia>((resolve, reject) => {
      this.pendingRequests.set(Commands.Player.GetNowPlayingMedia, {
        resolve,
        reject,
      });
    });
    this.send(Commands.Player.GetNowPlayingMedia, { pid: playerId });

    return promise;
  }
}
