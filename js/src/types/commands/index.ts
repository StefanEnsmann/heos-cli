import { Browse } from "./browse.js";
import { Group } from "./group.js";
import { Player } from "./player.js";
import { System } from "./system.js";

export { Browse, Group, Player, System };
export type Command = System | Player | Group | Browse;
