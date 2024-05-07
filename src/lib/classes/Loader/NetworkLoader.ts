import { NetworkSchema } from "$lib/classes/Loader/NetworkSchemas";
import network from "$lib/stores/network";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

export default function loadNetwork(unparsedNetwork: unknown): boolean {
  const Network = NetworkSchema.safeParse(unparsedNetwork);

  if (!Network.success) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load network data", Network.error);
    return false;
  }

  let maxId = 0;

  for (const routerData of Network.data.routers) {
    maxId = Math.max(maxId, routerData.id);
    switch (routerData.type) {
      case "LER": {
        const ler = new LER(routerData.id, routerData.node);

        Object.entries(routerData.LFIB).forEach(([key, value]) => {
          ler.LFIB.receiveEntry(parseInt(key), value.outgoingLabel, value.nextHop);
        });

        Object.entries(routerData.FIB).forEach(([key, value]) => {
          ler.FIB.receiveEntry(key, value.label, value.nextHop);
        });

        network.addRouter(ler);
        break;
      }
      case "LSR": {
        const lsr = new LSR(routerData.id, routerData.node);

        Object.entries(routerData.LFIB).forEach(([key, value]) => {
          lsr.LFIB.receiveEntry(parseInt(key), value.outgoingLabel, value.nextHop);
        });

        network.addRouter(lsr);
        break;
      }
      case "CE": {
        const ce = new CE(routerData.id, routerData.node);

        Object.entries(routerData.firstHop).forEach(([key, value]) => {
          ce.receiveEntry(key, value);
        });

        network.addRouter(ce);
        break;
      }
    }
  }

  network.setRouterCount(maxId + 1);

  for (const linkData of Network.data.links) {
    const sourceRouter = network.getRouter(linkData.source);
    const targetRouter = network.getRouter(linkData.target);

    if (sourceRouter && targetRouter) {
      network.addLink({
        source: sourceRouter,
        target: targetRouter,
        bandwidth: linkData.bandwidth,
      });
    }
  }

  return true;
}
