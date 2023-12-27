import { Result, PlayState, RepeatMode, Error, SystemError, FirmwareVersion, MusicSource, OnOff } from "./constants"
import { BrowseOptions, BrowseEntry, CommaSeparatedList, GroupId, GroupInfo, MusicSourceInfo, PlayerId, PlayerInfo, PlayingMedia, PlayingStationOptions, QueueId, QueueItem, QuickselectId, QuickselectInfo, ContainerId, SearchCriteriaInfo } from "./payloads"

export namespace Command {
  export const enum System {
    RegisterForChangeEvents = "system/register_for_change_events",
    CheckAccount = "system/check_account",
    SignIn = "system/sign_in",
    SignOut = "system/sign_out",
    HeartBeat = "system/heart_beat",
    Reboot = "system/reboot",
    PrettifyJsonResponse = "system/prettify_json_response",
  }

  export const enum Player {
    GetPlayers = "player/get_players",
    GetPlayerInfo = "player/get_player_info",
    GetPlayState = "player/get_play_state",
    SetPlayState = "player/set_play_state",
    GetNowPlayingMedia = "player/get_now_playing_media",
    GetVolume = "player/get_volume",
    SetVolume = "player/set_volume",
    VolumeUp = "player/volume_up",
    VolumeDown = "player/volume_down",
    GetMute = "player/get_mute",
    SetMute = "player/set_mute",
    ToggleMute = "player/toggle_mute",
    GetPlayMode = "player/get_play_mode",
    SetPlayMode = "player/ste_play_mode",
    GetQueue = "player/get_queue",
    PlayQueue = "player/play_queue",
    RemoveFromQueue = "player/remove_from_queue",
    SaveQueue = "player/save_queue",
    ClearQueue = "player/clear_queue",
    MoveQueueItem = "player/move_queue_item",
    PlayNext = "player/play_next",
    PlayPrevious = "player/play_previous",
    SetQuickselect = "player/set_quickselect",
    PlayQuickselect = "player/play_quickselect",
    GetQuickselects = "player/get_quickselects",
    CheckUpdate = "player/check_update",
  }

  export const enum Group {
    GetGroups = "group/get_groups",
    GetGroupInfo = "group/get_group_info",
    SetGroup = "group/set_group",
    GetVolume = "group/get_volume",
    SetVolume = "group/set_volume",
    VolumeUp = "group/volume_up",
    VolumeDown = "group/volume_down",
    GetMute = "group/get_mute",
    SetMute = "group/set_mute",
    ToggleMute = "group/toggle_mute",
  }

  export const enum Browse {
    GetMusicSources = "browse/get_music_sources",
    GetSourceInfo = "browse/get_source_info",
    Browse = "browse/browse",
    GetSearchCriteria = "browse/get_search_criteria",
    Search = "browse/search",
    PlayStream = "browse/play_stream",
    PlayPreset = "browse/play_preset",
    PlayInput = "browse/play_input",
    AddToQueue = "browse/add_to_queue",
    RenamePlaylist = "browse/rename_playlist",
    DeletePlaylist = "browse/delete_playlist",
    RetrieveMetadata = "browse/retrieve_metadata",
    GetServiceOptions = "browse/get_service_options",
    SetServiceOption = "browse/set_service_option",
  }

  export type All = System | Player | Group | Browse
}

export namespace Response {
  type PID = `pid=${PlayerId}`
  type GID = `gid=${GroupId}`

  type FailedResponse<Command extends Command.All> = {
    heos: {
      command: Command
      result: Result.Fail,
      message: Error | SystemError
    }
  }

  type SuccessfulResponse<Command extends Command.All, SuccessMessage extends string> = {
    heos: {
      command: Command
      result: Result.Success
      message: SuccessMessage
    }
  }

  type FailableResponse<Command extends Command.All, SuccessMessage extends string> = SuccessfulResponse<Command, SuccessMessage> | FailedResponse<Command>

  type FailableResponseWithPayload<Command extends Command.All, SuccessMessage extends string, Payload extends Object | Array<any>> =
    (SuccessfulResponse<Command, SuccessMessage> & { payload: Payload }) | FailedResponse<Command>

  type FailableResponseWithPayloadAndOptions<Command extends Command.All, SuccessMessage extends string, Payload extends Object | Array<any>, Options extends Array<any>> =
    (SuccessfulResponse<Command, SuccessMessage> & { payload: Payload, options: Options }) | FailedResponse<Command>

  export namespace System {
    export type RegisterForChangeEvents = FailableResponse<Command.System.RegisterForChangeEvents, `enable=${OnOff}`>
    export type CheckAccount = FailableResponse<Command.System.CheckAccount, `signed_in&un=${string}` | "signed_out">
    export type SignIn = FailableResponse<Command.System.SignIn, `signed_in&un=${string}`>
    export type SignOut = FailableResponse<Command.System.SignIn, "signed_out">
    export type HeartBeat = FailableResponse<Command.System.HeartBeat, "">
    export type Reboot = FailableResponse<Command.System.Reboot, "">
    export type PrettifyJsonResponse = FailableResponse<Command.System.PrettifyJsonResponse, `enable=${OnOff}`>
  }

  export namespace Player {
    export type GetPlayers = FailableResponseWithPayload<Command.Player.GetPlayers, "", Array<PlayerInfo>>
    export type GetPlayerInfo = FailableResponseWithPayload<Command.Player.GetPlayerInfo, "", PlayerInfo>
    export type GetPlayState = FailableResponse<Command.Player.GetPlayState, `${PID}&state=${PlayState}`>
    export type SetPlayState = FailableResponse<Command.Player.SetPlayState, `${PID}&state=${PlayState}`>
    export type GetNowPlayingMedia = FailableResponseWithPayload<Command.Player.GetNowPlayingMedia, PID, Extract<PlayingMedia, {type: "song"}>>
      | FailableResponseWithPayloadAndOptions<Command.Player.GetNowPlayingMedia, PID, Extract<PlayingMedia, {type: "station"}>, PlayingStationOptions>
    export type GetVolume = FailableResponse<Command.Player.GetVolume, `${PID}&level=${number}`>
    export type SetVolume = FailableResponse<Command.Player.GetVolume, `${PID}&level=${number}`>
    export type VolumeUp = FailableResponse<Command.Player.VolumeUp, `${PID}&step=${number}`>
    export type VolumeDown = FailableResponse<Command.Player.VolumeDown, `${PID}&step=${number}`>
    export type GetMute = FailableResponse<Command.Player.GetMute, `${PID}&state=${OnOff}`>
    export type SetMute = FailableResponse<Command.Player.SetMute, `${PID}&state=${OnOff}`>
    export type ToggleMute = FailableResponse<Command.Player.ToggleMute, PID>
    export type GetPlayMode = FailableResponse<Command.Player.GetPlayMode, `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`>
    export type SetPlayMode = FailableResponse<Command.Player.SetPlayMode, `${PID}&repeat=${RepeatMode}&shuffle=${OnOff}`>
    export type GetQueue = FailableResponseWithPayload<Command.Player.GetQueue, PID | `${PID}&range=${number},${number}`, Array<QueueItem>>
    export type PlayQueue = FailableResponse<Command.Player.PlayQueue, `${PID}&qid=${QueueId}`>
    export type RemoveFromQueue = FailableResponse<Command.Player.RemoveFromQueue, `${PID}&qid=${CommaSeparatedList<QueueId>}`> // No typing possible for comma separated list
    export type SaveQueue = FailableResponse<Command.Player.SaveQueue, `${PID}&name=${string}`>
    export type ClearQueue = FailableResponse<Command.Player.ClearQueue, PID>
    export type MoveQueueItem = FailableResponse<Command.Player.MoveQueueItem, `${PID}&sqid=${CommaSeparatedList<QueueId>}&dqid=${QueueId}`>
    export type PlayNext = FailableResponse<Command.Player.PlayNext, PID>
    export type PlayPrevious = FailableResponse<Command.Player.PlayPrevious, PID>
    export type SetQuickselect = FailableResponse<Command.Player.SetQuickselect, `${PID}$id=${QuickselectId}`>
    export type PlayQuickselect = FailableResponse<Command.Player.PlayQuickselect, `${PID}&id=${QuickselectId}`>
    export type GetQuickselects = FailableResponseWithPayload<Command.Player.GetQuickselects, PID, Array<QuickselectInfo>>
    export type CheckUpdate = FailableResponseWithPayload<Command.Player.CheckUpdate, PID, { update: FirmwareVersion}>
  }

  export namespace Group {
    export type GetGroups = FailableResponseWithPayload<Command.Group.GetGroups, "", Array<GroupInfo>>
    export type GetGroupInfo = FailableResponseWithPayload<Command.Group.GetGroupInfo, GID, GroupInfo>
    export type SetGroup = FailableResponse<Command.Group.SetGroup, PID | `${GID}&name=${string}&pid=${CommaSeparatedList<PlayerId>}`>
    export type GetVolume = FailableResponse<Command.Group.GetVolume, `${GID}&level=${number}`>
    export type SetVolume = FailableResponse<Command.Group.SetVolume, `${GID}&level=${number}`>
    export type VolumeUp = FailableResponse<Command.Group.VolumeUp, `${GID}&step=${number}`>
    export type VolumeDown = FailableResponse<Command.Group.VolumeDown, `${GID}&step=${number}`>
    export type GetMute = FailableResponse<Command.Group.GetMute, `${GID}&state=${OnOff}`>
    export type SetMute = FailableResponse<Command.Group.SetMute, `${GID}&state=${OnOff}`>
    export type ToggleMute = FailableResponse<Command.Group.ToggleMute, GID>
  }

  export namespace Browse {
    export type GetMusicSources = FailableResponseWithPayload<Command.Browse.GetMusicSources, "", Array<MusicSourceInfo>>
    export type GetSourceInfo = FailableResponseWithPayload<Command.Browse.GetSourceInfo, "", Array<MusicSourceInfo>>
    export type Browse = FailableResponseWithPayloadAndOptions<Command.Browse.Browse, `sid=${MusicSource}&returned=${number}&count=${number}` | `sid=${MusicSource}&cid=${ContainerId}&range=${number},${number}&returned=${number}&count=${number}`, Array<BrowseEntry>, BrowseOptions>
    export type GetSearchCriteria = FailableResponseWithPayload<Command.Browse.GetSearchCriteria, `sid=${MusicSource}`, Array<SearchCriteriaInfo>>
    export type Search = FailableResponseWithPayloadAndOptions<Command.Browse.Search, ``, Array<BrowseEntry>, BrowseOptions>
  }
}
