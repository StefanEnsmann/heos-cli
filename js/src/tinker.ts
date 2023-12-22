import { HEOSConnection } from "./heos/connection";
import { HEOS } from "./heos/heos";
import { RoutingInfo } from "./types/network";

HEOS.discoverDevices()
  .then((devices: RoutingInfo[]) => {
    console.log("Found device:", devices[0]);
    return new HEOSConnection(devices[0]).connect();
  })
  .catch((reason: any) => {
    console.log(reason);
  });
