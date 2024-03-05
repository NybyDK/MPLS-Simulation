import Packet from "$lib/classes/MPLS/Packet";

export default abstract class Router {
  protected labelSpace: Map<string, number>;
  protected neighborRouters: Set<Router>;

  abstract allowedConnections: string[];

  constructor(
    public readonly id: number,
    public node: { label: string; x: number; y: number },
  ) {
    this.labelSpace = new Map();
    this.neighborRouters = new Set();
  }

  protected addNeighborRouter(neighborRouter: Router) {
    this.neighborRouters.add(neighborRouter);
  }

  protected sendPacket(packet: Packet, nextHop: string) {
    for (const neighborRouter of this.neighborRouters) {
      if (neighborRouter.node.label === nextHop) {
        neighborRouter.processPacket(packet);
        return;
      }
    }
  }

  abstract processPacket(packet: Packet): void;

  abstract get type(): "LER" | "LSR" | "CE";
}
