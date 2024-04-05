import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import LIB from "$lib/classes/MPLS/LIB";

export default class LSR extends Router {
  LIB = new LIB();

  // TODO: Instead of early return, do fallback to normal routing lookup, and if that fails too, packet.drop();
  receivePacket(packet: Packet): void {
    const nextHop = this.LIB.get(packet.label)?.nextHop;
    if (!nextHop) return;

    const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
    if (!newLabel) return;
    packet.label = newLabel;

    const nextRouter = network.getRouter(parseInt(nextHop));
    if (!nextRouter) return;
    packet.nextHop = nextRouter;

    packet.decrementTTL();
  }

  get type(): "LSR" {
    return "LSR";
  }
}
