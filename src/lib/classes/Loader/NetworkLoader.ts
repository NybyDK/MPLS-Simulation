import type { NetworkStore } from "../NetworkStore";
import { validateDefaultNetwork } from "$lib/classes/Loader/NodeSchema";

const labelMap: Record<string, string> = {
  LER: "LER",
  LSR: "LSR",
  CE: "CE",
};

export function loadDefaultNetwork(NetworkStore: NetworkStore) {
  if (!validateDefaultNetwork.success) {
    throw validateDefaultNetwork.error;
  }

  for (const routerData of validateDefaultNetwork.data._routers) {
    const originalLabel = routerData.node.label;
    const editedLabel = labelMap[originalLabel];
    if (!editedLabel) {
      throw new Error(`Unreconized label: ${originalLabel}`);
    }
    switch (editedLabel) {
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
  if (validateDefaultNetwork.data._links) {
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
}
