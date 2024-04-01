import { type LoginState, type MusicSource, type OnOff, type PlayState, type RepeatMode, type HEOSError, SignedIn, SignedOut, SearchCriteria, Input, QueueType } from "./constants.js";
import { type Response } from "./responses.js";
import type { ContainerId, GroupId, MediaId, PlayerId, QueueId, QuickselectId } from "./types.js";

export type Message = Partial<{
  aid: QueueType;
  cid: ContainerId;
  count: number;
  cur_pos: number;
  dqid: QueueId;
  duration: number;
  eid: HEOSError;
  enable: OnOff;
  error: string;
  fragment: LoginState;
  gid: GroupId;
  id: QuickselectId;
  input: Input;
  level: number;
  mid: MediaId;
  mute: OnOff;
  name: string;
  pid: PlayerId | Array<PlayerId>;
  preset: number;
  pw: string;
  qid: QueueId | Array<QueueId>;
  range: Array<number>;
  repeat: RepeatMode;
  returned: number;
  search: string;
  shuffle: OnOff;
  sid: MusicSource;
  scid: SearchCriteria;
  spid: PlayerId;
  sqid: Array<QueueId>;
  state: OnOff | PlayState;
  step: number;
  text: string;
  un: string;
  url: string;
}>;
export type ErrorMessage = Pick<Message, "eid" | "text">;
export type Query = Omit<Message, "fragment" | "eid" | "text">;
export type GroupMessage = Required<Pick<Message, "gid" | "name" | "pid">>;

type NumberProperty = "aid" | "cid" | "count" | "dqid" | "gid" | "id" | "level" | "pid" | "preset" | "qid" | "returned" | "scid" | "sid" | "spid" | "step" | "eid";
type MessageKey = keyof Message;
type MessageEntry = LoginState | `${MessageKey}=${string}`;
type MessageValue = Message[MessageKey];

function isNumberProperty(key: MessageKey): key is NumberProperty {
  return ["aid", "cid", "count", "dqid", "gid", "id", "level", "pid", "preset", "qid", "returned", "scid", "sid", "spid", "step", "eid"].includes(key);
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
  const message = response.heos.message ?? "";

  return (message.split("&") as MessageEntry[])
    .reduce((message: Message, current: MessageEntry) => {
      if ([SignedIn, SignedOut].includes(current)) {
        return Object.assign(message, { fragment: current });
      }

      const [key, value] = current.split("=") as [MessageKey, MessageEntry];
      return Object.assign(message, { [key]: getValueOrArray(key, value) });
    }, {});
}