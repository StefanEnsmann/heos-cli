export const System = {
  RegisterForChangeEvents: "system/register_for_change_events",
  CheckAccount: "system/check_account",
  SignIn: "system/sign_in",
  SignOut: "system/sign_out",
  HeartBeat: "system/heart_beat",
  Reboot: "system/reboot",
  PrettifyJsonResponse: "system/prettify_json_response",
} as const;

export type System = (typeof System)[keyof typeof System];
