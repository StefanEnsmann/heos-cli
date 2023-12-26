import { Result, Enable } from "./constants"
import { PlayerInformation } from "./payloads"

namespace Command {
  export const enum System {
    RegisterForChangeEvents = 'system/register_for_change_events',
    CheckAccount = 'system/check_account',
    SignIn = 'system/sign_in',
    SignOut = 'system/sign_out',
    HeartBeat = 'system/heart_beat',
    Reboot = 'system/reboot',
    PrettifyJsonResponse = 'system/prettify_json_response',
  }
  export const enum Player {
    GetPlayers = 'player/get_players',
  }
}

namespace Response {
  type FailableResponse<Command extends Command.System | Command.Player, SuccessMessage> = {
    heos: {
      command: Command
      result: Result.Success
      message: SuccessMessage
    }
  } | {
    heos: {
      command: Command
      result: Result.Fail,
      message: string
    }
  }

  type FailableResponseWithPayload<Command extends Command.System | Command.Player, SuccessMessage, Payload> = {
    heos: {
      command: Command
      result: Result.Success
      message: SuccessMessage
      payload: Payload
    }
  } | {
    heos: {
      command: Command
      result: Result.Fail,
      message: string
    }
  }

  namespace System {
    export type RegisterForChangeEvents = FailableResponse<Command.System.RegisterForChangeEvents, `enable=${Enable}`>
    export type CheckAccount = FailableResponse<Command.System.CheckAccount, string>
    export type SignIn = FailableResponse<Command.System.SignIn, string>
    export type SignOut = FailableResponse<Command.System.SignIn, 'signed_out'>
    export type HeartBeat = FailableResponse<Command.System.HeartBeat, ''>
    export type Reboot = FailableResponse<Command.System.Reboot, ''>
    export type PrettifyJsonResponse = FailableResponse<Command.System.PrettifyJsonResponse, `enable=${Enable}`>
  }

  namespace Player {
    export type GetPlayers = FailableResponseWithPayload<Command.Player.GetPlayers, '', Array<PlayerInformation>>
  }
}
