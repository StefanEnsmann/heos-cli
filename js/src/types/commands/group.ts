export const Group = {
  GetGroups: "group/get_groups",
  GetGroupInfo: "group/get_group_info",
  SetGroup: "group/set_group",
  GetVolume: "group/get_volume",
  SetVolume: "group/set_volume",
  VolumeUp: "group/volume_up",
  VolumeDown: "group/volume_down",
  GetMute: "group/get_mute",
  SetMute: "group/set_mute",
  ToggleMute: "group/toggle_mute",
} as const;

export type Group = (typeof Group)[keyof typeof Group];
