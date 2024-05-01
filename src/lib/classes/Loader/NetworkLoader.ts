import network from "$lib/stores/network";
import {
  type LFIBSchema,
  type FIBSchema,
  type firstHopSchema,
  validateDefaultNetwork,
} from "$lib/classes/Loader/NetworkSchemas";
import LER from "$lib/classes/MPLS/LER";
import LFIB from "$lib/classes/MPLS/LFIB";
import FIB from "$lib/classes/MPLS/FIB";
import type { z } from "zod";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

export default function loadDefaultNetwork() {
  if (!validateDefaultNetwork.success) {
    throw validateDefaultNetwork.error;
  }

  for (const routerData of validateDefaultNetwork.data.routers) {
    switch (routerData.type) {
      case "LER": {
        routerData.LFIB;

        const lfib = generateLFIB(routerData.LFIB);
        const fib = generateFIB(routerData.FIB);
        const ler = new LER(routerData.id, routerData.node, fib, lfib);

        network.addRouter(ler);
        break;
      }
      case "LSR": {
        const lfib = generateLFIB(routerData.LFIB);
        const lsr = new LSR(routerData.id, routerData.node, lfib);

        network.addRouter(lsr);
        break;
      }
      case "CE": {
        const firstHopMap = generateFirstHopMap(routerData.firstHop);
        const ce = new CE(routerData.id, routerData.node, firstHopMap);

        network.addRouter(ce);
        break;
      }
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

function generateLFIB(record: z.infer<typeof LFIBSchema>): LFIB {
  const lfibMap = new Map<number, { outgoingLabel: number; nextHop: string }>();

  for (const [key, value] of Object.entries(record)) {
    const parsedKey = parseInt(key, 10);
    const { outgoingLabel, nextHop } = value;
    lfibMap.set(parsedKey, { outgoingLabel, nextHop });
  }

  return new LFIB(lfibMap);
}

function generateFIB(record: z.infer<typeof FIBSchema>): FIB {
  const fibmap = new Map<string, { label: number; nextHop: string }>();

  for (const [key, value] of Object.entries(record)) {
    const { label, nextHop } = value;
    fibmap.set(key, { label, nextHop });
  }

  return new FIB(fibmap);
}

function generateFirstHopMap(record: z.infer<typeof firstHopSchema>): Map<string, number> {
  const firstHopMap = new Map<string, number>();

  for (const [key, value] of Object.entries(record)) {
    firstHopMap.set(key, value);
  }

  return firstHopMap;
}
