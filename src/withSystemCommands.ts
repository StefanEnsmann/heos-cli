import { SystemCommand } from "./util/commands.js";
import { Off, On } from "./util/constants.js";
import ConnectionWithSendFunction from "./withSendFunction.js";

export default class ConnectionWithSystemCommands extends ConnectionWithSendFunction {
  receiveEvents(receive: boolean = true): Promise<void> {
    return this.send(SystemCommand.RegisterForChangeEvents, { enable: receive ? On : Off }, this.eventSocket);
  }

  checkAccount(): Promise<string | null> {
    return this.send(SystemCommand.CheckAccount);
  }

  signIn(username: string, password: string): Promise<void> {
    return this.send(SystemCommand.SignIn, { un: username, pw: password });
  }

  signOut(): Promise<void> {
    return this.send(SystemCommand.SignOut);
  }

  sendHeartBeat(): Promise<void> {
    return this.send(SystemCommand.HeartBeat);
  }

  rebootSpeaker(): Promise<void> {
    return this.send(SystemCommand.Reboot);
  }
}