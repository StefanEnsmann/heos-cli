import type {
  MusicSource,
  OnOff,
  PlayState,
  RepeatMode,
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
export type Query = Partial<{
  sid: MusicSource;
  gid: GroupId;
  returned: number;
  count: number;
  cid: ContainerId;
  range: `${number},${number}`;
  name: string;
  pid: PlayerId | Array<PlayerId>;
  level: number;
  step: number;
  state: OnOff | PlayState;
  repeat: RepeatMode;
  shuffle: OnOff;
  qid: QueueId | Array<QueueId>;
  sqid: Array<QueueId>;
  dqid: QueueId;
  id: QuickselectId;
}>;
