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

import { SystemCommand } from "./util/commands.js";
import { Off, On } from "./util/constants.js";
import ConnectionWithSendFunction from "./withSendFunction.js";

/**
 * Builds upon {@link ConnectionWithSendFunction} and implements system level HEOS commands
 */
export default class ConnectionWithSystemCommands extends ConnectionWithSendFunction {
  /**
   * (De-)activates sending of unsolicited events by the HEOS system
   * 
   * @param receive If events should be sent by the HEOS system or not
   */
  receiveEvents(receive: boolean = true): Promise<void> {
    return this.send(SystemCommand.RegisterForChangeEvents, { enable: receive ? On : Off }, this.eventSocket);
  }

  /**
   * Checks for a logged in HEOS account
   * 
   * @returns Username, if logged in, null otherwise
   */
  checkAccount(): Promise<string | null> {
    return this.send(SystemCommand.CheckAccount);
  }

  /**
   * Signs in with the given username and password combination
   * 
   * @param username The username
   * @param password The password for the given username
   */
  signIn(username: string, password: string): Promise<void> {
    return this.send(SystemCommand.SignIn, { un: username, pw: password });
  }

  /**
   * Signs out from the current HEOS account
   */
  signOut(): Promise<void> {
    return this.send(SystemCommand.SignOut);
  }

  /**
   * Sends a heart beat to the HEOS system
   */
  sendHeartBeat(): Promise<void> {
    return this.send(SystemCommand.HeartBeat);
  }

  /**
   * Reboots the HEOS device currently connected to
   */
  rebootSpeaker(): Promise<void> {
    return this.send(SystemCommand.Reboot);
  }
}