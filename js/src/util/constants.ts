export const ConnectionStatus = {
  Pending: "pending",
  Connecting: "connecting",
  Connected: "connected",
  Closed: "closed",
  Timeout: "timeout",
  Error: "error",
};

export const MusicSource = {
  Pandora: 1,
  Rhapsody: 2,
  TuneIn: 3,
  Spotify: 4,
  Deezer: 5,
  Napster: 6,
  iHeartRadio: 7,
  SiriusXM: 8,
  Soundcloud: 9,
  Tidal: 10,
  // FutureService:  11,
  Rdio: 12,
  AmazonMusic: 13,
  // FutureService:  14,
  Moodmix: 15,
  Juke: 16,
  // FutureService:  17,
  QMusic: 18,
  LocalMedia: 1024,
  HEOSPlaylists: 1025,
  HEOSHistory: 1026,
  HEOSAuxInputs: 1027,
  HEOSFavorites: 1028,
} as const;

export const MusicSourceType = {
  MusicService: "music_service",
  HEOSService: "heos_service",
  HEOSServer: "heos_server",
  DLNAServer: "dlna_server",
} as const;

export const MediaType = {
  Album: "album",
  Artist: "artist",
  Container: "container",
  Song: "song",
  Station: "station",
  Genre: "genre",
} as const;

export const Result = {
  Success: "success",
  Fail: "fail",
} as const;

export const CommandUnderProcess = "command under process";

export const SignedOut = "signed_out";
export const SignedIn = "signed_in";

export const On = "on";
export const Off = "off";
export const Yes = "yes";
export const No = "no";

export const Network = {
  Wired: "wired",
  WiFi: "wifi",
  Unknown: "unknown",
} as const;

export const LineOut = {
  Variable: "variable",
  Fixed: "fixed",
} as const;

export const Control = {
  None: "none",
  IR: "ir",
  Trigger: "trigger",
  Network: "network",
} as const;

export const PlayState = {
  Play: "play",
  Pause: "pause",
  Stop: "stop",
} as const;

export const RepeatMode = {
  RepeatAll: "on_all",
  RepeatOne: "on_one",
  Off: "off",
} as const;

export const Role = {
  Leader: "leader",
  Member: "member",
} as const;

export const QueueType = {
  PlayNow: 1,
  PlayNext: 2,
  AddToEnd: 3,
  ReplaceAndPlay: 4,
} as const;

export const Options = {
  AddTrackToLibrary: 1,
  AddAlbumToLibrary: 2,
  AddStationToLibrary: 3,
  AddPlaylistToLibrary: 4,
  RemoveTrackFromLibrary: 5,
  RemoveAlbumFromLibrary: 6,
  RemoveStationFromLibrary: 7,
  RemovePlaylistFromLibrary: 8,
  ThumbsUp: 11,
  ThumbsDown: 12,
  CreateNewStation: 13,
  AddToHEOSFavorites: 19,
  RemoveFromHEOSFavorites: 20,
  PlayableContainer: 21,
} as const;

export const SearchCriteria = {
  Artist: 1,
  Track: 3,
  Show: 5,
} as const;

export const FirmwareVersion = {
  NoUpdate: "update_none",
  UpdateAvailable: "update_exist",
} as const;

export const Input = {
  AnalogIn1: "inputs/analog_in_1",
  AnalogIn2: "inputs/analog_in_2",
  Aux1: "inputs/aux1",
  Aux2: "inputs/aux2",
  Aux3: "inputs/aux3",
  Aux4: "inputs/aux4",
  Aux5: "inputs/aux5",
  Aux6: "inputs/aux6",
  Aux7: "inputs/aux7",
  Aux8k: "inputs/aux8k", // typo in doc?
  AuxIn1: "inputs/aux_in_1",
  AuxIn2: "inputs/aux_in_2",
  AuxIn3: "inputs/aux_in_3",
  AuxIn4: "inputs/aux_in_4",
  AuxSingle: "inputs/aux_single",
  BluRay: "inputs/bluray",
  CableSat: "inputs/cable_sat",
  CD: "inputs/cd",
  CoaxIn1: "inputs/coax_in_1",
  CoaxIn2: "inputs/coax_in_2",
  DVD: "inputs/dvd",
  Game: "inputs/game",
  Game2: "inputs/game2",
  HDMIArc1: "inputs/hdmi_arc_1",
  HDMIIn1: "inputs/hdmi_in_1",
  HDMIIn2: "inputs/hdmi_in_2",
  HDMIIn3: "inputs/hdmi_in_3",
  HDMIIn4: "inputs/hdmi_in_4",
  HDRadio: "inputs/hdradio",
  LineIn1: "inputs/line_in_1",
  LineIn2: "inputs/line_in_2",
  LineIn3: "inputs/line_in_3",
  LineIn4: "inputs/line_in_4",
  MediaPlayer: "inputs/mediaplayer",
  OpticalIn1: "inputs/optical_in_1",
  OpticalIn2: "inputs/optical_in_2",
  OpticalIn3: "inputs/optical_in_3",
  Phono: "inputs/phono",
  RecorderIn1: "inputs/recorder_in_1",
  Tuner: "inputs/tuner",
  TV: "inputs/tv",
  TVAudio: "inputs/tvaudio",
  USBDAC: "inputs/usbdac",
} as const;

export const HEOSError = {
  UnrecognizedCommand: 1,
  InvalidID: 2,
  WrongNumberOfCommandArguments: 3,
  RequestedDataNotAvailable: 4,
  ResourceCurrentlyNotAvailable: 5,
  InvalidCredentials: 6,
  CommandCouldNotBeExecuted: 7,
  UserNotLoggedIn: 8,
  ParamterOutOfRange: 9,
  UserNotFound: 10,
  InternalError: 11,
  SystemError: 12,
  ProcessingPreviousCommand: 13,
  MediaCantBePlayed: 14,
  OptionNotSupported: 15,
  TooManyCommands: 16,
  ReachedSkipLimit: 17,
} as const;

export const SystemError = {
  RemoteError: 9,
  ServiceNotRegistered: 1061,
  UserNotLoggedIn: 1063,
  UserNotFound: 1056,
  GeneralAuthenticationError: 1201,
  UserAuthorizationError: 1232,
  UserParametersInvalid: 1239,
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];
export type MusicSource = (typeof MusicSource)[keyof typeof MusicSource];
export type NonStation =
  | typeof MusicSource.LocalMedia
  | typeof MusicSource.HEOSPlaylists
  | typeof MusicSource.HEOSHistory
  | typeof MusicSource.HEOSAuxInputs
  | typeof MusicSource.HEOSFavorites;
export type Station = Exclude<MusicSource, NonStation>;
export type MusicSourceType = (typeof MusicSourceType)[keyof typeof MusicSourceType];
export type MediaType = (typeof MediaType)[keyof typeof MediaType];
export type Result = (typeof Result)[keyof typeof Result];
export type LoginState = typeof SignedIn | typeof SignedOut;
export type OnOff = typeof On | typeof Off;
export type YesNo = typeof Yes | typeof No;
export type Network = (typeof Network)[keyof typeof Network];
export type LineOut = (typeof LineOut)[keyof typeof LineOut];
export type Control = (typeof Control)[keyof typeof Control];
export type PlayState = (typeof PlayState)[keyof typeof PlayState];
export type RepeatMode = (typeof RepeatMode)[keyof typeof RepeatMode];
export type Role = (typeof Role)[keyof typeof Role];
export type QueueType = (typeof QueueType)[keyof typeof QueueType];
export type Options = (typeof Options)[keyof typeof Options];
export type SearchCriteria = (typeof SearchCriteria)[keyof typeof SearchCriteria];
export type FirmwareVersion = (typeof FirmwareVersion)[keyof typeof FirmwareVersion];
export type Input = (typeof Input)[keyof typeof Input];
export type HEOSError = (typeof HEOSError)[keyof typeof HEOSError];
export type SystemError = (typeof SystemError)[keyof typeof SystemError];
