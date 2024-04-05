import { writable, type Writable } from "svelte/store";
import { network } from "$lib/stores/network";
import type Router from "$lib/classes/MPLS/Router";

export class PathStore implements Writable<Map<number, Map<number, Router[]>>> {
  private store = writable<Map<number, Map<number, Router[]>>>();

  set = this.store.set;
  update = this.store.update;
  subscribe = this.store.subscribe;

  private _map: Map<number, Map<number, Router[]>> = new Map();

  public getPath(sourceId: number, targetId: number) {
    const sourceMap = this._map.get(sourceId);
    if (!sourceMap) return undefined;
    return sourceMap.get(targetId);
  }

  public findShortestPath(source: Router, target: Router) {
    return dijkstra(source, target);
  }

  public findShortestPaths() {
    const paths: Map<number, Map<number, Router[]>> = new Map();

    const CERouters = network.routers.filter((router) => router.type === "CE");

    for (const source of CERouters) {
      const mapToDestination: Map<number, Router[]> = new Map();
      for (const destination of CERouters) {
        if (source === destination) continue;

        const path = dijkstra(source, destination);
        mapToDestination.set(destination.id, path);
      }

      paths.set(source.id, mapToDestination);
    }

    this._map = paths;
  }

  notify() {
    this.store.set(this._map);
  }
}

function dijkstra(source: Router, destination: Router) {
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
