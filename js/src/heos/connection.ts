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
  GroupMessage,
  Query,
} from "../types/commands/index.js";
import type {
  GroupId,
  PlayerId,
  QueueId,
  QuickselectId,
} from "../types/types.js";
import { Commands, Event, type EventResponse } from "../index.js";
import {
  Off,
  On,
  PlayState,
  type OnOff,
  RepeatMode,
  FirmwareVersion,
  SignedIn,
} from "../types/constants.js";
import type {
  GroupInfo,
  MusicSourceInfo,
  PlayMode,
  PlayerInfo,
  PlayingMedia,
  QueueItem,
  QuickselectInfo,
} from "../types/payloads.js";
import {
  isCommandUnderProcessResponse,
  isEvent,
  isFailedResponse,
  parseMessage,
  transformResponse,
} from "./datahandler.js";
import type { Response } from "../types/responses/index.js";
import { constants } from "buffer";
import type { RegisterForChangeEvents } from "../types/responses/system.js";

const schemaName = "urn:schemas-denon-com:device:ACT-Denon:1";

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

    socket
      .bind()
      .on("listening", () => {
        socket.send(
          [
            "M-SEARCH * HTTP/1.1",
            "HOST: 239.255.255.250:1900",
            `ST: ${schemaName}`,
            "MX: 5",
            'MAN: "ssdp:discover"',
            "\r\n",
          ].join("\r\n"),
          1900,
          "239.255.255.250"
        );
      })
      .on("message", (msg: string, routingInfo: RoutingInfo) => {
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
      });
  });
}

export class Connection {
  device: RoutingInfo;
  commandSocket: Socket | null = null;
  eventSocket: Socket | null = null;
  status: ConnectionStatus = ConnectionStatus.Pending;
  currentCommand: {
    command: Command;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    buffer: Buffer | null;
  } | null = null;
  callbacks: Map<Event, CallableFunction> = new Map<Event, CallableFunction>();

  constructor(device: RoutingInfo) {
    this.device = device;
  }

  static discoverAndConnect(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      discoverDevices()
        .then((devices) => Connection.toDevice(devices[0]))
        .then((connection) => {
          resolve(connection);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  static toDevice(device: RoutingInfo): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      const connection = new Connection(device);
      connection.status = ConnectionStatus.Connecting;
      connection.commandSocket = connection.createSocket(
        connection.handleCommandData,
        reject,
        () => {
          console.log("Command socket connected!");
          connection.eventSocket = connection.createSocket(
            connection.handleEventData,
            reject,
            () => {
              console.log("Event socket connected!");
              connection.status = ConnectionStatus.Connected;
              resolve(connection);
            }
          );
        }
      );
    });
  }

  createSocket(
    dataListener: (data: Buffer) => void,
    reject: (reason?: any) => void,
    connectListener: () => void
  ): Socket {
    return new Socket()
      .on("data", (data: Buffer) => dataListener.call(this, data))
      .on("timeout", () => {
        this.status = ConnectionStatus.Timeout;
        if (this.commandSocket) {
          this.commandSocket.end();
          this.commandSocket = null;
        }
        if (this.eventSocket) {
          this.eventSocket.end();
          this.eventSocket = null;
        }
        reject(new Error("Socket timeout"));
      })
      .on("error", (error: Error) => {
        this.status = ConnectionStatus.Error;
        this.commandSocket = null;
        reject(error);
      })
      .on("close", (hadError: boolean) => {})
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

  resolveCommandPromise(response: Response): void {
    if (isCommandUnderProcessResponse(response)) {
      console.log("Command under process!");
      return;
    }

    if (!this.currentCommand) {
      console.error("No command data for incoming response!");
      return;
    }
    const currentCommand = this.currentCommand;
    this.currentCommand = null;

    if (isFailedResponse(response)) {
      const errorMessage = parseMessage(response) as ErrorMessage;
      currentCommand.reject(errorMessage);

      return;
    }

    try {
      currentCommand.resolve(transformResponse(response));
    } catch (error) {
      console.error(error, response);
    }
  }

  handleCommandData(data: Buffer): void {
    if (!this.currentCommand) {
      console.error("No command data for incoming response!");
      return;
    }
    const currentCommand = this.currentCommand;
    let buffer: Buffer | null = null;

    if (data.subarray(data.length - 2).toString() !== "\r\n") {
      if (currentCommand.buffer) {
        currentCommand.buffer = Buffer.concat([currentCommand.buffer, data]);
      } else {
        currentCommand.buffer = data;
      }
      return;
    }

    if (currentCommand.buffer) {
      buffer = Buffer.concat([currentCommand.buffer, data]);
    } else {
      buffer = data;
    }

    if (buffer.length > constants.MAX_STRING_LENGTH) {
      console.error(
        "MAX STRING LENGTH EXCEEDED!",
        buffer.length,
        constants.MAX_STRING_LENGTH
      );
      return;
    }

    const s = buffer.toString();
    console.log("Command respone", s);
    const response = JSON.parse(s) as Response;
    this.resolveCommandPromise(response);
  }

  handleEventData(data: Buffer): void {
    data.toString()
      .split("\r\n")
      .filter((part: string) => part.trim().length > 0)
      .forEach((part: string) => {
        const response = JSON.parse(part) as
          | RegisterForChangeEvents
          | EventResponse;
        this.handleEventResponse(response);
      });
  }

  handleEventResponse(response: RegisterForChangeEvents | EventResponse): void {
    if (isEvent(response)) {
      const func = this.callbacks.get(response.heos.command);
      if (!func) {
        return;
      }

      const message = parseMessage(response);
      switch (response.heos.command) {
        case Event.SourcesChanged:
        case Event.PlayersChanged:
        case Event.GroupsChanged:
          func();
          break;
        case Event.PlayerStateChanged:
          func(message.pid, message.state);
          break;
        case Event.PlayerNowPlayingChanged:
        case Event.PlayerQueueChanged:
          func(message.pid);
          break;
        case Event.PlayerNowPlayingProgress:
          func(message.pid, message.cur_pos, message.duration);
          break;
        case Event.PlayerPlaybackError:
          func(message.pid, message.error);
          break;
        case Event.PlayerVolumeChanged:
          func(message.pid, message.level, message.mute === On);
          break;
        case Event.RepeatModeChanged:
          func(message.pid, message.repeat);
          break;
        case Event.ShuffleModeChanged:
          func(message.pid, message.shuffle === On);
          break;
        case Event.GroupVolumeChanged:
          func(message.gid, message.level, message.mute === On);
          break;
        case Event.UserChanged:
          func(message.fragment === SignedIn ? message.un : null);
          break;
        default:
          throw new Error("Can not extract payload from unknown event!");
      }
    } else {
      this.resolveCommandPromise(response);
    }
  }

  sendRaw(command: string, socket: Socket): void {
    socket.write(command);
  }

  buildCommandString(command: Command, query: Query = {}): string {
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

    return ["heos://", command, queryString, "\r\n"].join("");
  }

  send<T>(
    socket: Socket | null,
    command: Command,
    query: Query = {}
  ): Promise<T> {
    if (!socket) {
      throw new Error("Requested socket is not ready!");
    }
    if (this.currentCommand) {
      throw new Error("There is another command pending!");
    }

    return new Promise<T>((resolve, reject) => {
      this.currentCommand = {
        command,
        resolve,
        reject,
        buffer: null,
      };
      this.sendRaw(this.buildCommandString(command, query), socket);
    });
  }

  on(event: typeof Event.SourcesChanged, listener: () => any): Connection;
  on(event: typeof Event.PlayersChanged, listener: () => any): Connection;
  on(event: typeof Event.GroupsChanged, listener: () => any): Connection;
  on(
    event: typeof Event.PlayerStateChanged,
    listener: (pid: PlayerId, state: PlayState) => any
  ): Connection;
  on(
    event: typeof Event.PlayerQueueChanged,
    listener: (pid: PlayerId) => any
  ): Connection;
  on(
    event: typeof Event.PlayerNowPlayingChanged,
    listener: (pid: PlayerId) => any
  ): Connection;
  on(
    event: typeof Event.PlayerNowPlayingProgress,
    listener: (pid: PlayerId, cur_pos: number, duration: number) => any
  ): Connection;
  on(
    event: typeof Event.PlayerPlaybackError,
    listener: (pid: PlayerId, error: string) => any
  ): Connection;
  on(
    event: typeof Event.PlayerVolumeChanged,
    listener: (pid: PlayerId, level: number, mute: boolean) => any
  ): Connection;
  on(
    event: typeof Event.RepeatModeChanged,
    listener: (pid: PlayerId, repeat: RepeatMode) => any
  ): Connection;
  on(
    event: typeof Event.ShuffleModeChanged,
    listener: (pid: PlayerId, shuffle: boolean) => any
  ): Connection;
  on(
    event: typeof Event.GroupVolumeChanged,
    listener: (gid: GroupId, level: number, mute: boolean) => any
  ): Connection;
  on(
    event: typeof Event.UserChanged,
    listener: (username: string | null) => any
  ): Connection;
  on(event: Event, listener: (...args: any[]) => any): Connection {
    if (this.callbacks.has(event)) {
      throw new Error("Callback already registered!");
    }

    this.callbacks.set(event, listener);

    return this;
  }

  // System level commands
  receiveEvents(receive: boolean = true): Promise<void> {
    return this.send<void>(
      this.eventSocket,
      Commands.System.RegisterForChangeEvents,
      {
        enable: receive ? On : Off,
      }
    );
  }

  checkAccount(): Promise<string | null> {
    return this.send<string | null>(
      this.commandSocket,
      Commands.System.CheckAccount
    );
  }

  signIn(username: string, password: string): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.System.SignIn, {
      un: username,
      pw: password,
    });
  }

  signOut(): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.System.SignOut);
  }

  sendHeartBeat(): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.System.HeartBeat);
  }

  rebootSpeaker(): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.System.Reboot);
  }

  // Player level commands
  getPlayers(): Promise<Array<PlayerInfo>> {
    return this.send<Array<PlayerInfo>>(
      this.commandSocket,
      Commands.Player.GetPlayers
    );
  }

  getPlayerInfo(pid: PlayerId): Promise<PlayerInfo> {
    return this.send<PlayerInfo>(
      this.commandSocket,
      Commands.Player.GetPlayerInfo,
      {
        pid,
      }
    );
  }

  getPlayState(pid: PlayerId): Promise<PlayState> {
    return this.send<PlayState>(
      this.commandSocket,
      Commands.Player.GetPlayState,
      {
        pid,
      }
    );
  }

  setPlayState(pid: PlayerId, state: PlayState): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.SetPlayState, {
      pid,
      state,
    });
  }

  getNowPlayingMedia(pid: PlayerId): Promise<PlayingMedia> {
    return this.send<PlayingMedia>(
      this.commandSocket,
      Commands.Player.GetNowPlayingMedia,
      { pid }
    );
  }

  getPlayerVolume(pid: PlayerId): Promise<number> {
    return this.send<number>(this.commandSocket, Commands.Player.GetVolume, {
      pid,
    });
  }

  setPlayerVolume(pid: PlayerId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error("Step value needs to be between 1 and 100!");
    }
    return this.send<void>(this.commandSocket, Commands.Player.SetVolume, {
      pid,
      level,
    });
  }

  playerVolumeUp(pid: PlayerId, step: number): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.send<void>(this.commandSocket, Commands.Player.VolumeUp, {
      pid,
      step,
    });
  }

  playerVolumeDown(pid: PlayerId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.send<void>(this.commandSocket, Commands.Player.VolumeDown, {
      pid,
      step,
    });
  }

  getPlayerMute(pid: PlayerId): Promise<boolean> {
    return this.send<boolean>(this.commandSocket, Commands.Player.GetMute, {
      pid,
    });
  }

  setPlayerMute(pid: PlayerId, state: OnOff): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.SetMute, {
      pid,
      state,
    });
  }

  togglePlayerMute(pid: PlayerId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.ToggleMute, {
      pid,
    });
  }

  getPlayMode(pid: PlayerId): Promise<PlayMode> {
    return this.send<PlayMode>(
      this.commandSocket,
      Commands.Player.GetPlayMode,
      {
        pid,
      }
    );
  }

  setPlayMode(
    pid: PlayerId,
    repeat: RepeatMode,
    shuffle: OnOff
  ): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.SetPlayMode, {
      pid,
      repeat,
      shuffle,
    });
  }

  getQueue(
    pid: PlayerId,
    from: number = 0,
    count: number = 25
  ): Promise<Array<QueueItem>> {
    if (from < 0) {
      throw new Error("Start index must be greater or equal to 0!");
    }
    if (count < 1 || count > 100) {
      throw new Error("Number of entries must be between 1 and 100!");
    }
    return this.send<Array<QueueItem>>(
      this.commandSocket,
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
    return this.send<void>(this.commandSocket, Commands.Player.PlayQueue, {
      pid,
      qid,
    });
  }

  removeFromQueue(pid: PlayerId, qid: Array<QueueId>): Promise<void> {
    if (qid.length > 1) {
      throw new Error("You must remove at least one queue item!");
    }
    return this.send<void>(
      this.commandSocket,
      Commands.Player.RemoveFromQueue,
      {
        pid,
        qid,
      }
    );
  }

  saveQueue(pid: PlayerId, name: string): Promise<void> {
    if (name.length > 128) {
      throw new Error("A playlist name can have a maximum of 128 characters!");
    }
    return this.send<void>(this.commandSocket, Commands.Player.SaveQueue, {
      pid,
      name,
    });
  }

  clearQueue(pid: PlayerId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.ClearQueue);
  }

  moveQueueItems(
    pid: PlayerId,
    sqid: Array<QueueId>,
    dqid: QueueId
  ): Promise<void> {
    if (sqid.length < 1) {
      throw new Error("You have to move at least one queue item!");
    }
    return this.send<void>(this.commandSocket, Commands.Player.MoveQueueItem, {
      pid,
      sqid,
      dqid,
    });
  }

  playNext(pid: PlayerId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.PlayNext, {
      pid,
    });
  }

  playPrevious(pid: PlayerId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.PlayPrevious, {
      pid,
    });
  }

  setQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Player.SetQuickselect, {
      pid,
      id,
    });
  }

  playQuickselect(pid: PlayerId, id: QuickselectId): Promise<void> {
    return this.send<void>(
      this.commandSocket,
      Commands.Player.PlayQuickselect,
      {
        pid,
        id,
      }
    );
  }

  getQuickselects(
    pid: PlayerId,
    id: QuickselectId | undefined
  ): Promise<Array<QuickselectInfo>> {
    return this.send<Array<QuickselectInfo>>(
      this.commandSocket,
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
    return this.send<FirmwareVersion>(
      this.commandSocket,
      Commands.Player.CheckUpdate,
      { pid }
    );
  }

  // Group level commands
  getGroups(): Promise<Array<GroupInfo>> {
    return this.send<Array<GroupInfo>>(
      this.commandSocket,
      Commands.Group.GetGroups
    );
  }

  getGroupInfo(gid: GroupId): Promise<GroupInfo> {
    return this.send<GroupInfo>(
      this.commandSocket,
      Commands.Group.GetGroupInfo,
      {
        gid,
      }
    );
  }

  setGroup(leader: PlayerId, members: Array<PlayerId>): Promise<GroupMessage> {
    return this.send<GroupMessage>(
      this.commandSocket,
      Commands.Group.SetGroup,
      {
        pid: [leader, ...members],
      }
    );
  }

  ungroup(gid: GroupId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Group.SetGroup, {
      pid: gid,
    });
  }

  getGroupVolume(gid: GroupId): Promise<number> {
    return this.send<number>(this.commandSocket, Commands.Group.GetVolume, {
      gid,
    });
  }

  setGroupVolume(gid: GroupId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error("Step value needs to be between 1 and 100!");
    }
    return this.send<void>(this.commandSocket, Commands.Group.SetVolume, {
      gid,
      level,
    });
  }

  groupVolumeUp(gid: GroupId, step: number): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.send<void>(this.commandSocket, Commands.Group.VolumeUp, {
      gid,
      step,
    });
  }

  groupVolumeDown(gid: GroupId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error("Step value needs to be between 1 and 10!");
    }
    return this.send<void>(this.commandSocket, Commands.Group.VolumeDown, {
      gid,
      step,
    });
  }

  getGroupMute(gid: GroupId): Promise<boolean> {
    return this.send<boolean>(this.commandSocket, Commands.Group.GetMute, {
      gid,
    });
  }

  setGroupMute(gid: GroupId, state: OnOff): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Group.SetMute, {
      gid,
      state,
    });
  }

  toggleGroupMute(gid: GroupId): Promise<void> {
    return this.send<void>(this.commandSocket, Commands.Group.ToggleMute, {
      gid,
    });
  }

  // Browse level commands
  getMusicSources(): Promise<Array<MusicSourceInfo>> {
    return this.send<Array<MusicSourceInfo>>(
      this.commandSocket,
      Commands.Browse.GetMusicSources
    );
  }
}
