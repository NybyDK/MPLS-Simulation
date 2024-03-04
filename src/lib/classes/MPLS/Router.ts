import Packet from "$lib/classes/MPLS/Packet";

export default abstract class Router {
	protected name: string;
	protected labelSpace: Map<string, number>;
	protected neighborRouters: Set<Router>;

	constructor(name: string) {
		this.name = name;
		this.labelSpace = new Map();
		this.neighborRouters = new Set();
	}

	protected addNeighborRouter(neighborRouter: Router) {
		this.neighborRouters.add(neighborRouter);
	}

	protected sendPacket(packet: Packet, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			if (neighborRouter.name === nextHop) {
				neighborRouter.processPacket(packet);
				return;
			}
		}
	}

	abstract processPacket(packet: Packet): void;
}
