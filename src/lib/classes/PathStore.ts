import { writable, type Writable } from "svelte/store";
import { network } from "$lib/stores/network";
import type Router from "$lib/classes/MPLS/Router";
import { dijkstra } from "$lib/classes/Dijkstra";

export class PathStore implements Writable<Map<number, Map<number, Router[]>>> {
  private store = writable<Map<number, Map<number, Router[]>>>();

  set = this.store.set;
  update = this.store.update;
  subscribe = this.store.subscribe;

  private _map: Map<number, Map<number, Router[]>> = new Map();

  public setRawNestedMap(map: Map<number, Map<number, Router[]>>) {
    this._map = map;
    this.set(this._map);
    this.fastUpdate();
  }

  public getPath(sourceId: number, targetId: number) {
    const sourceMap = this._map.get(sourceId);
    if (!sourceMap) return undefined;
    return sourceMap.get(targetId);
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

    this.setRawNestedMap(paths);
  }

  fastUpdate() {
    this.store.set(this._map);
  }
}
