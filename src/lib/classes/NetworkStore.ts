import { writable, type Writable } from "svelte/store";
import type { NetworkState } from "$lib/interfaces/network";
import type Router from "$lib/classes/MPLS/Router";
import Link from "$lib/classes/MPLS/Link";
import Packet from "$lib/classes/MPLS/Packet";
import LER from "$lib/classes/MPLS/LER";
import LSR from "$lib/classes/MPLS/LSR";
import CE from "$lib/classes/MPLS/CE";
import { validateDefaultNetwork } from "$lib/classes/schema";

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

  addLink(input: { source: Router; target: Router; bandwidth?: number }) {
    if (input.source === input.target) return;

    if (!allowedLinks[input.source.type].includes(input.target.type)) return;

    if (
      this.doesLinkExist(input) ||
      this.doesLinkExist({ source: input.target, target: input.source })
    ) {
      return;
    }

    const link = new Link(`${input.source.id}-${input.target.id}`, input.source, input.target);

    if (input.bandwidth !== undefined) {
      link.bandwidth = input.bandwidth;
    }

    this._links.push(link);
    this.fastUpdate();
  }

  deleteLink(id: string) {
    this._links = this._links.filter((link) => link.id !== id);

    this.fastUpdate();
  }

  private doesLinkExist(input: { source: Router; target: Router }) {
    return this._links.some((link) => link.source === input.source && link.target === input.target);
  }

  createCE(node: { label: string; x: number; y: number }) {
    const router = new CE(this.routerCounter++, node);

    this.addRouter(router);
  }

  createLER(node: { label: string; x: number; y: number }) {
    const router = new LER(this.routerCounter++, node);

    this.addRouter(router);
  }

  createLSR(node: { label: string; x: number; y: number }) {
    const router = new LSR(this.routerCounter++, node);

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
    this._links = this._links.filter((link) => link.source.id !== id && link.target.id !== id);
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

  addPacket(source: CE, destination: CE) {
    const packet = new Packet(this.packetCounter++, source, destination, {
      x: source.node.x,
      y: source.node.y,
    });
    this._packets.push(packet);
    this.fastUpdate();
  }

  deletePacket(id: number) {
    this._packets = this._packets.filter((packet) => packet.id !== id);
    this.fastUpdate();
  }

  clear() {
    this._routers = [];
    this._links = [];
    this._packets = [];
    this.routerMap.clear();
    this.routerCounter = 0;
    this.packetCounter = 0;
    this.fastUpdate();
  }

  constructor() {
    this.loadDefaultNetwork();
  }

  loadDefaultNetwork() {
    if (!validateDefaultNetwork.success) throw new Error("unable to parse default");
    for (const routerData of validateDefaultNetwork.data._routers) {
      switch (routerData.node.label) {
        case "LER":
          this.createLER({
            label: routerData.node.label,
            x: routerData.node.x,
            y: routerData.node.y,
          });
          break;
        case "LSR":
          this.createLSR({
            label: routerData.node.label,
            x: routerData.node.x,
            y: routerData.node.y,
          });
          break;
        case "CE":
          this.createCE({
            label: routerData.node.label,
            x: routerData.node.x,
            y: routerData.node.y,
          });
          break;
        default:
          break;
      }
    }
    if (validateDefaultNetwork.data._links) {
      for (const linkData of validateDefaultNetwork.data._links) {
        const sourceRouter = this.getRouter(linkData.source.id);
        const targetRouter = this.getRouter(linkData.target.id);

        if (sourceRouter && targetRouter) {
          this.addLink({
            source: sourceRouter,
            target: targetRouter,
            bandwidth: linkData.bandwidth,
          });
        }
      }
    }
  }

  fastUpdate() {
    this.store.set(this.networkState);
  }
}
