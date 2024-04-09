import network from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import LIB from "$lib/classes/MPLS/LIB";

export default class LSR extends Router {
  LIB = new LIB();

  receivePacket(packet: Packet) {
    if (packet.fallbackRoute) return packet.fallback(this);
    const nextHop = this.LIB.get(packet.label)?.nextHop;
    if (!nextHop) return packet.fallback(this);

    const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
    if (!newLabel) return packet.fallback(this);
    packet.label = newLabel;

    const nextRouter = network.getRouter(parseInt(nextHop));
    if (!nextRouter) return packet.fallback(this);

    packet.nextHop = nextRouter;

    packet.decrementTTL();
  }

  clearTables() {
    this.LIB.map.clear();
  }

  get type(): "LSR" {
    return "LSR";
  }
}
