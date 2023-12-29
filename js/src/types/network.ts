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

export const ConnectionStatus = {
  Pending: "pending",
  Connecting: "connecting",
  Connected: "connected",
  Closed: "closed",
  Timeout: "timeout",
  Error: "error",
} as const;

export type ConnectionStatus =
  (typeof ConnectionStatus)[keyof typeof ConnectionStatus];
