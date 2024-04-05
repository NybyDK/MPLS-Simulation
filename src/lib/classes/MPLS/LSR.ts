import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import LIB from "$lib/classes/MPLS/LIB";

export default class LSR extends Router {
  LIB = new LIB();

  receivePacket(packet: Packet): void {
    const nextHop = this.LIB.get(packet.label)?.nextHop;
    const newLabel = this.LIB.get(packet.label)?.outgoingLabel;

    if (nextHop && newLabel) {
      packet.label = newLabel;
      const nextRouter = network.getRouter(parseInt(nextHop));
      if (nextRouter) {
        packet.nextHop = nextRouter;
        packet.decrementTTL();
        return;
      }
    }
    //this.backupIPv4Routing(packet);
    // If MPLS routing fails, we'll fallback to IPv4 routing, just like in LER :)
    // afaik, all routers must then have addresses, only CE routers currently have so
    // Then the routing table must keep track of routes, and which routers said route include
    // Said routers must then know which router is the next on in the order to forward to it.
    //backupIPv4Routing(packet);
  }

  get type(): "LSR" {
    return "LSR";
  }
}
