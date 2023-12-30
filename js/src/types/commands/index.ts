import type {
  Error,
  LoginState,
  MusicSource,
  OnOff,
  PlayState,
  RepeatMode,
  SignedIn,
  SignedOut,
  SystemError,
} from "../constants.js";
import type {
  CommaSeparatedList,
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
  dqid: QueueId;
  eid: Error | SystemError;
  enable: OnOff;
  fragment: LoginState;
  gid: GroupId;
  id: QuickselectId;
  level: number;
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
