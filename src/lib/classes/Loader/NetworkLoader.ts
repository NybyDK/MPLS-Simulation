import network from "$lib/stores/network";
import { validateDefaultNetwork } from "$lib/classes/Loader/NetworkSchemas";
import LER from "$lib/classes/MPLS/LER";
import LFIB from "$lib/classes/MPLS/LFIB";

export default function loadDefaultNetwork() {
  if (!validateDefaultNetwork.success) {
    throw validateDefaultNetwork.error;
  }

  let ler;

  for (const routerData of validateDefaultNetwork.data.routers) {
    switch (routerData.type) {
      case "LER":
        ler = new LER(routerData.id, routerData.node);
        ler.node.x = routerData.node.x;
        ler.node.y = routerData.node.y;
        if (routerData.LFIB) {
          const lfib = new LFIB();
          for (const [incomingLabel, { outgoingLabel, nextHop }] of Object.entries(
            routerData.LFIB,
          )) {
            lfib.receiveEntry(Number(incomingLabel), outgoingLabel, nextHop);
          }
          (ler as { LFIB: LFIB }).LFIB = lfib;
        }
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
