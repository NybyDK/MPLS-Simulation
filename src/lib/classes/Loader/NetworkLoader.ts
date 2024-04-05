import type { NetworkStore } from "../NetworkStore";
import { validateDefaultNetwork } from "./test";

export function loadDefaultNetwork(NetworkStore: NetworkStore) {
  if (!validateDefaultNetwork.success) {
    throw validateDefaultNetwork.error;
  }

  for (const routerData of validateDefaultNetwork.data._routers) {
    const originalLabel = routerData.node.label;
    switch (originalLabel) {
      case "LER":
        NetworkStore.createLER(routerData.node.x, routerData.node.y);
        break;
      case "LSR":
        NetworkStore.createLSR(routerData.node.x, routerData.node.y);
        break;
      case "CE":
        NetworkStore.createCE(routerData.node.x, routerData.node.y);
        break;
      default:
        break;
    }
  }
  for (const linkData of validateDefaultNetwork.data._links) {
    const sourceRouter = NetworkStore.getRouter(linkData.source.id);
    const targetRouter = NetworkStore.getRouter(linkData.target.id);

    if (sourceRouter && targetRouter) {
      NetworkStore.addLink({
        source: sourceRouter,
        target: targetRouter,
        bandwidth: linkData.bandwidth,
      });
    }
  }
}
