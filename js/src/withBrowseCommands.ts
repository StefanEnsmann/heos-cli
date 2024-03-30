import { BrowseCommand } from "./util/commands.js";
import type { MusicSourceInfo } from "./util/types.js";
import ConnectionWithGroupCommands from "./withGroupCommands.js";

export default class ConnectionWithBrowseCommands extends ConnectionWithGroupCommands {
  getMusicSources(): Promise<Array<MusicSourceInfo>> {
    return this.send(BrowseCommand.GetMusicSources);
  }

  getSourceInfo(): Promise<MusicSourceInfo> {
    return this.send(BrowseCommand.GetSourceInfo);
  }
}