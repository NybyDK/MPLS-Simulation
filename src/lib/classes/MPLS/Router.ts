import Packet from "$lib/classes/MPLS/Packet";

export default abstract class Router {
	protected name: string;
	protected labelTable: Map<number, { outgoingLabel: number; nextHop: string }>;
	protected routingTable: Map<string, string>;
	protected neighborRouters: Set<Router>;

	constructor(name: string) {
		this.name = name;
		this.labelTable = new Map();
		this.routingTable = new Map();
		this.neighborRouters = new Set();
	}

	addNeighborRouter(neighborRouter: Router) {
		this.neighborRouters.add(neighborRouter);
	}

	advertiseRoutingInformation(destinationIP: string, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			neighborRouter.receiveRoutingInformation(destinationIP, nextHop);
		}
	}

	advertiseLabelMapping(incomingLabel: number, outgoingLabel: number, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			neighborRouter.receiveLabelMapping(incomingLabel, outgoingLabel, nextHop);
		}
	}

	receiveRoutingInformation(destinationIP: string, nextHop: string) {
		this.routingTable.set(destinationIP, nextHop);
	}

	receiveLabelMapping(incomingLabel: number, outgoingLabel: number, nextHop: string) {
		this.labelTable.set(incomingLabel, { outgoingLabel, nextHop });
	}

	abstract processPacket(packet: Packet): void;

	protected sendPacket(packet: Packet, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			if (neighborRouter.name === nextHop) {
				neighborRouter.processPacket(packet);
				return;
			}
		}
	}
}
