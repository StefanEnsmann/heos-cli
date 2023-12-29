import type { System } from "../commands/system.js";
import type { OnOff } from "../constants.js";
import type { SuccessfulResponse } from "./base.js";

export type RegisterForChangeEvents = SuccessfulResponse<
  typeof System.RegisterForChangeEvents,
  `enable=${OnOff}`
>;

export type CheckAccount = SuccessfulResponse<
  typeof System.CheckAccount,
  `signed_in&un=${string}` | "signed_out"
>;

export type SignIn = SuccessfulResponse<
  typeof System.SignIn,
  `signed_in&un=${string}`
>;
export type SignOut = SuccessfulResponse<typeof System.SignIn, "signed_out">;

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
