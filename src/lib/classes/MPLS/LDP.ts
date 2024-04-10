import type Router from "$lib/classes/MPLS/Router";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

const min = 16; // First 16 are reserved
const max = 2 ** 20 - 1; // Two to the power of twenty and then minus one

export default function LDP(path: Router[], destination: string) {
  const sourceCE = path[0];

  if (!(sourceCE instanceof CE)) {
    alert("The path does not start with a CE");
    return;
  }

  const sourceLER = path[1];

  if (!(sourceLER instanceof LER)) {
    alert("The source CE is not directly connected to an LER");
    return;
  }

  sourceCE.firstHop.set(destination, sourceLER.id);

  if (sourceLER.FIB.get(destination)) return;

  const destinationLERIndex = path.length - 2;
  const destinationLER = path[destinationLERIndex];

  if (!(destinationLER instanceof LER)) {
    alert("Destination CE is not connected directly to a LER");
    return;
  }

  let incomingLabel = generateLabel(path[destinationLERIndex]);

  destinationLER.LFIB.receiveEntry(incomingLabel, -1, destination);

  for (let i = path.length - 2; i > 0; i--) {
    const currentRouter = path[i];
    const previousRouter = path[i - 1];

    const outgoingLabel = incomingLabel;
    incomingLabel = generateLabel(currentRouter);

    if (previousRouter instanceof LER) {
      previousRouter.FIB.receiveEntry(destination, outgoingLabel, currentRouter.id.toString());
    } else if (previousRouter instanceof LSR) {
      previousRouter.LFIB.receiveEntry(incomingLabel, outgoingLabel, currentRouter.id.toString());
    }
  }
}

function isLabelUsed(router: Router, label: number) {
  if (router instanceof LSR || router instanceof LER) {
    return router.LFIB.map.has(label);
  }

  return false;
}

function generateLabel(router: Router) {
  let label: number;

  do {
    label = Math.floor(Math.random() * (max - min + 1) + min);
  } while (isLabelUsed(router, label));

  return label;
}
