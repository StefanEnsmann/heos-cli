import { type Command, SystemCommand, PlayerCommand, GroupCommand, BrowseCommand } from "./commands.js";
import { Result, CommandUnderProcess, type HEOSError, type OnOff, SignedIn, SignedOut, PlayState, RepeatMode, FirmwareVersion, MusicSource, SearchCriteria } from "./constants.js";
import { Event } from "./events.js";
import type { BrowseEntry, BrowseOption, CommaSeparatedList, ContainerId, GroupId, GroupInfo, MusicSourceInfo, OptionalString, PlayerId, PlayerInfo, PlayingMedia, PlayingStationOption, QueueId, QueueItem, QuickselectId, QuickselectInfo, SearchCriteriaInfo } from "./types.js";

///
/// Generic Responses
///

export type Response = CommandResponse | EventResponse;

export type CommandResponse = {
  heos: {
    command: Command,
    result: Result,
    message: string,
  },
  payload?: Array<unknown> | object,
  options?: Array<unknown>,
};

export function isCommandResponse(response: Response): response is CommandResponse {
  return !response.heos.command.startsWith("event");
}

export type FailedResponse = {
  heos: {
    command: Command,
    result: typeof Result.Fail,
    message: `eid=${HEOSError}&text=${string}`,
  };
};

export function isFailedResponse(response: Response): response is FailedResponse {
  return isCommandResponse(response) && response.heos.result === Result.Fail;
}

export type CommandUnderProcessResponse = {
  heos: {
    command: Command,
    result: typeof Result.Success,
    message: `${typeof CommandUnderProcess}&${string}`,
  };
};

export function isCommandUnderProcessResponse(response: Response): response is CommandUnderProcessResponse {
  return isCommandResponse(response) && response.heos.message.startsWith(CommandUnderProcess);
}

export type SuccessfulResponse = {
  heos: {
    command: Command,
    result: typeof Result.Success,
    message: string,
  },
  payload?: Array<unknown> | object,
  options?: Array<unknown>,
};

export function isSuccessfulResponse(response: Response): response is SuccessfulResponse {
  return isCommandResponse(response) && response.heos.result === Result.Success;
}

export type EventResponse = {
  heos: {
    command: Event,
    message?: string,
  };
};

export function isEventResponse(response: Response): response is EventResponse {
  return response.heos.command.startsWith("event");
}

///
/// Event Responses
///

export type SourcesChangedResponse = {
  heos: {
    command: typeof Event.SourcesChanged,
  },
};

export function isSourcesChangedResponse(response: Response): response is SourcesChangedResponse {
  return response.heos.command === Event.SourcesChanged;
}

export type PlayersChangedResponse = {
  heos: {
    command: typeof Event.PlayersChanged,
  },
};

export function isPlayersChangedResponse(response: Response): response is PlayersChangedResponse {
  return response.heos.command === Event.PlayersChanged;
}

export type GroupsChangedResponse = {
  heos: {
    command: typeof Event.GroupsChanged,
  },
};

export function isGroupsChangedResponse(response: Response): response is GroupsChangedResponse {
  return response.heos.command === Event.GroupsChanged;
}

export type PlayerStateChangedResponse = {
  heos: {
    command: typeof Event.PlayerStateChanged,
    message: `pid=${PlayerId}&state=${PlayState}`,
  };
};

export function isPlayerStateChangedResponse(response: Response): response is PlayerStateChangedResponse {
  return response.heos.command === Event.PlayerStateChanged;
}

export type PlayerNowPlayingChangedResponse = {
  heos: {
    command: typeof Event.PlayerNowPlayingChanged,
    message: `pid=${PlayerId}`,
  };
};

export function isPlayerNowPlayingChangedResponse(response: Response): response is PlayerNowPlayingChangedResponse {
  return response.heos.command === Event.PlayerNowPlayingChanged;
}

export type PlayerNowPlayingProgressResponse = {
  heos: {
    command: typeof Event.PlayerNowPlayingProgress,
    message: `pid=${PlayerId}&cur_pos=${number}&duration=${number}`,
  };
};

export function isPlayerNowPlayingProgressResponse(response: Response): response is PlayerNowPlayingProgressResponse {
  return response.heos.command === Event.PlayerNowPlayingProgress;
}

export type PlayerPlaybackErrorResponse = {
  heos: {
    command: typeof Event.PlayerPlaybackError,
    message: `pid=${PlayerId}&error=${string}`,
  };
};

export function isPlayerPlaybackErrorResponse(response: Response): response is PlayerPlaybackErrorResponse {
  return response.heos.command === Event.PlayerPlaybackError;
}

export type PlayerQueueChangedResponse = {
  heos: {
    command: typeof Event.PlayerQueueChanged,
    message: `pid=${PlayerId}`,
  };
};

export function isPlayerQueueChangedResponse(response: Response): response is PlayerQueueChangedResponse {
  return response.heos.command === Event.PlayerQueueChanged;
}

export type PlayerVolumeChangedResponse = {
  heos: {
    command: typeof Event.PlayerVolumeChanged,
    message: `pid=${PlayerId}&level=${number}&mute=${OnOff}`,
  };
};

export function isPlayerVolumeChangedResponse(response: Response): response is PlayerVolumeChangedResponse {
  return response.heos.command === Event.PlayerVolumeChanged;
}

export type RepeatModeChangedResponse = {
  heos: {
    command: typeof Event.RepeatModeChanged,
    message: `pid=${PlayerId}&repeat=${RepeatMode}`,
  };
};

export function isRepeatModeChangedResponse(response: Response): response is RepeatModeChangedResponse {
  return response.heos.command === Event.RepeatModeChanged;
}

export type ShuffleModeChangedResponse = {
  heos: {
    command: typeof Event.ShuffleModeChanged,
    message: `pid=${PlayerId}&shuffle=${OnOff}`,
  };
};

export function isShuffleModeChangedResponse(response: Response): response is ShuffleModeChangedResponse {
  return response.heos.command === Event.ShuffleModeChanged;
}

export type GroupVolumeChangedResponse = {
  heos: {
    command: typeof Event.GroupVolumeChanged,
    message: `gid=${GroupId}&level=${number}&mute=${OnOff}`,
  };
};

export function isGroupVolumeChangedResponse(response: Response): response is GroupVolumeChangedResponse {
  return response.heos.command === Event.GroupVolumeChanged;
}

export type UserChangedResponse = {
  heos: {
    command: typeof Event.UserChanged,
    message: `${typeof SignedIn}&un=${string}` | typeof SignedOut,
  };
};

export function isUserChangedResponse(response: Response): response is UserChangedResponse {
  return response.heos.command === Event.UserChanged;
}

///
/// System Command Responses
///

export type RegisterForChangeEventsResponse = {
  heos: {
    command: typeof SystemCommand.RegisterForChangeEvents,
    result: typeof Result.Success,
    message: `enable=${OnOff}`,
  },
};

export function isRegisterForChangeEventsResponse(response: Response): response is RegisterForChangeEventsResponse {
  return response.heos.command === SystemCommand.RegisterForChangeEvents;
}

export type CheckAccountResponse = {
  heos: {
    command: typeof SystemCommand.CheckAccount,
    result: typeof Result.Success,
    message: `${typeof SignedIn}&un=${string}` | typeof SignedOut,
  },
};

export function isCheckAccountResponse(response: Response): response is CheckAccountResponse {
  return response.heos.command === SystemCommand.CheckAccount;
}

export type SignInResponse = {
  heos: {
    command: typeof SystemCommand.SignIn,
    result: typeof Result.Success,
    message: `${typeof SignedIn}&un=${string}`,
  },
};

export function isSignInResponse(response: Response): response is SignInResponse {
  return response.heos.command === SystemCommand.SignIn;
}

export type SignOutResponse = {
  heos: {
    command: typeof SystemCommand.SignOut,
    result: typeof Result.Success,
    message: typeof SignedOut,
  },
};

export function isSignOutResponse(response: Response): response is SignOutResponse {
  return response.heos.command === SystemCommand.SignOut;
}

export type HeartBeatResponse = {
  heos: {
    command: typeof SystemCommand.HeartBeat,
    result: typeof Result.Success,
    message: "",
  },
};

export function isHeartBeatResponse(response: Response): response is HeartBeatResponse {
  return response.heos.command === SystemCommand.HeartBeat;
}

export type RebootResponse = {
  heos: {
    command: typeof SystemCommand.Reboot,
    result: typeof Result.Success,
    message: "",
  },
};

export function isRebootResponse(response: Response): response is RebootResponse {
  return response.heos.command === SystemCommand.HeartBeat;
}

export type PrettifyJsonResponse = {
  heos: {
    command: typeof SystemCommand.PrettifyJsonResponse,
    result: typeof Result.Success,
    message: `enable=${OnOff}`,
  },
};

export function isPrettifyJsonResponse(response: Response): response is PrettifyJsonResponse {
  return response.heos.command === SystemCommand.PrettifyJsonResponse;
}

///
/// Player Responses
///

export type GetPlayersResponse = {
  heos: {
    command: typeof PlayerCommand.GetPlayers,
    result: typeof Result.Success,
    message: "",
  },
  payload: Array<PlayerInfo>,
};

export function isGetPlayersResponse(response: Response): response is GetPlayersResponse {
  return response.heos.command === PlayerCommand.GetPlayers;
}

export type GetPlayerInfoResponse = {
  heos: {
    command: typeof PlayerCommand.GetPlayerInfo,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  },
  payload: PlayerInfo,
};

export function isGetPlayerInfoResponse(response: Response): response is GetPlayerInfoResponse {
  return response.heos.command === PlayerCommand.GetPlayerInfo;
}

export type GetPlayStateResponse = {
  heos: {
    command: typeof PlayerCommand.GetPlayState,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&state=${PlayState}`,
  },
};

export function isGetPlayStateResponse(response: Response): response is GetPlayStateResponse {
  return response.heos.command === PlayerCommand.GetPlayState;
}

export type SetPlayStateResponse = {
  heos: {
    command: typeof PlayerCommand.SetPlayState,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&state=${PlayState}`,
  },
};

export function isSetPlayStateResponse(response: Response): response is SetPlayStateResponse {
  return response.heos.command === PlayerCommand.SetPlayState;
}

export type GetNowPlayingMediaResponse = {
  heos: {
    command: typeof PlayerCommand.GetNowPlayingMedia,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  },
  payload: PlayingMedia,
  options?: Array<PlayingStationOption>,
};

export function isGetNowPlayingMediaResponse(response: Response): response is GetNowPlayingMediaResponse {
  return response.heos.command === PlayerCommand.GetNowPlayingMedia;
}

export type GetPlayerVolumeResponse = {
  heos: {
    command: typeof PlayerCommand.GetVolume,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&level=${number}`,
  },
};

export function isGetPlayerVolumeResponse(response: Response): response is GetPlayerVolumeResponse {
  return response.heos.command === PlayerCommand.GetVolume;
}

export type SetPlayerVolumeResponse = {
  heos: {
    command: typeof PlayerCommand.SetVolume,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&level=${number}`,
  },
};

export function isSetPlayerVolumeResponse(response: Response): response is SetPlayerVolumeResponse {
  return response.heos.command === PlayerCommand.SetVolume;
}

export type PlayerVolumeUpResponse = {
  heos: {
    command: typeof PlayerCommand.VolumeUp,
    result: typeof Result.Success,
    message: `pid=${PlayerId}${OptionalString<`&step=${number}`>}`,
  },
};

export function isPlayerVolumeUpResponse(response: Response): response is PlayerVolumeUpResponse {
  return response.heos.command === PlayerCommand.VolumeUp;
}

export type PlayerVolumeDownResponse = {
  heos: {
    command: typeof PlayerCommand.VolumeDown,
    result: typeof Result.Success,
    message: `pid=${PlayerId}${OptionalString<`&step=${number}`>}`,
  },
};

export function isPlayerVolumeDownResponse(response: Response): response is PlayerVolumeDownResponse {
  return response.heos.command === PlayerCommand.VolumeDown;
}

export type GetPlayerMuteResponse = {
  heos: {
    command: typeof PlayerCommand.GetMute,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&state=${OnOff}`,
  },
};

export function isGetPlayerMuteResponse(response: Response): response is GetPlayerMuteResponse {
  return response.heos.command === PlayerCommand.GetMute;
}

export type SetPlayerMuteResponse = {
  heos: {
    command: typeof PlayerCommand.SetMute,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&state=${OnOff}`,
  },
};

export function isSetPlayerMuteResponse(response: Response): response is SetPlayerMuteResponse {
  return response.heos.command === PlayerCommand.SetMute;
}

export type TogglePlayerMuteResponse = {
  heos: {
    command: typeof PlayerCommand.ToggleMute,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  },
};

export function isTogglePlayerMuteResponse(response: Response): response is TogglePlayerMuteResponse {
  return response.heos.command === PlayerCommand.ToggleMute;
}

export type GetPlayModeResponse = {
  heos: {
    command: typeof PlayerCommand.GetPlayMode,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&repeat=${RepeatMode}&shuffle=${OnOff}`;
  };
};

export function isGetPlayModeResponse(response: Response): response is GetPlayModeResponse {
  return response.heos.command === PlayerCommand.GetPlayMode;
}

export type SetPlayModeResponse = {
  heos: {
    command: typeof PlayerCommand.SetPlayMode,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&repeat=${RepeatMode}&shuffle=${OnOff}`;
  };
};

export function isSetPlayModeResponse(response: Response): response is SetPlayModeResponse {
  return response.heos.command === PlayerCommand.SetPlayMode;
}

export type GetQueueResponse = {
  heos: {
    command: typeof PlayerCommand.GetQueue,
    result: typeof Result.Success,
    message: `pid=${PlayerId}${OptionalString<`&range=${number},${number}`>}`;
  };
  payload: Array<QueueItem>,
};

export function isGetQueueResponse(response: Response): response is GetQueueResponse {
  return response.heos.command === PlayerCommand.GetQueue;
}

export type PlayQueueResponse = {
  heos: {
    command: typeof PlayerCommand.PlayQueue,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
};

export function isPlayQueueResponse(response: Response): response is PlayQueueResponse {
  return response.heos.command === PlayerCommand.PlayQueue;
}

export type RemoveFromQueueResponse = {
  heos: {
    command: typeof PlayerCommand.RemoveFromQueue,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&qid=${CommaSeparatedList<QueueId>}`,
  };
};

export function isRemoveFromQueueResponse(response: Response): response is RemoveFromQueueResponse {
  return response.heos.command === PlayerCommand.RemoveFromQueue;
}

export type SaveQueueResponse = {
  heos: {
    command: typeof PlayerCommand.SaveQueue,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&name=${string}`,
  };
};

export function isSaveQueueResponse(response: Response): response is SaveQueueResponse {
  return response.heos.command === PlayerCommand.SaveQueue;
}

export type ClearQueueResponse = {
  heos: {
    command: typeof PlayerCommand.ClearQueue,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
};

export function isClearQueueResponse(response: Response): response is ClearQueueResponse {
  return response.heos.command === PlayerCommand.ClearQueue;
}

export type MoveQueueItemResponse = {
  heos: {
    command: typeof PlayerCommand.MoveQueueItem,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&qid=${CommaSeparatedList<QueueId>}&dqid=${QueueId}`,
  };
};

export function isMoveQueueItemResponse(response: Response): response is MoveQueueItemResponse {
  return response.heos.command === PlayerCommand.MoveQueueItem;
}

export type PlayNextResponse = {
  heos: {
    command: typeof PlayerCommand.PlayNext,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
};

export function isPlayNextResponse(response: Response): response is PlayNextResponse {
  return response.heos.command === PlayerCommand.PlayNext;
}

export type PlayPreviousResponse = {
  heos: {
    command: typeof PlayerCommand.PlayPrevious,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
};

export function isPlayPreviousResponse(response: Response): response is PlayPreviousResponse {
  return response.heos.command === PlayerCommand.PlayPrevious;
}

export type SetQuickselectResponse = {
  heos: {
    command: typeof PlayerCommand.SetQuickselect,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&id=${QuickselectId}`,
  };
};

export function isSetQuickselectResponse(response: Response): response is SetQuickselectResponse {
  return response.heos.command === PlayerCommand.SetQuickselect;
}

export type PlayQuickselectResponse = {
  heos: {
    command: typeof PlayerCommand.PlayQuickselect,
    result: typeof Result.Success,
    message: `pid=${PlayerId}&id=${QuickselectId}`,
  };
};

export function isPlayQuickselectResponse(response: Response): response is PlayQuickselectResponse {
  return response.heos.command === PlayerCommand.PlayQuickselect;
}

export type GetQuickselectsResponse = {
  heos: {
    command: typeof PlayerCommand.GetQuickselects,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
  payload: Array<QuickselectInfo>;
};

export function isGetQuickselectsResponse(response: Response): response is GetQuickselectsResponse {
  return response.heos.command === PlayerCommand.GetQuickselects;
}

export type CheckUpdateResponse = {
  heos: {
    command: typeof PlayerCommand.CheckUpdate,
    result: typeof Result.Success,
    message: `pid=${PlayerId}`,
  };
  payload: {
    update: FirmwareVersion;
  };
};

export function isCheckUpdateResponse(response: Response): response is CheckUpdateResponse {
  return response.heos.command === PlayerCommand.CheckUpdate;
}

///
/// Group Responses
///

export type GetGroupsResponse = {
  heos: {
    command: typeof GroupCommand.GetGroups,
    result: typeof Result.Success,
    message: "",
  },
  payload: Array<GroupInfo>,
};

export function isGetGroupsResponse(response: Response): response is GetGroupsResponse {
  return response.heos.command === GroupCommand.GetGroups;
}

export type GetGroupInfoResponse = {
  heos: {
    command: typeof GroupCommand.GetGroupInfo,
    result: typeof Result.Success,
    message: `gid=${GroupId}`,
  },
  payload: GroupInfo,
};

export function isGetGroupInfoResponse(response: Response): response is GetGroupInfoResponse {
  return response.heos.command === GroupCommand.GetGroupInfo;
}

export type SetGroupResponse = {
  heos: {
    command: typeof GroupCommand.SetGroup,
    result: typeof Result.Success,
    message: `pid=${PlayerId}` | `gid=${GroupId}&name=${string}&pid=${CommaSeparatedList<`${PlayerId}`>}`;
  };
};

export function isSetGroupResponse(response: Response): response is SetGroupResponse {
  return response.heos.command === GroupCommand.SetGroup;
}

export type GetGroupVolumeResponse = {
  heos: {
    command: typeof GroupCommand.GetVolume,
    result: typeof Result.Success,
    message: `gid=${GroupId}&level=${number}`,
  },
};

export function isGetGroupVolumeResponse(response: Response): response is GetGroupVolumeResponse {
  return response.heos.command === GroupCommand.GetVolume;
}

export type SetGroupVolumeResponse = {
  heos: {
    command: typeof GroupCommand.SetVolume,
    result: typeof Result.Success,
    message: `gid=${GroupId}&level=${number}`,
  },
};

export function isSetGroupVolumeResponse(response: Response): response is SetGroupVolumeResponse {
  return response.heos.command === GroupCommand.SetVolume;
}

export type GroupVolumeUpResponse = {
  heos: {
    command: typeof GroupCommand.VolumeUp,
    result: typeof Result.Success,
    message: `gid=${GroupId}${OptionalString<`&step=${number}`>}`,
  },
};

export function isGroupVolumeUpResponse(response: Response): response is GroupVolumeUpResponse {
  return response.heos.command === GroupCommand.VolumeUp;
}

export type GroupVolumeDownResponse = {
  heos: {
    command: typeof GroupCommand.VolumeDown,
    result: typeof Result.Success,
    message: `gid=${GroupId}${OptionalString<`&step=${number}`>}`,
  },
};

export function isGroupVolumeDownResponse(response: Response): response is GroupVolumeDownResponse {
  return response.heos.command === GroupCommand.VolumeDown;
}

export type GetGroupMuteResponse = {
  heos: {
    command: typeof GroupCommand.GetMute,
    result: typeof Result.Success,
    message: `gid=${GroupId}&state=${OnOff}`,
  },
};

export function isGetGroupMuteResponse(response: Response): response is GetGroupMuteResponse {
  return response.heos.command === GroupCommand.GetMute;
}

export type SetGroupMuteResponse = {
  heos: {
    command: typeof GroupCommand.SetMute,
    result: typeof Result.Success,
    message: `gid=${GroupId}&state=${OnOff}`,
  },
};

export function isSetGroupMuteResponse(response: Response): response is SetGroupMuteResponse {
  return response.heos.command === GroupCommand.SetMute;
}

export type ToggleGroupMuteResponse = {
  heos: {
    command: typeof GroupCommand.ToggleMute,
    result: typeof Result.Success,
    message: `gid=${GroupId}`,
  },
};

export function isToggleGroupMuteResponse(response: Response): response is ToggleGroupMuteResponse {
  return response.heos.command === GroupCommand.ToggleMute;
}

///
/// Browse Responses
///

export type GetMusicSourcesResponse = {
  heos: {
    command: typeof BrowseCommand.GetMusicSources;
    result: typeof Result.Success;
    message: "";
  };
  payload: Array<MusicSourceInfo>;
};

export function isGetMusicSourcesResponse(response: Response): response is GetMusicSourcesResponse {
  return response.heos.command === BrowseCommand.GetMusicSources;
}

export type GetSourceInfoResponse = {
  heos: {
    command: typeof BrowseCommand.GetSourceInfo;
    result: typeof Result.Success;
    message: `sid=${MusicSource}`;
  };
  payload: MusicSourceInfo;
};

export function isGetSourceInfoResponse(response: Response): response is GetSourceInfoResponse {
  return response.heos.command === BrowseCommand.GetSourceInfo;
}

export type BrowseResponse = {
  heos: {
    command: typeof BrowseCommand.Browse,
    result: typeof Result.Success;
    message: `sid=${MusicSource}${OptionalString<`&cid=${ContainerId}&range=${number},${number}`>}&returned=${number}&count=${number}`;
  };
  payload: Array<BrowseEntry>;
  options: Array<BrowseOption>;
};

export function isBrowseResponse(response: Response): response is BrowseResponse {
  return response.heos.command === BrowseCommand.Browse;
}

export type GetSearchCriteriaResponse = {
  heos: {
    command: typeof BrowseCommand.GetSearchCriteria;
    result: typeof Result.Success;
    message: `sid=${MusicSource}`;
  };
  payload: Array<SearchCriteriaInfo>;
};

export function isGetSearchCriteriaResponse(response: Response): response is GetSearchCriteriaResponse {
  return response.heos.command === BrowseCommand.GetSearchCriteria;
}

export type SearchResponse = {
  heos: {
    command: typeof BrowseCommand.Search,
    result: typeof Result.Success;
    message: `sid=${MusicSource}&search=${string}&scid=${SearchCriteria}${OptionalString<`}&range=${number},${number}`>}&returned=${number}&count=${number}`;
  };
  payload: Array<BrowseEntry>;
  options: Array<BrowseOption>;
};

export function isSearchResponse(response: Response): response is SearchResponse {
  return response.heos.command === BrowseCommand.Search;
}