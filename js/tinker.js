import { Connection, discoverDevices } from "./dist/index.js";

const devices = await discoverDevices();
const connection = await new Connection(devices[0]).connect();
const players = await connection.getPlayers();
for (const player of players) {
  try {
    const update = await connection.checkForFirmwareUpdate(player.pid);
    console.log(player.name, update);
  } catch (error) {
    console.error(error.eid, error.text);
  }
}
connection.close();
