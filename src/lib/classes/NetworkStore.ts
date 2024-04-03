import { writable, type Writable } from "svelte/store";
import type { NetworkState } from "$lib/interfaces/network";
import type Router from "$lib/classes/MPLS/Router";
import Link from "$lib/classes/MPLS/Link";
import Packet from "$lib/classes/MPLS/Packet";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";

const allowedLinks = {
  CE: ["LER"],
  LER: ["CE", "LSR"],
  LSR: ["LER", "LSR"],
};

export class NetworkStore implements Writable<NetworkState> {
  private store = writable<NetworkState>({ routers: [], links: [], packets: [] });

  set = this.store.set;
  update = this.store.update;
  subscribe = this.store.subscribe;

  private _routers: Router[] = [];
  private _links: Link[] = [];
  private _packets: Packet[] = [];
  private routerMap = new Map<number, Router>();
  private routerCounter = 0;
  private packetCounter = 0;

  get routers() {
    return this._routers;
  }

  get links() {
    return this._links;
  }

  get packets() {
    return this._packets;
  }

  get networkState(): NetworkState {
    return {
      routers: this.routers,
      links: this.links,
      packets: this.packets,
    };
  }

  addLink(input: { source: Router; target: Router }) {
    if (input.source === input.target) return;

    if (!allowedLinks[input.source.type].includes(input.target.type)) return;

    if (
      this.doesLinkExist(input) ||
      this.doesLinkExist({ source: input.target, target: input.source })
    ) {
      return;
    }

    const link = new Link(`${input.source.id}-${input.target.id}`, input.source, input.target);

    this._links.push(link);
    this.notify();
  }

  deleteLink(id: string) {
    this._links = this._links.filter((link) => link.id !== id);

    this.notify();
  }

  private doesLinkExist(input: { source: Router; target: Router }) {
    return this._links.some((link) => link.source === input.source && link.target === input.target);
  }

  createCE(x: number, y: number) {
    const id = this.routerCounter++;

    const router = new CE(id, {
      label: `CE ${id}`,
      x,
      y,
    });

    this.addRouter(router);
  }

  createLER(x: number, y: number) {
    const id = this.routerCounter++;

    const router = new LER(id, {
      label: `LER ${id}`,
      x,
      y,
    });

    this.addRouter(router);
  }

  createLSR(x: number, y: number) {
    const id = this.routerCounter++;

    const router = new LSR(id, {
      label: `LSR ${id}`,
      x,
      y,
    });

    this.addRouter(router);
  }

  private addRouter(router: Router) {
    this._routers.push(router);
    this.routerMap.set(router.id, router);
    this.notify();
  }

  deleteRouter(id: number) {
    const router = this.getRouter(id);

    if (!router) return;

    this._routers = this._routers.filter((router) => router.id !== id);
    this._links = this._links.filter((link) => link.source.id !== id && link.target.id !== id);
    this.routerMap.delete(id);

    this.notify();
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

  addPacket(source: CE, destination: CE) {
    const packet = new Packet(this.packetCounter++, source, destination, {
      x: source.node.x,
      y: source.node.y,
    });
    this._packets.push(packet);
    this.notify();
  }

  deletePacket(id: number) {
    this._packets = this._packets.filter((packet) => packet.id !== id);
    this.notify();
  }

  clearPackets() {
    this._packets = [];
    this.packetCounter = 0;
    this.notify();
  }

  clear() {
    this._routers = [];
    this._links = [];
    this._packets = [];
    this.routerMap.clear();
    this.routerCounter = 0;
    this.packetCounter = 0;
    this.notify();
  }

  notify() {
    this.store.set(this.networkState);
  }
}
