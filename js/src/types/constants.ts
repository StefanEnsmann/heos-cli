export const enum HEOSMusicSource {
  Pandora = 1,
  Rhapsody = 2,
  TuneIn = 3,
  Spotify = 4,
  Deezer = 5,
  Napster = 6,
  iHeartRadio = 7,
  SiriusXM = 8,
  Soundcloud = 9,
  Tidal = 10,
  // FutureService = 11,
  Rdio = 12,
  AmazonMusic = 13,
  // FutureService = 14,
  Moodmix = 15,
  Juke = 16,
  // FutureService = 17,
  QMusic = 18,
  LocalMedia = 1024,
  HEOSPlaylists = 1025,
  HEOSHistory = 1026,
  HEOSAuxInputs = 1027,
  HEOSFavorites = 1028,
}

export const enum Result {
  Success = 'success',
  Fail = 'fail',
}

export const enum Enable {
  On = "on",
  Off = "off",
}

export const enum Network {
  Wired = "wired",
  WiFi = "wifi",
  Unknown = "unknown",
}

export const enum LineOut {
  Variable = "variable",
  Fixed = "fixed",
}

export const enum Control {
  None = "none",
  IR = "ir",
  Trigger = "trigger",
  Network = "network",
}

export const enum PlayState {
  Play = "play",
  Pause = "pause",
  Stop = "stop",
}

export const enum Mute {
  On = "on",
  Off = "off",
}

export const enum RepeatMode {
  RepeatAll = "on_all",
  RepeatOne = "on_one",
  Off = "off",
}

export const enum ShuffleMode {
  On = "on",
  Off = "off",
}

export const enum QueueType {
  PlayNow = 1,
  PlayNext = 2,
  AddToEnd = 3,
  ReplaceAndPlay = 4,
}

export const enum Options {
  AddTrackToLibrary = 1,
  AddAlbumToLibrary = 2,
  AddStationToLibrary = 3,
  AddPlaylistToLibrary = 4,
  RemoveTrackFromLibrary = 5,
  RemoveAlbumFromLibrary = 6,
  RemoveStationFromLibrary = 7,
  RemovePlaylistFromLibrary = 8,
  ThumbsUp = 11,
  ThumbsDown = 12,
  CreateNewStation = 13,
  AddToHEOSFavorites = 19,
  RemoveFromHEOSFavorites = 20,
  PlayableContainer = 21,
}

export const enum CreateStationOptions {
  Artist = 1,
  Track = 3,
  Show = 5,
}

export const enum FirmwareVersion {
  NoUpdate = "update_none",
  UpdateAvailable = "update_exist",
}

export const enum Input {
  AnalogIn1 = "inputs/analog_in_1",
  AnalogIn2 = "inputs/analog_in_2",
  Aux1 = "inputs/aux1",
  Aux2 = "inputs/aux2",
  Aux3 = "inputs/aux3",
  Aux4 = "inputs/aux4",
  Aux5 = "inputs/aux5",
  Aux6 = "inputs/aux6",
  Aux7 = "inputs/aux7",
  Aux8k = "inputs/aux8k", // typo in doc?
  AuxIn1 = "inputs/aux_in_1",
  AuxIn2 = "inputs/aux_in_2",
  AuxIn3 = "inputs/aux_in_3",
  AuxIn4 = "inputs/aux_in_4",
  AuxSingle = "inputs/aux_single",
  BluRay = "inputs/bluray",
  CableSat = "inputs/cable_sat",
  CD = "inputs/cd",
  CoaxIn1 = "inputs/coax_in_1",
  CoaxIn2 = "inputs/coax_in_2",
  DVD = "inputs/dvd",
  Game = "inputs/game",
  Game2 = "inputs/game2",
  HDMIArc1 = "inputs/hdmi_arc_1",
  HDMIIn1 = "inputs/hdmi_in_1",
  HDMIIn2 = "inputs/hdmi_in_2",
  HDMIIn3 = "inputs/hdmi_in_3",
  HDMIIn4 = "inputs/hdmi_in_4",
  HDRadio = "inputs/hdradio",
  LineIn1 = "inputs/line_in_1",
  LineIn2 = "inputs/line_in_2",
  LineIn3 = "inputs/line_in_3",
  LineIn4 = "inputs/line_in_4",
  MediaPlayer = "inputs/mediaplayer",
  OpticalIn1 = "inputs/optical_in_1",
  OpticalIn2 = "inputs/optical_in_2",
  OpticalIn3 = "inputs/optical_in_3",
  Phono = "inputs/phono",
  RecorderIn1 = "inputs/recorder_in_1",
  Tuner = "inputs/tuner",
  TV = "inputs/tv",
  TVAudio = "inputs/tvaudio",
  USBDAC = "inputs/usbdac",
}

export const enum Error {
  UnrecognizedCommand = 1,
  InvalidID = 2,
  WrongNumberOfCommandArguments = 3,
  RequestedDataNotAvailable = 4,
  ResourceCurrentlyNotAvailable = 5,
  InvalidCredentials = 6,
  CommandCouldNotBeExecuted = 7,
  UserNotLoggedIn = 8,
  ParamterOutOfRange = 9,
  UserNotFound = 10,
  InternalError = 11,
  SystemError = 12,
  ProcessingPreviousCommand = 13,
  MediaCantBePlayed = 14,
  OptionNotSupported = 15,
  TooManyCommands = 16,
  ReachedSkipLimit = 17,
}

export const enum SystemError {
  RemoteError = 9,
  ServiceNotRegistered = 1061,
  UserNotLoggedIn = 1063,
  UserNotFound = 1056,
  GeneralAuthenticationError = 1201,
  UserAuthorizationError = 1232,
  UserParametersInvalid = 1239,
}

export const enum Event {
  SourcesChanged = "event/sources_changed",
  PlayersChanged = "event/players_changed",
  GroupsChanged = "event/groups_changed",
  PlayerStateChanged = "event/player_state_changed",
  PlayerNowPlayingChanged = "event/player_now_playing_changed",
  PlayerNowPlayingProgress = "event/player_now_playing_progress",
  PlayerPlaybackError = "event/player_playback_error",
  PlayerQueueChanged = "event/player_queue_changed",
  PlayerVolumeChanged = "event/player_volume_changed",
  RepeatModeChanged = "event/repeat_mode_changed",
  ShuffleModeChanged = "event/shuffle_mode_changed",
  GroupVolumeChanged = "event/group_volume_changed",
  UserChanged = "event/user_changed",
}
