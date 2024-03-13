import { network } from "$lib/stores/network";
import type Router from "./MPLS/Router";

export function dijkstra(source: Router, destination: Router) {
  const routers = network.routers;
  const numRouters: number = routers.length;
  const distances: number[] = new Array<number>(numRouters).fill(Infinity);
  const visited: boolean[] = new Array<boolean>(numRouters).fill(false);
  const previous: (Router | null)[] = new Array<Router | null>(numRouters).fill(null);

  distances[routers.indexOf(source)] = 0;
  let destinationReached = false;

  while (!destinationReached) {
    let currentRouter: Router | null = null;
    let minDistance: number = Infinity;

    // Find the unvisited router with the smallest distance
    for (let i = 0; i < numRouters; i++) {
      if (!visited[i] && distances[i] < minDistance) {
        currentRouter = routers[i];
        minDistance = distances[i];
      }
    }

    if (currentRouter === null || currentRouter.id === destination.id) {
      destinationReached = true;
      continue;
    }

    visited[routers.indexOf(currentRouter)] = true;

    // Update distances to neighboring routers
    for (const connection of network.connections) {
      let neighborRouter: Router;

      if (connection.source === currentRouter) {
        neighborRouter = connection.target;
      } else if (connection.target === currentRouter) {
        neighborRouter = connection.source;
      } else continue;

      const neighborIndex: number = routers.indexOf(neighborRouter);
      const totalDistance: number = minDistance + connection.distance;

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
