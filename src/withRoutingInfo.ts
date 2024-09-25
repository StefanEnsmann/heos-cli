import type { RoutingInfo } from "./util/types.js";

/**
 * Contains only routing information and no other functionality
 * 
 * @author Stefan Ensmann <stefan@ensmann.de>
 */
export default class BaseConnection {
  /**
   * Contains IP address information of the HEOS device this instance is connected to
   */
  protected device: RoutingInfo;

  constructor(device: RoutingInfo) {
    this.device = device;
  }
}