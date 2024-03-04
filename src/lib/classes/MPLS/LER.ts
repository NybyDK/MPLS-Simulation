import Router from "$lib/classes/MPLS/Router";
import Packet from "$lib/classes/MPLS/Packet";

export default class LER extends Router {
	private routingTable: Map<string, string>;

	constructor(name: string) {
		super(name);
		this.routingTable = new Map();
	}

	assignLabel(destinationIP: string, label: number) {
		this.labelSpace.set(destinationIP, label);
	}

	advertiseRoutingInformation(destinationIP: string, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			if (neighborRouter instanceof LER) {
				neighborRouter.receiveRoutingInformation(destinationIP, nextHop);
			}
		}
	}

	receiveRoutingInformation(destinationIP: string, nextHop: string) {
		this.routingTable.set(destinationIP, nextHop);
	}

	processPacket(packet: Packet) {
		const nextHop = this.routingTable.get(packet.destination);
		if (nextHop) {
			packet.destination = nextHop;
			packet.label = this.labelSpace.get(packet.destination) || 0;

			this.sendPacket(packet, nextHop);
		}
	}
}
