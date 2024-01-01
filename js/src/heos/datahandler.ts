import { Commands, Events, type EventResponse } from "../index.js";
import type { Message } from "../types/commands/index.js";
import {
  On,
  Result,
  SignedOut,
  type LoginState,
  SignedIn,
} from "../types/constants.js";
import type { FailedResponse } from "../types/responses/base.js";
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
import type { RegisterForChangeEvents } from "../types/responses/system.js";

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

export function isEvent(
  response: RegisterForChangeEvents | EventResponse
): response is EventResponse {
  return response.heos.command !== Commands.System.RegisterForChangeEvents;
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

export function parseMessage(response: Response): Message {
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

export function transformEvent(response: EventResponse) {
  switch (response.heos.command) {
    case Events.SourcesChanged:
    case Events.PlayersChanged:
    case Events.GroupsChanged:
    case Events.PlayerStateChanged:
    case Events.PlayerNowPlayingChanged:
    case Events.PlayerNowPlayingProgress:
    case Events.PlayerPlaybackError:
    case Events.PlayerQueueChanged:
    case Events.PlayerVolumeChanged:
    case Events.RepeatModeChanged:
    case Events.ShuffleModeChanged:
    case Events.GroupVolumeChanged:
    case Events.UserChanged:
      return undefined;
    default:
      throw new Error("Can not extract payload from unknown event!");
  }
}

export function transformResponse(response: Exclude<Response, FailedResponse>) {
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
      const playModeMessage = parseMessage(response);
      return {
        repeat: playModeMessage.repeat,
        shuffle: playModeMessage.shuffle === On,
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
      const setGroupMessage = parseMessage(response);
      if (Object.keys(setGroupMessage).includes("gid")) {
        return setGroupMessage;
      }

      return undefined;
    case Commands.Group.GetVolume:
      return parseMessage(response).level;
    case Commands.Group.GetMute:
      return parseMessage(response).state === On;
    case Commands.Browse.GetMusicSources:
      return (response as GetMusicSources).payload;
    default:
      throw new Error("Can not extract payload from unknown command!");
  }
}
