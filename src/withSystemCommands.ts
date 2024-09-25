import { SystemCommand } from "./util/commands.js";
import { Off, On } from "./util/constants.js";
import ConnectionWithSendFunction from "./withSendFunction.js";

/**
 * Builds upon {@link ConnectionWithSendFunction} and implements system level HEOS commands
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class ConnectionWithSystemCommands extends ConnectionWithSendFunction {
  /**
   * (De-)activates sending of unsolicited events by the HEOS system
   * 
   * @param receive If events should be sent by the HEOS system or not
   * 
   * @category System Commands
   */
  receiveEvents(receive: boolean = true): Promise<void> {
    return this.send(SystemCommand.RegisterForChangeEvents, { enable: receive ? On : Off }, this.eventSocket);
  }

  /**
   * Checks for a logged in HEOS account
   * 
   * @returns Username, if logged in, null otherwise
   * 
   * @category System Commands
   */
  checkAccount(): Promise<string | null> {
    return this.send(SystemCommand.CheckAccount);
  }

  /**
   * Signs in with the given username and password combination
   * 
   * @param username The username
   * @param password The password for the given username
   * 
   * @category System Commands
   */
  signIn(username: string, password: string): Promise<void> {
    return this.send(SystemCommand.SignIn, { un: username, pw: password });
  }

  /**
   * Signs out from the current HEOS account
   * 
   * @category System Commands
   */
  signOut(): Promise<void> {
    return this.send(SystemCommand.SignOut);
  }

  /**
   * Sends a heart beat to the HEOS system
   * 
   * @category System Commands
   */
  sendHeartBeat(): Promise<void> {
    return this.send(SystemCommand.HeartBeat);
  }

  /**
   * Reboots the HEOS device currently connected to
   * 
   * @category System Commands
   */
  rebootSpeaker(): Promise<void> {
    return this.send(SystemCommand.Reboot);
  }
}