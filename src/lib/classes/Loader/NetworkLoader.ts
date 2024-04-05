import type { NetworkStore } from "../NetworkStore";
import { validateDefaultNetwork } from "./NetworkSchemas";

export function loadDefaultNetwork(network: NetworkStore) {
  if (!validateDefaultNetwork.success) {
    throw validateDefaultNetwork.error;
  }

  for (const routerData of validateDefaultNetwork.data.routers) {
    switch (routerData.type) {
      case "LER":
        network.createLER(routerData.node.x, routerData.node.y);
        break;
      case "LSR":
        network.createLSR(routerData.node.x, routerData.node.y);
        break;
      case "CE":
        network.createCE(routerData.node.x, routerData.node.y);
        break;
      default:
        break;
    }
  }
  for (const linkData of validateDefaultNetwork.data.links) {
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
}
