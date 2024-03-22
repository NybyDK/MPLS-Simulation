import { network } from "$lib/stores/network";
import { paths } from "$lib/stores/paths";
import type CE from "$lib/classes/MPLS/CE";
import type Router from "$lib/classes/MPLS/Router";

export default class Packet {
  private ttl: number = 32;
  public label: number = -1;
  public nextHop: Router | undefined;

  constructor(
    public readonly id: number,
    public readonly source: CE,
    public readonly destination: CE,
    public node: { x: number; y: number },
  ) {
    // TODO: Entire line will be changed soon, will use source CE's firsthop
    this.nextHop = paths.getPath(source.id, destination.id)?.[1];
  }

  decrementTTL() {
    if (--this.ttl <= 0) this.drop();
  }

  drop() {
    network.deletePacket(this.id);
  }
}
