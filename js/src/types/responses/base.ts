import type { Command } from "../commands/index.js";
import type { Error, Result, SystemError } from "../constants.js";
import type { PlayerId } from "../types.js";

export type PID = `pid=${PlayerId}`;

export type FailedResponse<CMD extends Command> = {
  heos: {
    command: CMD;
    result: typeof Result.Fail;
    message: `eid=${Error | SystemError}&text=${string}`;
  };
};

export type SuccessfulResponse<
  CMD extends Command,
  SuccessMessage extends string
> = {
  heos: {
    command: CMD;
    result: typeof Result.Success;
    message: SuccessMessage;
  };
};

export type WithPayload<
  Response extends SuccessfulResponse<Command, string>,
  Payload extends Object
> = Response & {
  payload: Payload;
};

export type WithOptions<
  Response extends SuccessfulResponse<Command, string>,
  Options extends Array<any>
> = Response & {
  options: Options;
};
