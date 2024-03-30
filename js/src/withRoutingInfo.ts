import type { RoutingInfo } from "./util/types.js";

export default class BaseConnection {
  protected device: RoutingInfo;

  constructor(device: RoutingInfo) {
    this.device = device;
  }
}