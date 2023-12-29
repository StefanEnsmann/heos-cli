import { Commands, Connection, discoverDevices } from "./dist/index.js";
import { PlayState } from "./dist/types/constants.js";

const devices = await discoverDevices();
console.log("Found device:", devices[0]);

const connection = await new Connection(devices[0]).connect();
const nowPlayingMedia = await connection.getNowPlayingMedia(-301473007);
console.log(nowPlayingMedia.payload.song);
connection.send(Commands.Player.SetPlayState, { pid: -301473007, state: PlayState.Stop });
connection.close();
