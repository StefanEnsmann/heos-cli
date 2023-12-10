export type RoutingInfo = {
  address: string;
  family: string;
  port: number;
  size: number;
};

export type DiscoveryOptions = {
  timeout?: number;
  maxDevices?: number;
  onDiscover?: (device: RoutingInfo) => void;
  onTimeout?: (devices: RoutingInfo[]) => void;
};
