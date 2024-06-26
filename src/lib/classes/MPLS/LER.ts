import network from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import FIB from "$lib/classes/MPLS/FIB";
import LFIB from "$lib/classes/MPLS/LFIB";

export default class LER extends Router {
  FIB = new FIB();
  LFIB = new LFIB();

  receivePacket(packet: Packet) {
    if (packet.fallbackRoute) return packet.fallback(this);

    if (packet.label === -1) {
      const destination = packet.destination;
      const nextHop = this.FIB.get(destination.address)?.nextHop;

      if (!nextHop) return packet.fallback(this);

      const newLabel = this.FIB.get(destination.address)?.label;
      if (!newLabel) return packet.fallback(this);

      packet.label = newLabel;

      const nextRouter = network.getRouter(parseInt(nextHop));
      if (!nextRouter) return packet.fallback(this);

      packet.nextHop = nextRouter;
    } else {
      const nextHop = this.LFIB.get(packet.label)?.nextHop;
      if (!nextHop) return packet.fallback(this);

      const newLabel = this.LFIB.get(packet.label)?.outgoingLabel;
      if (!newLabel) return packet.fallback(this);
      packet.label = newLabel;

      const nextRouter = network.getCERouter(nextHop);
      if (!nextRouter) return packet.fallback(this);

      packet.nextHop = nextRouter;
    }

    packet.decrementTTL();
  }

  clearTables() {
    this.FIB.map.clear();
    this.LFIB.map.clear();
  }

  get type(): "LER" {
    return "LER";
  }
}
