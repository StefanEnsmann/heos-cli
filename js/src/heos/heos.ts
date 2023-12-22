import { createSocket } from "dgram";
import { RoutingInfo, DiscoveryOptions } from "../types/network";
import { HEOSConnection } from "./connection";

const schemaName = "urn:schemas-denon-com:device:ACT-Denon:1";
const discoverMessage = [
  "M-SEARCH * HTTP/1.1",
  "HOST: 239.255.255.250:1900",
  `ST: ${schemaName}`,
  "MX: 5",
  'MAN: "ssdp:discover"',
  "\r\n",
].join("\r\n");

export class HEOS {
  static discoverDevices({
    timeout = 5000,
    maxDevices = 1,
    onDiscover,
    onTimeout,
  }: DiscoveryOptions = {}): Promise<RoutingInfo[]> {
    return new Promise<RoutingInfo[]>((resolve, reject) => {
      const devices: RoutingInfo[] = [];
      const timeoutReference = setTimeout(stopDiscovery, timeout);
      const socket = createSocket("udp4");

      function stopDiscovery(early: boolean = false) {
        socket.close();
        global.clearTimeout(timeoutReference);
        if (!early && onTimeout) {
          onTimeout(devices);
        }
        devices.length > 0 ? resolve(devices) : reject("No devices found!");
      }

      function handleResponse(msg: string, routingInfo: RoutingInfo) {
        if (!msg.includes(schemaName)) {
          return;
        }

        devices.push(routingInfo);
        if (onDiscover) {
          onDiscover(routingInfo);
        }
        if (maxDevices && devices.length >= maxDevices) {
          stopDiscovery(true);
        }
      }

      socket
        .bind()
        .on("listening", () => {
          socket.send(discoverMessage, 1900, "239.255.255.250");
        })
        .on("message", handleResponse);
    });
  }
}
