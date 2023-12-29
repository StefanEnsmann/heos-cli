import type { Command } from "../commands/index.js";
import type { Error, Result, SystemError } from "../constants.js";
import type { PlayerId } from "../types.js";

export type PID = `pid=${PlayerId}`;

export type FailedResponse<CMD extends Command> = {
  heos: {
    command: CMD;
    result: typeof Result.Fail;
    message: Error | SystemError;
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

export type FailableResponse<
  CMD extends Command,
  SuccessMessage extends string
> = SuccessfulResponse<CMD, SuccessMessage> | FailedResponse<Command>;

export type FailableResponseWithPayload<
  CMD extends Command,
  SuccessMessage extends string,
  Payload extends Object | Array<any>
> =
  | (SuccessfulResponse<CMD, SuccessMessage> & { payload: Payload })
  | FailedResponse<CMD>;

export type FailableResponseWithPayloadAndOptions<
  CMD extends Command,
  SuccessMessage extends string,
  Payload extends Object | Array<any>,
  Options extends Array<any>
> =
  | (SuccessfulResponse<CMD, SuccessMessage> & {
      payload: Payload;
      options: Options;
    })
  | FailedResponse<CMD>;
