import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import CE from "$lib/classes/MPLS/CE";
import LIB from "$lib/classes/MPLS/LIB";
import FIB from "$lib/classes/MPLS/FIB";

export default class LER extends Router {
  FIB = new FIB();
  LIB = new LIB();

  // TODO: Instead of early return, do fallback to normal routing lookup, and if that fails too, packet.drop();
  receivePacket(packet: Packet): void {
    const destination = packet.destination;

    if (packet.label === -1) {
      const nextHop = this.FIB.get(destination.address)?.nextHop;
      const newLabel = this.FIB.get(destination.address)?.label;

      if (nextHop && newLabel) {
        packet.label = newLabel;
        const nextRouter = network.getRouter(parseInt(nextHop));
        if (nextRouter) {
          packet.nextHop = nextRouter;
          packet.decrementTTL();
          return;
        }
      }
    } else {
      const nextHop = this.LIB.get(packet.label)?.nextHop;
      const newLabel = this.LIB.get(packet.label)?.outgoingLabel;

      if (nextHop && newLabel) {
        packet.label = newLabel;
        const nextRouter = network.routers.find(
          (router) => router instanceof CE && router.address === nextHop,
        );
        if (nextRouter) {
          packet.nextHop = nextRouter;
          packet.decrementTTL();
          return;
        }
      }
    }
  }

  get type(): "LER" {
    return "LER";
  }
}
