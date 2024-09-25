import { createSocket } from "dgram";
import type { RoutingInfo } from "./util/types.js";
import ConnectionWithBrowseCommands from "./withBrowseCommands.js";

/**
 * The SSDP schema used by HEOS devices
 */
const heosSchemaName = 'urn:schemas-denon-com:device:ACT-Denon:1';

/**
 * The SSDP discovery address
 */
const ssdpIp = '239.255.255.250';

/**
 * The SSDP discovery port
 */
const ssdpPort = 1900;

/**
 * The TCP message for SSDP discovery
 */
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
 * The callback to execute every time a new device is discovered.
 * 
 * @param onTimeout
 * The callback to execute when the process times out and is not terminated early by discovering {@link maxDevices}.
 * 
 * @returns A promise for the discovery process. Resolves, if at least one device is found, rejects otherwise.
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export function discoverDevices(
  maxDevices: number = Number.MAX_VALUE,
  timeout: number = 5000,
  onDiscover?: (device: RoutingInfo) => void,
  onTimeout?: (devices: RoutingInfo[]) => void
): Promise<RoutingInfo[]> {
  return new Promise<RoutingInfo[]>((resolve, reject) => {
    const devices: RoutingInfo[] = [];
    const timeoutReference = setTimeout(stopDiscovery, timeout);
    const socket = createSocket('udp4');

    function stopDiscovery(early: boolean = false) {
      socket.close();
      clearTimeout(timeoutReference);
      if (!early && onTimeout) {
        onTimeout(devices);
      }
      if (devices.length > 0) {
        resolve(devices);
      } else {
        reject('No devices found!');
      }
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

/**
 * Contains all information and functions for handling a connection to a HEOS device.
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export class Connection extends ConnectionWithBrowseCommands {
  /**
   * This constructor is not meant to be called externally
   * 
   * @param device The HEOS device to connect to
   */
  private constructor(device: RoutingInfo) {
    super(device);
  }

  /**
   * Tries to discover HEOS devices and connects to the first device found
   * 
   * @returns A promise for the connection process
   * 
   * @category Connection Management
   */
  static async discoverAndConnect(): Promise<Connection> {
    const devices = await discoverDevices(1);
    return await Connection.toDevice(devices[0]);
  }

  /**
   * Establishes a connection to the given HEOS device
   * 
   * @param device The device to connect to
   * 
   * @returns A promise for the connection process
   * 
   * @category Connection Management
   */
  static async toDevice(device: RoutingInfo): Promise<Connection> {
    const connection = new Connection(device);
    await connection.initSockets(connection.handleCommandData, connection.handleEventData);
    return connection;
  }
}
