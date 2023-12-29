import type { System } from "../commands/system.js";
import type { OnOff } from "../constants.js";
import type { FailableResponse } from "./base.js";

export type RegisterForChangeEvents = FailableResponse<
  typeof System.RegisterForChangeEvents,
  `enable=${OnOff}`
>;
export type CheckAccount = FailableResponse<
  typeof System.CheckAccount,
  `signed_in&un=${string}` | "signed_out"
>;
export type SignIn = FailableResponse<
  typeof System.SignIn,
  `signed_in&un=${string}`
>;
export type SignOut = FailableResponse<typeof System.SignIn, "signed_out">;
export type HeartBeat = FailableResponse<typeof System.HeartBeat, "">;
export type Reboot = FailableResponse<typeof System.Reboot, "">;
export type PrettifyJsonResponse = FailableResponse<
  typeof System.PrettifyJsonResponse,
  `enable=${OnOff}`
>;
