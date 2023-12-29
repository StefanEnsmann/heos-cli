import { Connection, discoverDevices } from "./dist/index.js";

discoverDevices()
  .then((devices) => {
    console.log("Found device:", devices[0]);
    return new Connection(devices[0]).connect();
  })
  .catch((reason) => {
    console.log(reason);
  });
