import { network } from "$lib/stores/network";
import type CE from "$lib/classes/MPLS/CE";
import type Router from "$lib/classes/MPLS/Router";

export default class Packet {
  private ttl: number = 32;
  public label: number = -1;
  public nextHop: Router | undefined;

  constructor(
    public readonly id: number,
    public readonly source: CE,
    public readonly destination: CE,
    public node: { x: number; y: number },
  ) {
    const nextHopRouterID = source.firstHop.get(destination.address);
    if (!nextHopRouterID) return; // an error occurred

    const nextHopRouter = network.getRouter(nextHopRouterID);
    if (!nextHopRouter) return; // an error occurred

    this.nextHop = nextHopRouter;
  }

  decrementTTL() {
    if (--this.ttl <= 0) this.drop();
  }

  drop() {
    network.deletePacket(this.id);
  }
}
