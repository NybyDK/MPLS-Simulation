import { writable, type Writable } from "svelte/store";
import type { Connection, NetworkState } from "$lib/interfaces/network";
import type Router from "$lib/classes/MPLS/Router";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

export class NetworkStore implements Writable<NetworkState> {
  private store = writable<NetworkState>({ routers: [], connections: [] });

  set = this.store.set;
  update = this.store.update;
  subscribe = this.store.subscribe;

  private _routers: Router[] = [];
  private _connections: Connection[] = [];
  private routerMap = new Map<number, Router>();
  private counter = 0;

  get routers() {
    return this._routers;
  }

  get connections() {
    return this._connections;
  }

  get networkState(): NetworkState {
    return {
      routers: this.routers,
      connections: this.connections,
    };
  }

  addConnection(input: { source: Router; target: Router }) {
    if (input.source === input.target) return;

    if (!input.source.allowedConnections.includes(input.target.type)) return;

    if (
      this.doesConnectionExist(input) ||
      this.doesConnectionExist({ source: input.target, target: input.source })
    ) {
      return;
    }

    this._connections.push({
      id: `connection-${input.source.id}-${input.target.id}`,
      ...input,
      bandwidth: 0,
      distance: 0,
      weight: 0,
    });
    this.fastUpdate();
  }

  deleteConnection(id: string) {
    this._connections = this._connections.filter((connection) => connection.id !== id);

    this.fastUpdate();
  }

  private doesConnectionExist(input: { source: Router; target: Router }) {
    return this._connections.some(
      (connection) => connection.source === input.source && connection.target === input.target,
    );
  }

  createCE(node: { label: string; x: number; y: number }) {
    const router = new CE(this.counter++, node);

    this.addRouter(router);
  }

  createLER(node: { label: string; x: number; y: number }) {
    const router = new LER(this.counter++, node);

    this.addRouter(router);
  }

  createLSR(node: { label: string; x: number; y: number }) {
    const router = new LSR(this.counter++, node);

    this.addRouter(router);
  }

  private addRouter(router: Router) {
    this._routers.push(router);
    this.routerMap.set(router.id, router);
    this.fastUpdate();
  }

  deleteRouter(id: number) {
    const router = this.getRouter(id);

    if (!router) return;

    this._routers = this._routers.filter((router) => router.id !== id);
    this._connections = this._connections.filter(
      (connection) => connection.source.id !== id && connection.target.id !== id,
    );
    this.routerMap.delete(id);

    this.fastUpdate();
  }

  getRouter(id: number) {
    return this.routerMap.get(id);
  }

  getSureRouter(id: number) {
    const router = this.getRouter(id);

    if (!router) {
      throw new Error(`Router with id ${id} not found`);
    }

    return router;
  }

  clear() {
    this._routers = [];
    this._connections = [];
    this.routerMap.clear();
    this.counter = 0;
    this.fastUpdate();
  }

  fastUpdate() {
    this.store.set(this.networkState);
  }
}
