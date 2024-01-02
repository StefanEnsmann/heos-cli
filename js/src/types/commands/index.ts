import type {
  Error,
  LoginState,
  MusicSource,
  OnOff,
  PlayState,
  RepeatMode,
  SystemError,
} from "../constants.js";
import type {
  ContainerId,
  GroupId,
  PlayerId,
  QueueId,
  QuickselectId,
} from "../types.js";
import { Browse } from "./browse.js";
import { Group } from "./group.js";
import { Player } from "./player.js";
import { System } from "./system.js";

export { Browse, Group, Player, System };
export type Command = System | Player | Group | Browse;
export type Message = Partial<{
  cid: ContainerId;
  count: number;
  cur_pos: number;
  dqid: QueueId;
  duration: number;
  eid: Error | SystemError;
  enable: OnOff;
  error: string;
  fragment: LoginState;
  gid: GroupId;
  id: QuickselectId;
  level: number;
  mute: OnOff;
  name: string;
  pid: PlayerId | Array<PlayerId>;
  pw: string;
  qid: QueueId | Array<QueueId>;
  range: Array<number>;
  repeat: RepeatMode;
  returned: number;
  shuffle: OnOff;
  sid: MusicSource;
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
