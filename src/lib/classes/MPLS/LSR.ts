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
    this.backupIPv4Routing(packet);
  }

  backupIPv4Routing(packet: Packet): void {
    //My current issue, is that I don't really know how to make all routers along  path know the next jump, based on the destination of a packet
    // Check routing table to find next hop for the destination
    // Then assign the next hop router to packet.nextHop and decrement TTL
    const destination = packet.destination.address;
    const nextHop = this.FIB.get(destination);

    if (nextHop) {
      const nextRouter = network.getRouter(parseInt(nextHop));
      if (nextRouter) {
        packet.nextHop = nextRouter;
        packet.decrementTTL();
        return;
      }
    }

    // If IPv4 routing fails or next hop is not found, drop the packet
    packet.drop();
  }

  get type(): "LSR" {
    return "LSR";
  }
}
