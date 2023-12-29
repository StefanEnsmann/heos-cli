import type { Group } from "../commands/group.js";
import type { OnOff } from "../constants.js";
import type { GroupInfo } from "../payloads.js";
import type { CommaSeparatedList, GroupId, PlayerId } from "../types.js";
import type { SuccessfulResponse, PID, WithPayload } from "./base.js";

type GID = `gid=${GroupId}`;

export type GetGroups = WithPayload<
  SuccessfulResponse<typeof Group.GetGroups, "">,
  Array<GroupInfo>
>;

export type GetGroupInfo = WithPayload<
  SuccessfulResponse<typeof Group.GetGroupInfo, GID>,
  GroupInfo
>;

export type SetGroup = SuccessfulResponse<
  typeof Group.SetGroup,
  PID | `${GID}&name=${string}&pid=${CommaSeparatedList<PlayerId>}`
>;

export type GetVolume = SuccessfulResponse<
  typeof Group.GetVolume,
  `${GID}&level=${number}`
>;

export type SetVolume = SuccessfulResponse<
  typeof Group.SetVolume,
  `${GID}&level=${number}`
>;

export type VolumeUp = SuccessfulResponse<
  typeof Group.VolumeUp,
  `${GID}&step=${number}`
>;

export type VolumeDown = SuccessfulResponse<
  typeof Group.VolumeDown,
  `${GID}&step=${number}`
>;

export type GetMute = SuccessfulResponse<
  typeof Group.GetMute,
  `${GID}&state=${OnOff}`
>;

export type SetMute = SuccessfulResponse<
  typeof Group.SetMute,
  `${GID}&state=${OnOff}`
>;

export type ToggleMute = SuccessfulResponse<typeof Group.ToggleMute, GID>;

export type GroupResponse =
  | GetGroups
  | GetGroupInfo
  | SetGroup
  | GetVolume
  | SetVolume
  | VolumeUp
  | VolumeDown
  | GetMute
  | SetMute
  | ToggleMute;
