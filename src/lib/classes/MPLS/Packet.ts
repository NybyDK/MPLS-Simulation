import network from "$lib/stores/network";
import CE from "$lib/classes/MPLS/CE";
import type Router from "$lib/classes/MPLS/Router";
import paths from "$lib/stores/paths";

export default class Packet {
  private ttl: number = 32;
  public label: number = -1;
  public fallbackRoute: Router[] | undefined = undefined;
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

  fallback(currentRouter: Router) {
    this.label = -1;
    this.decrementTTL();
    if (this.fallbackRoute) return this.setFallbackNextHop();

    this.fallbackRoute = paths.findShortestPath(currentRouter, this.destination);
    const destinationRouter = this.fallbackRoute[this.fallbackRoute.length - 1];

    if (!(destinationRouter instanceof CE)) return this.drop("The destination is not a CE.");
    this.fallbackRoute.shift();

    this.setFallbackNextHop();
  }

  setFallbackNextHop() {
    const nextHop = this.fallbackRoute?.shift();

    if (this.fallbackRoute) this.nextHop = nextHop;
    else this.drop("unable to set fallback ip routing next hop");
  }

  drop(reason = "unknown") {
    // eslint-disable-next-line no-console
    console.warn("packet dropped: ", reason);
    network.deletePacket(this.id);
  }
}
