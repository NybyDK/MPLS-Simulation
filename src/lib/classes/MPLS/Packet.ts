import { get } from "svelte/store";
import network from "$lib/stores/network";
import config from "$lib/stores/config";
import CE from "$lib/classes/MPLS/CE";
import type Router from "$lib/classes/MPLS/Router";
import findShortestPath from "$lib/functions/findShortestPath";

export default class Packet {
  private ttl: number = 32;
  public label: number = -1;
  public fallbackRoute: Router[] | undefined = undefined;
  public nextHop!: Router;

  constructor(
    public readonly id: number,
    public readonly source: CE,
    public readonly destination: CE,
    public node: { x: number; y: number },
  ) {
    const nextHopRouterID = source.firstHop.get(destination.address);
    if (!nextHopRouterID) {
      this.drop("No next hop router id found.");
      return;
    }

    const nextHopRouter = network.getRouter(nextHopRouterID);
    if (!nextHopRouter) {
      this.drop("No next hop router found.");
      return;
    }

    this.nextHop = nextHopRouter;
  }

  decrementTTL() {
    if (--this.ttl <= 0) this.drop();
  }

  fallback(currentRouter: Router) {
    if (!get(config).enableFallback) return this.drop("Fallback is disabled.");

    this.label = -1;
    this.decrementTTL();
    if (this.fallbackRoute) return this.setFallbackNextHop();

    this.fallbackRoute = findShortestPath(currentRouter, this.destination);
    const destinationRouter = this.fallbackRoute[this.fallbackRoute.length - 1];

    if (!(destinationRouter instanceof CE)) return this.drop("The destination is not a CE.");
    this.fallbackRoute.shift();

    this.setFallbackNextHop();
  }

  validateNextHop(currentRouter: Router): boolean {
    return (
      network.doesLinkExist({ source: currentRouter, target: this.nextHop }) ||
      network.doesLinkExist({ source: this.nextHop, target: currentRouter })
    );
  }

  setFallbackNextHop() {
    const nextHop = this.fallbackRoute?.shift();

    if (this.fallbackRoute && nextHop) this.nextHop = nextHop;
    else this.drop("Unable to set fallback IP routing next hop");
  }

  drop(reason = "Unknown") {
    // eslint-disable-next-line no-console
    console.warn("Packet dropped: ", reason);
    network.deletePacket(this.id);
  }
}
