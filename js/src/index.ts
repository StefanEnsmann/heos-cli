import { createSocket } from "dgram";
import type { PromiseReject, RoutingInfo } from "./util/types.js";
import ConnectionWithBrowseCommands from "./withBrowseCommands.js";

const heosSchemaName = 'urn:schemas-denon-com:device:ACT-Denon:1';
const ssdpIp = '239.255.255.250';
const ssdpPort = 1900;
const ssdpDiscoveryMessage = [
  'M-SEARCH * HTTP/1.1',
  `HOST: ${ssdpIp}:${ssdpPort}`,
  `ST: ${heosSchemaName}`,
  'MX: 5',
  'MAN: "ssdp:discover"',
  '\r\n'
].join('\r\n');

/**
 * Discover HEOS compatible devices in the local network.
 * Stops after {@link timeout} milliseconds or when {@link maxDevices} have been found.
 *
 * @param timeout
 * Duration in milliseconds until this function timeouts.
 * 
 * @param maxDevices
 * Maximum number of devices to discover.
 * 
 * @param onDiscover
 * Called every time a new device is discovered.
 * 
 * @param onTimeout
 * Called when the function times out and is not terminated early by discovering maxDevices.
 * 
 * @returns A promise for the discovery process.
 */
export function discoverDevices(
  timeout: number = 5000,
  maxDevices: number = Number.MAX_VALUE,
  onDiscover?: (device: RoutingInfo) => void,
  onTimeout?: (devices: RoutingInfo[]) => void
): Promise<RoutingInfo[]> {
  return new Promise<RoutingInfo[]>((resolve, reject) => {
    const devices: RoutingInfo[] = [];
    const timeoutReference = setTimeout(stopDiscovery, timeout);
    const socket = createSocket('udp4');

    function stopDiscovery(early: boolean = false) {
      socket.close();
      global.clearTimeout(timeoutReference);
      if (!early && onTimeout) {
        onTimeout(devices);
      }
      devices.length > 0 ? resolve(devices) : reject('No devices found!');
    }

    socket
      .bind()
      .on('listening', () => {
        socket.send(ssdpDiscoveryMessage, ssdpPort, ssdpIp);
      })
      .on('message', (msg: string, routingInfo: RoutingInfo) => {
        if (!msg.includes(heosSchemaName)) {
          return;
        }

        devices.push(routingInfo);
        if (onDiscover) {
          onDiscover(routingInfo);
        }
        if (maxDevices && devices.length >= maxDevices) {
          stopDiscovery(true);
        }
      });
  });
}

export class Connection extends ConnectionWithBrowseCommands {
  static discoverAndConnect(): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      discoverDevices()
        .then((devices) => Connection.toDevice(devices[0]))
        .then((connection) => {
          resolve(connection);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  static toDevice(device: RoutingInfo): Promise<Connection> {
    return new Promise<Connection>((resolve, reject) => {
      const connection = new Connection(device);
      connection.initSockets(resolve, reject as PromiseReject<Error>);
    });
  }
}
