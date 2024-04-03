import type Router from "$lib/classes/MPLS/Router";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

const min = 16;
const max = 2 ** 20 - 1; // Two to the power of twenty and then minus one

export default function LDP(path: Router[], destination: string) {
  const destinationLERIndex = path.length - 2;
  const destinationLER = path[destinationLERIndex];

  if (!(destinationLER instanceof LER)) {
    throw new Error("Destination CE is not connected directly to a LER");
  }

  let incomingLabel = generateLabel(path[destinationLERIndex]);

  destinationLER.LIB.receiveEntry(incomingLabel, -1, destination);

  for (let i = path.length - 2; i > 0; i--) {
    const currentRouter = path[i];
    const previousRouter = path[i - 1];

    const outgoingLabel = incomingLabel;
    incomingLabel = generateLabel(currentRouter);

    if (previousRouter instanceof LER) {
      previousRouter.FIB.receiveEntry(destination, outgoingLabel, currentRouter.id.toString());
    } else if (previousRouter instanceof LSR) {
      previousRouter.LIB.receiveEntry(incomingLabel, outgoingLabel, currentRouter.id.toString());
    }
  }

  const sourceCE = path[0];

  if (!(sourceCE instanceof CE)) {
    throw new Error("The path does not start with a CE");
  }

  sourceCE.firstHop.set(destination, path[1].id);
}

function isLabelUsed(router: Router, label: number) {
  if (router instanceof LSR || router instanceof LER) {
    return router.LIB.map.has(label);
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
