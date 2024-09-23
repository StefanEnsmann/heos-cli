/**
 * @license
 * Copyright (c) 2024 Stefan Ensmann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { CustomMusicSource, SourceId } from "./types.js";

/**
 * The current status of a HEOS connection
 * @enum
 */
export const ConnectionStatus = {
  Pending: "pending",
  Connecting: "connecting",
  Connected: "connected",
  Closed: "closed",
  Timeout: "timeout",
  Error: "error",
} as const;

/**
 * All music sources currently built-in to HEOS
 * @enum
 */
export const BuiltinMusicSource = {
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

/**
 * Checks if a given source ID belongs to a built-in music source
 * 
 * @param sid The source ID to check
 * 
 * @returns If the given source ID is a built-in music source
 */
export function isBuiltinMusicSource(sid: SourceId): sid is BuiltinMusicSource {
  return Object.values(BuiltinMusicSource).includes(sid as BuiltinMusicSource);
}

/**
 * Checks if a given source ID does not belong to a built-in music source
 * 
 * @param sid The source ID to check
 * 
 * @returns If the given source ID is not a built-in music source
 */
export function isCustomMusicSource(sid: SourceId): sid is CustomMusicSource {
  return !isBuiltinMusicSource(sid);
}

/**
 * Checks if the given source ID is Napster
 * 
 * @param sid The source ID to check
 * 
 * @returns If the given source ID is Napster
 */
export function isNapster(sid: SourceId): sid is typeof BuiltinMusicSource.Napster {
  return sid === BuiltinMusicSource.Napster;
}

/**
 * Checks if the given source ID is Pandora
 * 
 * @param sid The source ID to check
 * 
 * @returns If the given source ID is Pandora
 */
export function isPandora(sid: SourceId): sid is typeof BuiltinMusicSource.Pandora {
  return sid === BuiltinMusicSource.Pandora;
}
/**
 * Checks if the given source ID is iHeartRadio
 * 
 * @param sid The source ID to check
 * 
 * @returns If the given source ID is iHeartRadio
 */
export function isIHeartRadio(sid: SourceId): sid is typeof BuiltinMusicSource.iHeartRadio {
  return sid === BuiltinMusicSource.iHeartRadio;
}

/**
 * The type of a given music source
 * @enum
 */
export const MusicSourceType = {
  MusicService: "music_service",
  HEOSService: "heos_service",
  HEOSServer: "heos_server",
  DLNAServer: "dlna_server",
} as const;

/**
 * The type of a retrieved media entity
 * @enum
 */
export const MediaType = {
  Album: "album",
  Artist: "artist",
  Container: "container",
  Song: "song",
  Station: "station",
  Genre: "genre",
} as const;

/**
 * The result of a sent HEOS command
 * @enum
 */
export const Result = {
  Success: "success",
  Fail: "fail",
} as const;

/**
 * Sent as a response if the command needs some time for processing
 */
export const CommandUnderProcess = "command under process";

/**
 * Signals that currently no HEOS account is signed in
 */
export const SignedOut = "signed_out";

/**
 * Signals that a HEOS account is currently signed in
 */
export const SignedIn = "signed_in";

/**
 * Signals that a feature (e.g. shuffle) should be active
 */
export const On = "on";

/**
 * Signals that a feature (e.g. shuffle) should not be active
 */
export const Off = "off";

/**
 * Signals that an action (e.g. playback) is available on a given entity
 */
export const Yes = "yes";

/**
 * Signals that an action (e.g. playback) is not available on a given entity
 */
export const No = "no";

/**
 * How a HEOS device is connected to the local network
 * @enum
 */
export const Network = {
  Wired: "wired",
  WiFi: "wifi",
  Unknown: "unknown",
} as const;

/**
 * The volume mode of a HEOS device. "Fixed" indicates, that the volume is always at maximum and can not be changed through the app
 * @enum
 */
export const LineOut = {
  Variable: "variable",
  Fixed: "fixed",
} as const;

/**
 * TODO: Figure out what this actually means
 * @enum
 */
export const Control = {
  None: "none",
  IR: "ir",
  Trigger: "trigger",
  Network: "network",
} as const;

/**
 * The current play state of a player or group
 * @enum
 */
export const PlayState = {
  Play: "play",
  Pause: "pause",
  Stop: "stop",
} as const;

/**
 * The current play state of a player or group
 * @enum
 */
export const RepeatMode = {
  RepeatAll: "on_all",
  RepeatOne: "on_one",
  Off: "off",
} as const;

/**
 * The current role of a player in a group
 * @enum
 */
export const Role = {
  Leader: "leader",
  Member: "member",
} as const;

/**
 * How to add a media item to the current queue
 * @enum
 */
export const QueueType = {
  PlayNow: 1,
  PlayNext: 2,
  AddToEnd: 3,
  ReplaceAndPlay: 4,
} as const;

/**
 * Options that can be available for a retrieved media entity
 * @enum
 */
export const Option = {
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

/**
 * Checks if a given option is creating a new station
 * 
 * @param option The option to check
 * 
 * @returns If the given option is creating a new station
 */
export function isCreateNewStationOption(option: Option): option is typeof Option.CreateNewStation {
  return option === Option.CreateNewStation;
}

/**
 * Checks if a given option is supported by Napster
 * 
 * @param option The option to check
 * 
 * @returns If the given option is supported by Napster
 */
export function isNapsterOption(option: Option): option is 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 {
  return option <= Option.RemovePlaylistFromLibrary;
}

/**
 * Currently supported search criteria in HEOS
 * @enum
 */
export const SearchCriteria = {
  Artist: 1,
  Album: 2,
  Track: 3,
  Station: 4,
  Show: 5,
} as const;

/**
 * Signals if a firmware update is available for a given player
 * @enum
 */
export const FirmwareVersion = {
  NoUpdate: "update_none",
  UpdateAvailable: "update_exist",
} as const;

/**
 * Currently supported inputs for several HEOS devices
 * @enum
 */
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

/**
 * Errors that can be returned directly from the HEOS system
 * @enum
 */
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

/**
 * Errors that can be returned from external services
 * @enum
 */
export const SystemError = {
  RemoteError: 9,
  ServiceNotRegistered: 1061,
  UserNotLoggedIn: 1063,
  UserNotFound: 1056,
  GeneralAuthenticationError: 1201,
  UserAuthorizationError: 1232,
  UserParametersInvalid: 1239,
} as const;

/** @ignore */ export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];
/** @ignore */ export type BuiltinMusicSource = (typeof BuiltinMusicSource)[keyof typeof BuiltinMusicSource];
/** @ignore */ export type NonStation =
  | typeof BuiltinMusicSource.LocalMedia
  | typeof BuiltinMusicSource.HEOSPlaylists
  | typeof BuiltinMusicSource.HEOSHistory
  | typeof BuiltinMusicSource.HEOSAuxInputs
  | typeof BuiltinMusicSource.HEOSFavorites;
/** @ignore */ export type Station = Exclude<BuiltinMusicSource, NonStation>;
/** @ignore */ export type MusicSourceType = (typeof MusicSourceType)[keyof typeof MusicSourceType];
/** @ignore */ export type MediaType = (typeof MediaType)[keyof typeof MediaType];
/** @ignore */ export type Result = (typeof Result)[keyof typeof Result];
/** @ignore */ export type LoginState = typeof SignedIn | typeof SignedOut;
/** @ignore */ export type OnOff = typeof On | typeof Off;
/** @ignore */ export type YesNo = typeof Yes | typeof No;
/** @ignore */ export type Network = (typeof Network)[keyof typeof Network];
/** @ignore */ export type LineOut = (typeof LineOut)[keyof typeof LineOut];
/** @ignore */ export type Control = (typeof Control)[keyof typeof Control];
/** @ignore */ export type PlayState = (typeof PlayState)[keyof typeof PlayState];
/** @ignore */ export type RepeatMode = (typeof RepeatMode)[keyof typeof RepeatMode];
/** @ignore */ export type Role = (typeof Role)[keyof typeof Role];
/** @ignore */ export type QueueType = (typeof QueueType)[keyof typeof QueueType];
/** @ignore */ export type Option = (typeof Option)[keyof typeof Option];
/** @ignore */ export type SearchCriteria = (typeof SearchCriteria)[keyof typeof SearchCriteria];
/** @ignore */ export type FirmwareVersion = (typeof FirmwareVersion)[keyof typeof FirmwareVersion];
/** @ignore */ export type Input = (typeof Input)[keyof typeof Input];
/** @ignore */ export type HEOSError = (typeof HEOSError)[keyof typeof HEOSError];
/** @ignore */ export type SystemError = (typeof SystemError)[keyof typeof SystemError];
