import { createSocket } from "dgram";
import { Socket } from "net";
import {
  ConnectionStatus,
  type RoutingInfo,
  type DiscoveryOptions,
} from "../types/network.js";
import type {
  Command,
  ErrorMessage,
  Message,
  Player,
  Query,
} from "../types/commands/index.js";
import type {
  GroupId,
  PlayerId,
  QueueId,
  QuickselectId,
} from "../types/types.js";
import { Commands } from "../index.js";
import {
  Off,
  On,
  PlayState,
  Result,
  SignedIn,
  SignedOut,
  type LoginState,
  type OnOff,
  RepeatMode,
  CommandUnderProcess,
  FirmwareVersion,
} from "../types/constants.js";
import type {
  PlayMode,
  PlayerInfo,
  PlayingMedia,
  QueueItem,
  QuickselectInfo,
} from "../types/payloads.js";
import type { Response } from "../types/responses/index.js";
import type { FailedResponse } from "../types/responses/base.js";
import type {
  CheckUpdate,
  GetNowPlayingMedia,
  GetPlayerInfo,
  GetPlayers,
  GetQueue,
  GetQuickselects,
} from "../types/responses/player.js";
import { constants } from "buffer";
import { deserialize } from "v8";

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

type PromiseCallback = {
  resolve: (value: any | PromiseLike<any>) => void;
  reject: (reason: ErrorMessage) => any;
};

type MessageKey = keyof Message;
type MessageEntry = LoginState | `${MessageKey}=${string}`;
type MessageValue = Message[MessageKey];

function isNumberProperty(
  key: MessageKey
): key is
  | "cid"
  | "count"
  | "dqid"
  | "gid"
  | "id"
  | "level"
  | "pid"
  | "qid"
  | "returned"
  | "sid"
  | "step"
  | "eid" {
  return [
    "cid",
    "count",
    "dqid",
    "gid",
    "id",
    "level",
    "pid",
    "qid",
    "returned",
    "sid",
    "step",
    "eid",
  ].includes(key);
}

function isFragment(value: string): value is LoginState {
  return [SignedIn, SignedOut].includes(value);
}

function getValueOrArray(key: MessageKey, value: string): MessageValue {
  if (isNumberProperty(key)) {
    if (value.includes(",")) {
      return value.split(",").map((v) => parseInt(v));
    } else {
      return parseInt(value);
    }
  }

  return value;
}

function parseMessage(response: Response): Message {
  if (response.heos.message === "") {
    return {};
  }

  return (response.heos.message.split("&") as MessageEntry[]).reduce(
    (message: Message, current: MessageEntry) => {
      if (isFragment(current)) {
        return Object.assign(message, { fragment: current });
      } else {
        const [key, value] = current.split("=") as [MessageKey, MessageEntry];
        return Object.assign(message, { [key]: getValueOrArray(key, value) });
      }
    },
    {}
  );
}

function transformResponse(response: Exclude<Response, FailedResponse>) {
  switch (response.heos.command) {
    case Commands.System.SignIn:
    case Commands.System.SignOut:
    case Commands.System.HeartBeat:
    case Commands.System.Reboot:
    case Commands.Player.SetPlayState:
    case Commands.Player.SetVolume:
    case Commands.Player.VolumeUp:
    case Commands.Player.VolumeDown:
    case Commands.Player.SetMute:
    case Commands.Player.ToggleMute:
    case Commands.Player.SetPlayMode:
    case Commands.Player.PlayQueue:
    case Commands.Player.RemoveFromQueue:
    case Commands.Player.SaveQueue:
    case Commands.Player.ClearQueue:
    case Commands.Player.MoveQueueItem:
    case Commands.Player.PlayNext:
    case Commands.Player.PlayPrevious:
    case Commands.Player.SetQuickselect:
    case Commands.Player.PlayQuickselect:
      return undefined;
    case Commands.System.RegisterForChangeEvents:
      return response.heos.message.substring(7) === On;
    case Commands.System.CheckAccount:
      return response.heos.message === SignedOut
        ? null
        : response.heos.message.substring(13);
    case Commands.Player.GetPlayers:
      return (response as GetPlayers).payload;
    case Commands.Player.GetPlayerInfo:
      return (response as GetPlayerInfo).payload;
    case Commands.Player.GetPlayState:
      return parseMessage(response).state;
    case Commands.Player.GetNowPlayingMedia:
      return (response as GetNowPlayingMedia).payload;
    case Commands.Player.GetVolume:
      return parseMessage(response).level;
    case Commands.Player.GetMute:
      return parseMessage(response).state === On;
    case Commands.Player.GetPlayMode:
      const message = parseMessage(response);
      return {
        repeat: message.repeat,
        shuffle: message.shuffle === On,
      };
    case Commands.Player.GetQueue:
      return (response as GetQueue).payload;
    case Commands.Player.GetQuickselects:
      return (response as GetQuickselects).payload;
    case Commands.Player.CheckUpdate:
      return (response as CheckUpdate).payload.update;
    default:
      throw new Error("Can not extract payload from unknown command!");
  }
}

function isFailedResponse(response: Response): response is FailedResponse {
  return response.heos.result === Result.Fail;
}

function handleData(
  data: Buffer,
  pendingRequests: Map<Command, PromiseCallback>
) {
  // TODO: Improve buffer deserialization to avoid MAX_STRING_LENGTH error
  const string = data.toString();
  const response = JSON.parse(string) as Response;
  console.log("Response", response);
  if (response.heos.message === CommandUnderProcess) {
    console.log("Skipping data call");
    return;
  }

  const promiseCallbacks = pendingRequests.get(response.heos.command);
  pendingRequests.delete(response.heos.command);
  if (promiseCallbacks === undefined) {
    return;
  }

  if (isFailedResponse(response)) {
    const errorMessage = parseMessage(response) as ErrorMessage;
    promiseCallbacks.reject(errorMessage);

    return;
  }

  try {
    promiseCallbacks.resolve(transformResponse(response));
  } catch (error) {
    console.error(error, response.heos.command);
  }
}

export class Connection {
  device: RoutingInfo;
  socket: Socket | null = null;
  status: ConnectionStatus = ConnectionStatus.Pending;
  pendingRequests: Map<Command, PromiseCallback>;

  constructor(device: RoutingInfo) {
    this.device = device;
    this.pendingRequests = new Map<Command, PromiseCallback>();
  }

  connect(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      this.status = ConnectionStatus.Connecting;
      this.socket = new Socket()
        .on("data", (data: Buffer) => {
          handleData(data, this.pendingRequests);
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
      this.socket.write(command);
    }
  }

  send(command: Command, query: Query = {}): void {
    this.sendRaw(buildCommandString(command, query));
  }

  storePromiseAndSend<T>(command: Command, query: Query = {}): Promise<T> {
    if (Object.keys(this.pendingRequests).includes(command)) {
      throw new Error(
        "Can not send message, there is still a pending request for the same request!"
      );
    }
    const promise = new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(command, {
        resolve,
        reject,
      });
    });

    this.send(command, query);

    return promise;
  }

  // System level commands
  receiveEvents(receive: boolean): Promise<void> {
    return this.storePromiseAndSend<void>(
      Commands.System.RegisterForChangeEvents,
      {
        enable: receive ? On : Off,
      }
    );
  }

  checkAccount(): Promise<string | null> {
    return this.storePromiseAndSend<string | null>(
      Commands.System.CheckAccount
    );
  }

  signIn(username: string, password: string): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.System.SignIn, {
      un: username,
      pw: password,
    });
  }

  signOut(): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.System.SignOut);
  }

  sendHeartBeat(): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.System.HeartBeat);
  }

  rebootSpeaker(): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.System.Reboot);
  }

  // Player level commands
  getPlayers(): Promise<Array<PlayerInfo>> {
    return this.storePromiseAndSend<Array<PlayerInfo>>(
      Commands.Player.GetPlayers
    );
  }

  getPlayerInfo(pid: PlayerId): Promise<PlayerInfo> {
    return this.storePromiseAndSend<PlayerInfo>(Commands.Player.GetPlayerInfo, {
      pid,
    });
  }

  getPlayState(pid: PlayerId): Promise<PlayState> {
    return this.storePromiseAndSend<PlayState>(Commands.Player.GetPlayState, {
      pid,
    });
  }

  setPlayState(pid: PlayerId, state: PlayState): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.SetPlayState, {
      pid,
      state,
    });
  }

  getNowPlayingMedia(pid: PlayerId): Promise<PlayingMedia> {
    return this.storePromiseAndSend<PlayingMedia>(
      Commands.Player.GetNowPlayingMedia,
      { pid }
    );
  }

  getPlayerVolume(pid: PlayerId): Promise<number> {
    return this.storePromiseAndSend<number>(Commands.Player.GetVolume, {
      pid,
    });
  }

  setPlayerVolume(pid: PlayerId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error("Step value needs to be between 1 and 100!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.SetVolume, {
      pid,
      level,
    });
  }

  playerVolumeUp(pid: PlayerId, step: number): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.VolumeUp, {
      pid,
      step,
    });
  }

  playerVolumeDown(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.VolumeDown, {
      pid,
      step,
    });
  }

  getPlayerMute(pid: PlayerId): Promise<boolean> {
    return this.storePromiseAndSend<boolean>(Commands.Player.GetMute, { pid });
  }

  setPlayerMute(pid: PlayerId, state: OnOff): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.SetMute, {
      pid,
      state,
    });
  }

  togglePlayerMute(pid: PlayerId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.ToggleMute, {
      pid,
    });
  }

  getPlayMode(pid: PlayerId): Promise<PlayMode> {
    return this.storePromiseAndSend<PlayMode>(Commands.Player.GetPlayMode, {
      pid,
    });
  }

  setPlayMode(
    pid: PlayerId,
    repeat: RepeatMode,
    shuffle: OnOff
  ): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.SetPlayMode, {
      pid,
      repeat,
      shuffle,
    });
  }

  getQueue(
    pid: PlayerId,
    from: number,
    count: number
  ): Promise<Array<QueueItem>> {
    if (from < 0) {
      throw new Error("Start index must be greater or equal to 0!");
    }
    if (count < 1 || count > 100) {
      throw new Error("Number of entries must be between 1 and 100!");
    }
    return this.storePromiseAndSend<Array<QueueItem>>(
      Commands.Player.GetQueue,
      {
        pid,
        range: [from, from + count - 1],
      }
    );
  }

  playQueueItem(pid: PlayerId, qid: QueueId): Promise<void> {
    if (qid < 0) {
      throw new Error("Queue ID must be greater or equal to 0!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.PlayQueue, {
      pid,
      qid,
    });
  }

  removeFromQueue(pid: PlayerId, qid: Array<QueueId>): Promise<void> {
    if (qid.length > 1) {
      throw new Error("You must remove at least one queue item!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.RemoveFromQueue, {
      pid,
      qid,
    });
  }

  saveQueue(pid: PlayerId, name: string): Promise<void> {
    if (name.length > 128) {
      throw new Error("A playlist name can have a maximum of 128 characters!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.SaveQueue, {
      pid,
      name,
    });
  }

  clearQueue(pid: PlayerId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.ClearQueue);
  }

  moveQueueItems(
    pid: PlayerId,
    sqid: Array<QueueId>,
    dqid: QueueId
  ): Promise<void> {
    if (sqid.length < 1) {
      throw new Error("You have to move at least one queue item!");
    }
    return this.storePromiseAndSend<void>(Commands.Player.MoveQueueItem, {
      pid,
      sqid,
      dqid,
    });
  }

  playNext(pid: PlayerId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.PlayNext, { pid });
  }

  playPrevious(pid: PlayerId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.PlayPrevious, {
      pid,
    });
  }

  setQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.SetQuickselect, {
      pid,
      id,
    });
  }

  playQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.storePromiseAndSend<void>(Commands.Player.PlayQuickselect, {
      pid,
      id,
    });
  }

  getQuickselects(
    pid: PlayerId,
    id: QuickselectId | undefined
  ): Promise<Array<QuickselectInfo>> {
    return this.storePromiseAndSend<Array<QuickselectInfo>>(
      Commands.Player.GetQuickselects,
      id === undefined
        ? { pid }
        : {
            pid,
            id,
          }
    );
  }

  checkForFirmwareUpdate(pid: PlayerId): Promise<FirmwareVersion> {
    return this.storePromiseAndSend<FirmwareVersion>(
      Commands.Player.CheckUpdate,
      { pid }
    );
  }
}
