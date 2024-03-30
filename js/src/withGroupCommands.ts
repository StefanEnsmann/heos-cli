import { GroupCommand } from "./util/commands.js";
import type { OnOff } from "./util/constants.js";
import type { GroupMessage } from "./util/messages.js";
import type { GroupId, GroupInfo, PlayerId } from "./util/types.js";
import ConnectionWithPlayerCommands from "./withPlayerCommands.js";

export default class ConnectionWithGroupCommands extends ConnectionWithPlayerCommands {
  getGroups(): Promise<Array<GroupInfo>> {
    return this.send(GroupCommand.GetGroups);
  }

  getGroupInfo(gid: GroupId): Promise<GroupInfo> {
    return this.send(GroupCommand.GetGroupInfo, { gid });
  }

  setGroup(leader: PlayerId, members: Array<PlayerId>): Promise<GroupMessage> {
    return this.send(GroupCommand.SetGroup, { pid: [leader, ...members] });
  }

  ungroup(gid: GroupId): Promise<void> {
    return this.send(GroupCommand.SetGroup, { pid: gid });
  }

  getGroupVolume(gid: GroupId): Promise<number> {
    return this.send(GroupCommand.GetVolume, { gid });
  }

  setGroupVolume(gid: GroupId, level: number): Promise<void> {
    if (level < 1 || level > 100) {
      throw new Error('Step value needs to be between 1 and 100!');
    }
    return this.send(GroupCommand.SetVolume, { gid, level });
  }

  groupVolumeUp(gid: GroupId, step: number): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(GroupCommand.VolumeUp, { gid, step });
  }

  groupVolumeDown(gid: GroupId, step: number = 5): Promise<void> {
    if (step < 1 || step > 10) {
      throw new Error('Step value needs to be between 1 and 10!');
    }
    return this.send(GroupCommand.VolumeDown, { gid, step });
  }

  getGroupMute(gid: GroupId): Promise<boolean> {
    return this.send(GroupCommand.GetMute, { gid });
  }

  setGroupMute(gid: GroupId, state: OnOff): Promise<void> {
    return this.send(GroupCommand.SetMute, { gid, state });
  }

  toggleGroupMute(gid: GroupId): Promise<void> {
    return this.send(GroupCommand.ToggleMute, { gid });
  }
}