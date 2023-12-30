import type { System } from "../commands/system.js";
import type { OnOff, SignedIn, SignedOut } from "../constants.js";
import type { SuccessfulResponse } from "./base.js";

export type RegisterForChangeEvents = SuccessfulResponse<
  typeof System.RegisterForChangeEvents,
  `enable=${OnOff}`
>;

export type CheckAccount = SuccessfulResponse<
  typeof System.CheckAccount,
  `${typeof SignedIn}&un=${string}` | typeof SignedOut
>;

export type SignIn = SuccessfulResponse<
  typeof System.SignIn,
  `${typeof SignedIn}&un=${string}`
>;

export type SignOut = SuccessfulResponse<
  typeof System.SignOut,
  typeof SignedOut
>;

export type HeartBeat = SuccessfulResponse<typeof System.HeartBeat, "">;

export type Reboot = SuccessfulResponse<typeof System.Reboot, "">;

export type PrettifyJsonResponse = SuccessfulResponse<
  typeof System.PrettifyJsonResponse,
  `enable=${OnOff}`
>;

export type SystemResponse =
  | RegisterForChangeEvents
  | CheckAccount
  | SignIn
  | SignOut
  | HeartBeat
  | Reboot
  | PrettifyJsonResponse;
