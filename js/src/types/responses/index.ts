import type { Command } from "../commands/index.js";
import type { CommandUnderProcessResponse, FailedResponse } from "./base.js";
import * as Browse from "./browse.js";
import * as Group from "./group.js";
import * as Player from "./player.js";
import * as System from "./system.js";

export { Browse, Group, Player, System };
export type Response =
  | FailedResponse
  | CommandUnderProcessResponse<Command>
  | Browse.BrowseResponse
  | Group.GroupResponse
  | Player.PlayerResponse
  | System.SystemResponse;
