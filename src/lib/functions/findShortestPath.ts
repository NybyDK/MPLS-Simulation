import network from "$lib/stores/network";
import type Router from "$lib/classes/MPLS/Router";
import type CE from "$lib/classes/MPLS/CE";
import LER from "$lib/classes/MPLS/LER";

export default function findShortestPath(source: Router, destination: CE) {
  const routers = network.routers;
  const numRouters: number = routers.length;
  const distances: number[] = new Array<number>(numRouters).fill(Infinity);
  const visited: boolean[] = new Array<boolean>(numRouters).fill(false);
  const previous: (Router | null)[] = new Array<Router | null>(numRouters).fill(null);

  distances[routers.indexOf(source)] = 0;
  let destinationReached = false;
  let firstLER = false;

  while (!destinationReached) {
    let currentRouter: Router | null = null;
    let minDistance: number = Infinity;

    // Find the unvisited router with the smallest distance
    for (const [i, router] of routers.entries()) {
      if (!visited[i] && distances[i] < minDistance) {
        // But skip LERs that are in the middle of the LSP, we only use LERs for ingress and egress
        if (router instanceof LER) {
          if (!firstLER) {
            firstLER = true;
          } else {
            const LERConnectsToDestination = network.links.some(
              (link) =>
                (link.source === router && link.target === destination) ||
                (link.target === router && link.source === destination),
            );
            if (!LERConnectsToDestination) {
              continue;
            }
          }
        }

        currentRouter = router;
        minDistance = distances[i];
      }
    }

    if (!currentRouter || currentRouter.id === destination.id) {
      destinationReached = true;
      continue;
    }

    visited[routers.indexOf(currentRouter)] = true;

    // Update distances to neighboring routers
    for (const link of network.links) {
      let neighborRouter: Router;

      if (link.source === currentRouter) {
        neighborRouter = link.target;
      } else if (link.target === currentRouter) {
        neighborRouter = link.source;
      } else continue;

      const neighborIndex: number = routers.indexOf(neighborRouter);
      const totalDistance: number = minDistance + link.distance;

      if (totalDistance < distances[neighborIndex]) {
        distances[neighborIndex] = totalDistance;
        previous[neighborIndex] = currentRouter;
      }
    }
  }

  // Reconstruct path
  const path: Router[] = [];
  let vertex: Router | null = destination;
  while (vertex) {
    path.unshift(vertex);
    const vertexIndex: number = routers.indexOf(vertex);
    vertex = previous[vertexIndex];
  }

  return path;
}
