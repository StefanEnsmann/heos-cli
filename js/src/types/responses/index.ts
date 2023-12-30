import type { FailedResponse } from "./base.js";
import * as Browse from "./browse.js";
import * as Group from "./group.js";
import * as Player from "./player.js";
import * as System from "./system.js";

export { Browse, Group, Player, System };
export type Response =
  | FailedResponse
  | Browse.BrowseResponse
  | Group.GroupResponse
  | Player.PlayerResponse
  | System.SystemResponse;
