import { BrowseCommand } from "./util/commands.js";
import type { Input, MusicSource, Option, QueueType, SearchCriteria } from "./util/constants.js";
import type { BrowseEntry, ContainerId, MediaId, MusicSourceInfo, PlayerId, SearchCriteriaInfo } from "./util/types.js";
import ConnectionWithGroupCommands from "./withGroupCommands.js";

export default class ConnectionWithBrowseCommands extends ConnectionWithGroupCommands {
  getMusicSources(): Promise<Array<MusicSourceInfo>> {
    return this.send(BrowseCommand.GetMusicSources);
  }

  getSourceInfo(sid: MusicSource): Promise<MusicSourceInfo> {
    return this.send(BrowseCommand.GetSourceInfo, { sid });
  }

  browse(sid: MusicSource, cid?: ContainerId, from: number = 0, count: number = 50): Promise<BrowseEntry> {
    if (from < 0) {
      throw new Error('Start index must be greater or equal to 0!');
    }
    if (count < 1 || count > 50) {
      throw new Error('Number of entries must be between 1 and 50!');
    }
    let range = undefined;
    if (cid) {
      range = [from, from + count - 1];
    }
    return this.send(BrowseCommand.Browse, { sid, cid, range });
  }

  getSearchCriteria(sid: MusicSource): Promise<SearchCriteriaInfo> {
    return this.send(BrowseCommand.GetSearchCriteria, { sid });
  }

  search(sid: MusicSource, search: string, scid: SearchCriteria, from: number = 0, count: number = 50): Promise<BrowseEntry> {
    return this.send(BrowseCommand.Search, { sid, search, scid, range: [from, from + count - 1] });
  }

  playStation(pid: PlayerId, sid: MusicSource, mid: MediaId, name: string, cid?: ContainerId): Promise<void> {
    return this.send(BrowseCommand.PlayStream, { pid, sid, mid, name, cid });
  }

  playPreset(pid: PlayerId, preset: number): Promise<void> {
    if (preset < 1) {
      throw new Error('Preset index must be greater or equal to 1!');
    }
    return this.send(BrowseCommand.PlayPreset, { pid, preset });
  }

  playInput(pid: PlayerId, input: Input, spid?: PlayerId): Promise<void> {
    return this.send(BrowseCommand.PlayInput, { pid, spid, input });
  }

  playURL(pid: PlayerId, url: string): Promise<void> {
    return this.send(BrowseCommand.PlayStream, { pid, url });
  }

  addToQueue(pid: PlayerId, sid: MusicSource, cid: ContainerId, aid: QueueType, mid?: MediaId): Promise<void> {
    return this.send(BrowseCommand.AddToQueue, { pid, sid, cid, aid, mid });
  }

  renamePlaylist(sid: MusicSource, cid: ContainerId, name: string): Promise<void> {
    if (name.length > 128) {
      throw new Error('A playlist name can have a maximum of 128 characters!');
    }
    return this.send(BrowseCommand.RenamePlaylist, { sid, cid, name });
  }

  deletePlaylist(sid: MusicSource, cid: ContainerId): Promise<void> {
    return this.send(BrowseCommand.DeletePlaylist, { sid, cid });
  }

  retrieveMetadata(sid: MusicSource, cid: ContainerId): Promise<void> {
    return this.send(BrowseCommand.RetrieveMetadata, { sid, cid });
  }

  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.AddTrackToLibrary, values: { mid: MediaId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.AddAlbumToLibrary, values: { cid: ContainerId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.AddStationToLibrary, values: { mid: MediaId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.AddPlaylistToLibrary, values: { cid: ContainerId; name: string; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.RemoveTrackFromLibrary, values: { mid: MediaId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.RemoveAlbumFromLibrary, values: { cid: ContainerId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.RemoveStationFromLibrary, values: { mid: MediaId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Napster, option: typeof Option.RemovePlaylistFromLibrary, values: { cid: ContainerId; }): Promise<void>;
  setServiceOption(sid: MusicSource, option: typeof Option.ThumbsUp, values: { pid: PlayerId; }): Promise<void>;
  setServiceOption(sid: MusicSource, option: typeof Option.ThumbsDown, values: { pid: PlayerId; }): Promise<void>;
  setServiceOption(sid: typeof MusicSource.Pandora, option: typeof Option.CreateNewStation, values: { scid: typeof SearchCriteria.Artist; range?: Array<number>; }): Promise<Array<ContainerId>>;
  setServiceOption(sid: typeof MusicSource.iHeartRadio, option: typeof Option.CreateNewStation, values: { scid: SearchCriteria; range?: Array<number>; }): Promise<Array<ContainerId>>;
  setServiceOption(sid: MusicSource, option: typeof Option.AddToHEOSFavorites, values: { mid: MediaId; name: string; }): Promise<void>;
  setServiceOption(sid: MusicSource, option: typeof Option.AddToHEOSFavorites, values: { pid: PlayerId; }): Promise<void>;
  setServiceOption(sid: MusicSource, option: typeof Option.RemoveFromHEOSFavorites, values: { mid: MediaId; }): Promise<void>;
  setServiceOption(sid: MusicSource, option: Option, values: Record<string, unknown>): Promise<unknown> {
    return this.send(BrowseCommand.SetServiceOption, Object.assign(values, { sid, option }));
  }
}