import type { Group } from "../commands/group.js";
import type { OnOff } from "../constants.js";
import type { GroupInfo } from "../payloads.js";
import type { CommaSeparatedList, GroupId, PlayerId } from "../types.js";
import type {
  FailableResponse,
  FailableResponseWithPayload,
  PID,
} from "./base.js";

type GID = `gid=${GroupId}`;

export type GetGroups = FailableResponseWithPayload<
  typeof Group.GetGroups,
  "",
  Array<GroupInfo>
>;
export type GetGroupInfo = FailableResponseWithPayload<
  typeof Group.GetGroupInfo,
  GID,
  GroupInfo
>;
export type SetGroup = FailableResponse<
  typeof Group.SetGroup,
  PID | `${GID}&name=${string}&pid=${CommaSeparatedList<PlayerId>}`
>;
export type GetVolume = FailableResponse<
  typeof Group.GetVolume,
  `${GID}&level=${number}`
>;
export type SetVolume = FailableResponse<
  typeof Group.SetVolume,
  `${GID}&level=${number}`
>;
export type VolumeUp = FailableResponse<
  typeof Group.VolumeUp,
  `${GID}&step=${number}`
>;
export type VolumeDown = FailableResponse<
  typeof Group.VolumeDown,
  `${GID}&step=${number}`
>;
export type GetMute = FailableResponse<
  typeof Group.GetMute,
  `${GID}&state=${OnOff}`
>;
export type SetMute = FailableResponse<
  typeof Group.SetMute,
  `${GID}&state=${OnOff}`
>;
export type ToggleMute = FailableResponse<typeof Group.ToggleMute, GID>;
