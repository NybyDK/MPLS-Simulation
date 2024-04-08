import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import CE from "$lib/classes/MPLS/CE";
import LIB from "$lib/classes/MPLS/LIB";
import FIB from "$lib/classes/MPLS/FIB";

export default class LER extends Router {
  FIB = new FIB();
  LIB = new LIB();

  receivePacket(packet: Packet): void {
    const destination = packet.destination.address;

    if (packet.label === -1) {
      const nextHop = this.FIB.get(destination)?.nextHop;
      const newLabel = this.FIB.get(destination)?.label;

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
    this.backupIPv4Routing(packet);
    //Fallback routing should be called here, and implemented below, or somewhere else, and called in LSR as well, as all routers are created equal in IPv4
  }

  //In case the MPLS routing fails, we'll fallback to IPv4 routing, just like in LSR :)
  backupIPv4Routing(packet: Packet) {
    const nextHop = this.IPv4Routing.lookup(packet.destination);
    if (nextHop) {
      const nextRouter = network.getRouter(nextHop);
      if (nextRouter) {
        packet.nextHop = nextRouter;
        packet.decrementTTL();
        return;
      }
    }

    //Jeg tænker der burde være noget router.forEach(function (addresses){const nextRouter})

    // If IPv4 routing also fails, drop the packet
    packet.drop();
  }

  populateIPv4RoutingTable() {
    //Someting something foreach(function (addresses){const, nextRouter} where we give the address of he next router, to a destination, to each router on the patch, most likely using Dijkstras to find the path, shit that was a long comment, throw me in jail daddy)
  }

  get type(): "LER" {
    return "LER";
  }
}
