import { Connection, discoverDevices } from "./dist/index.js";

const connection = await Connection.discoverAndConnect()
const sources = await connection.getMusicSources();
connection.close();

