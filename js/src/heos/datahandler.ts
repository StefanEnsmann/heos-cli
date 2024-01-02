import {
  Commands,
  Event,
  type EventResponse,
  type GroupsChanged,
  type PlayersChanged,
  type SourcesChanged,
} from "../index.js";
import type { Command, Message } from "../types/commands/index.js";
import {
  On,
  Result,
  SignedOut,
  type LoginState,
  SignedIn,
  CommandUnderProcess,
} from "../types/constants.js";
import type {
  CommandUnderProcessResponse,
  FailedResponse,
} from "../types/responses/base.js";
import type { GetMusicSources } from "../types/responses/browse.js";
import type { GetGroups } from "../types/responses/group.js";
import type { Response } from "../types/responses/index.js";
import type {
  CheckUpdate,
  GetNowPlayingMedia,
  GetPlayerInfo,
  GetPlayers,
  GetQueue,
  GetQuickselects,
} from "../types/responses/player.js";

type MessageKey = keyof Message;
type MessageEntry = LoginState | `${MessageKey}=${string}`;
type MessageValue = Message[MessageKey];

function isFragment(value: string): value is LoginState {
  return [SignedIn, SignedOut].includes(value);
}

export function isFailedResponse(
  response: Response
): response is FailedResponse {
  return response.heos.result === Result.Fail;
}

export function isCommandUnderProcessResponse(
  response: Response
): response is CommandUnderProcessResponse<Command> {
  return response.heos.message.startsWith(CommandUnderProcess);
}

export function isEvent(
  response: Response | EventResponse
): response is EventResponse {
  return response.heos.command.startsWith("event");
}

export function isEventWithMessage(
  response: Response | EventResponse
): response is Exclude<
  EventResponse,
  SourcesChanged | PlayersChanged | GroupsChanged
> {
  return (
    isEvent(response) &&
    !(
      [
        Event.SourcesChanged,
        Event.PlayersChanged,
        Event.GroupsChanged,
      ] as Event[]
    ).includes(response.heos.command)
  );
}

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

export function parseMessage(response: Response | EventResponse): Message {
  if (
    (isEvent(response) && !isEventWithMessage(response)) ||
    response.heos.message === ""
  ) {
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

export function transformResponse(response: Exclude<Response, FailedResponse>) {
  if (isCommandUnderProcessResponse(response)) {
    return undefined;
  }

  const message = parseMessage(response);
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
    case Commands.Group.SetVolume:
    case Commands.Group.VolumeUp:
    case Commands.Group.VolumeDown:
    case Commands.Group.SetMute:
    case Commands.Group.ToggleMute:
      return undefined;
    case Commands.System.RegisterForChangeEvents:
      return message.enable === On;
    case Commands.System.CheckAccount:
      return message.fragment === SignedIn ? message.un : null;
    case Commands.Player.GetPlayers:
      return (response as GetPlayers).payload;
    case Commands.Player.GetPlayerInfo:
      return (response as GetPlayerInfo).payload;
    case Commands.Player.GetPlayState:
      return message.state;
    case Commands.Player.GetNowPlayingMedia:
      return (response as GetNowPlayingMedia).payload;
    case Commands.Player.GetVolume:
      return message.level;
    case Commands.Player.GetMute:
      return message.state === On;
    case Commands.Player.GetPlayMode:
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
    case Commands.Group.GetGroups:
      return (response as GetGroups).payload;
    case Commands.Group.SetGroup:
      if (Object.keys(message).includes("gid")) {
        return message;
      }

      return undefined;
    case Commands.Group.GetVolume:
      return message.level;
    case Commands.Group.GetMute:
      return message.state === On;
    case Commands.Browse.GetMusicSources:
      return (response as GetMusicSources).payload;
    default:
      throw new Error("Can not extract payload from unknown command!");
  }
}
