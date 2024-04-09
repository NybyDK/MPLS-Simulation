import network from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import CE from "$lib/classes/MPLS/CE";
import LIB from "$lib/classes/MPLS/LIB";
import FIB from "$lib/classes/MPLS/FIB";

export default class LER extends Router {
  FIB = new FIB();
  LIB = new LIB();

  receivePacket(packet: Packet) {
    if (packet.label === -1 && packet.fallbackRoute) return packet.fallback(this);
    const destination = packet.destination;

    if (packet.label === -1) {
      const nextHop = this.FIB.get(destination.address)?.nextHop;
      if (!nextHop) return packet.fallback(this);

      const newLabel = this.FIB.get(destination.address)?.label;
      if (!newLabel) return packet.fallback(this);

      packet.label = newLabel;

      const nextRouter = network.getRouter(parseInt(nextHop));
      if (!nextRouter) return packet.fallback(this);

      packet.nextHop = nextRouter;
    } else {
      const nextHop = this.LIB.get(packet.label)?.nextHop;
      if (!nextHop) return packet.fallback(this);

      const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
      if (!newLabel) return packet.fallback(this);
      packet.label = newLabel;

      // LDP needs to communicate firstHop to source CE, so it can start by sending to the correct LER
      const nextRouter = network.routers.find(
        (router) => router instanceof CE && router.address === nextHop,
      );
      if (!nextRouter) return packet.fallback(this);

      packet.nextHop = nextRouter;
    }

    packet.decrementTTL();
  }

  clearTables() {
    this.FIB.map.clear();
    this.LIB.map.clear();
  }

  get type(): "LER" {
    return "LER";
  }
}
