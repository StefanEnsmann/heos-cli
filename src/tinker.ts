import { HEOS } from "./heos/heos";
import { RoutingInfo } from "./types/network";

HEOS.discoverDevices()
  .then(async (devices: RoutingInfo[]) => {
    console.log("Found device:", devices[0]);
    const connection = await HEOS.connectTo(devices[0]);
  })
  .catch((reason: any) => {
    console.log(reason);
  });
