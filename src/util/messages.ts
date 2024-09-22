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

import { type LoginState, type OnOff, type PlayState, type RepeatMode, type HEOSError, SignedIn, SignedOut, SearchCriteria, Input, QueueType } from "./constants.js";
import { type Response } from "./responses.js";
import type { ContainerId, GroupId, MediaId, PlayerId, QueueId, QuickselectId, SourceId } from "./types.js";

/**
 * Any message that can be sent from the HEOS system
 */
export type Message = Partial<{
  aid: QueueType;
  cid: ContainerId;
  count: number;
  cur_pos: number;
  dqid: QueueId;
  duration: number;
  eid: HEOSError;
  enable: OnOff;
  error: string;
  fragment: LoginState;
  gid: GroupId;
  id: QuickselectId;
  input: Input;
  level: number;
  mid: MediaId;
  mute: OnOff;
  name: string;
  pid: PlayerId | Array<PlayerId>;
  preset: number;
  pw: string;
  qid: QueueId | Array<QueueId>;
  range: Array<number>;
  repeat: RepeatMode;
  returned: number;
  search: string;
  shuffle: OnOff;
  sid: SourceId;
  scid: SearchCriteria;
  spid: PlayerId;
  sqid: Array<QueueId>;
  state: OnOff | PlayState;
  step: number;
  text: string;
  un: string;
  url: string;
}>;

/**
 * An error message returned from HEOS
 */
export type ErrorMessage = Pick<Message, "eid" | "text">;

/**
 * All message options that can be passed in HEOS via a query string
 */
export type Query = Omit<Message, "fragment" | "eid" | "text">;

/**
 * The response when setting a group
 */
export type GroupMessage = Required<Pick<Message, "gid" | "name" | "pid">>;

/**
 * All properties that are numbers
 */
type NumberProperty = "aid" | "cid" | "count" | "dqid" | "gid" | "id" | "level" | "pid" | "preset" | "qid" | "returned" | "scid" | "sid" | "spid" | "step" | "eid";

/**
 * All supported message parameters
 */
type MessageKey = keyof Message;

/**
 * A single message parameter plus value. Login state is an exception as it has no value
 */
type MessageEntry = LoginState | `${MessageKey}=${string}`;

/**
 * All supported message value types
 */
type MessageValue = Message[MessageKey];

/**
 * Checks if a given message parameter contains number values
 * 
 * @param key The message parameter to check
 * 
 * @returns If the given message parameter contains number values
 */
function isNumberProperty(key: MessageKey): key is NumberProperty {
  return ["aid", "cid", "count", "dqid", "gid", "id", "level", "pid", "preset", "qid", "returned", "scid", "sid", "spid", "step", "eid"].includes(key);
}

/**
 * Retrieves a message value as a string, number or array of numbers
 * 
 * @param key The parameter to retrieve
 * @param value The string value transported via JSON
 * 
 * @returns The parsed message value as a string, number or array of numbers
 */
function getValueOrArray(key: MessageKey, value: string): MessageValue {
  if (isNumberProperty(key)) {
    if (value.includes(",")) {
      return value.split(",").map((v) => parseInt(v));
    } else {
      return parseInt(value);
    }
  }

  return value;
}

/**
 * Takes a HEOS response and transforms its message to an Object
 * 
 * @param response The full response sent from HEOS
 * 
 * @returns The parsed message Object
 */
export function parseMessage(response: Response): Message {
  const message = response.heos.message ?? "";

  return (message.split("&") as MessageEntry[])
    .reduce((message: Message, current: MessageEntry) => {
      if ([SignedIn, SignedOut].includes(current)) {
        return Object.assign(message, { fragment: current });
      }

      const [key, value] = current.split("=") as [MessageKey, MessageEntry];
      return Object.assign(message, { [key]: getValueOrArray(key, value) });
    }, {});
}