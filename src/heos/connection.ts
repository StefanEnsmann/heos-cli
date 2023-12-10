import { RoutingInfo } from "../types/network";

export class HEOSConnection {
  static async toDevice(device: RoutingInfo): Promise<HEOSConnection> {
    return new Promise<HEOSConnection>((resolve, reject) => {});
  }
}
