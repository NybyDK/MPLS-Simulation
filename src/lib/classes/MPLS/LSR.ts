import network from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import LFIB from "$lib/classes/MPLS/LFIB";

export default class LSR extends Router {
  LFIB = new LFIB();

  receivePacket(packet: Packet) {
    if (packet.fallbackRoute) return packet.fallback(this);
    const nextHop = this.LFIB.get(packet.label)?.nextHop;
    if (!nextHop) return packet.fallback(this);

    const newLabel = this.LFIB.get(packet.label)?.outgoingLabel;
    if (!newLabel) return packet.fallback(this);
    packet.label = newLabel;

    const nextRouter = network.getRouter(parseInt(nextHop));
    if (!nextRouter) return packet.fallback(this);

    packet.nextHop = nextRouter;

    packet.decrementTTL();
  }

  clearTables() {
    this.LFIB.map.clear();
  }

  get type(): "LSR" {
    return "LSR";
  }
}
