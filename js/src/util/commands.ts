export const SystemCommand = {
  RegisterForChangeEvents: "system/register_for_change_events",
  CheckAccount: "system/check_account",
  SignIn: "system/sign_in",
  SignOut: "system/sign_out",
  HeartBeat: "system/heart_beat",
  Reboot: "system/reboot",
  PrettifyJsonResponse: "system/prettify_json_response",
} as const;

export type SystemCommand = (typeof SystemCommand)[keyof typeof SystemCommand];

export function isSystemCommand(cmd: string): cmd is SystemCommand {
  return cmd.startsWith("system") && Object.values(SystemCommand as Record<string, string>).includes(cmd);
}

export const PlayerCommand = {
  GetPlayers: "player/get_players",
  GetPlayerInfo: "player/get_player_info",
  GetPlayState: "player/get_play_state",
  SetPlayState: "player/set_play_state",
  GetNowPlayingMedia: "player/get_now_playing_media",
  GetVolume: "player/get_volume",
  SetVolume: "player/set_volume",
  VolumeUp: "player/volume_up",
  VolumeDown: "player/volume_down",
  GetMute: "player/get_mute",
  SetMute: "player/set_mute",
  ToggleMute: "player/toggle_mute",
  GetPlayMode: "player/get_play_mode",
  SetPlayMode: "player/ste_play_mode",
  GetQueue: "player/get_queue",
  PlayQueue: "player/play_queue",
  RemoveFromQueue: "player/remove_from_queue",
  SaveQueue: "player/save_queue",
  ClearQueue: "player/clear_queue",
  MoveQueueItem: "player/move_queue_item",
  PlayNext: "player/play_next",
  PlayPrevious: "player/play_previous",
  SetQuickselect: "player/set_quickselect",
  PlayQuickselect: "player/play_quickselect",
  GetQuickselects: "player/get_quickselects",
  CheckUpdate: "player/check_update",
} as const;

export type PlayerCommand = (typeof PlayerCommand)[keyof typeof PlayerCommand];

export function isPlayerCommand(cmd: string): cmd is PlayerCommand {
  return cmd.startsWith("player") && Object.values(PlayerCommand as Record<string, string>).includes(cmd);
}

export const GroupCommand = {
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

export type GroupCommand = (typeof GroupCommand)[keyof typeof GroupCommand];

export function isGroupCommand(cmd: string): cmd is GroupCommand {
  return cmd.startsWith("group") && Object.values(GroupCommand as Record<string, string>).includes(cmd);
}

export const BrowseCommand = {
  GetMusicSources: "browse/get_music_sources",
  GetSourceInfo: "browse/get_source_info",
  Browse: "browse/browse",
  GetSearchCriteria: "browse/get_search_criteria",
  Search: "browse/search",
  PlayStream: "browse/play_stream",
  PlayPreset: "browse/play_preset",
  PlayInput: "browse/play_input",
  AddToQueue: "browse/add_to_queue",
  RenamePlaylist: "browse/rename_playlist",
  DeletePlaylist: "browse/delete_playlist",
  RetrieveMetadata: "browse/retrieve_metadata",
  GetServiceOptions: "browse/get_service_options",
  SetServiceOption: "browse/set_service_option",
} as const;

export type BrowseCommand = (typeof BrowseCommand)[keyof typeof BrowseCommand];

export function isBrowseCommand(cmd: string): cmd is BrowseCommand {
  return cmd.startsWith("browse") && Object.values(BrowseCommand as Record<string, string>).includes(cmd);
}

export type Command =
  | (typeof SystemCommand)[keyof typeof SystemCommand]
  | (typeof PlayerCommand)[keyof typeof PlayerCommand]
  | (typeof GroupCommand)[keyof typeof GroupCommand]
  | (typeof BrowseCommand)[keyof typeof BrowseCommand];

export function isCommand(cmd: string): cmd is Command {
  return isSystemCommand(cmd)
    || isPlayerCommand(cmd)
    || isGroupCommand(cmd)
    || isBrowseCommand(cmd);
}