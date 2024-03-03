import Router from "$lib/classes/MPLS/Router";
import Packet from "$lib/classes/MPLS/Packet";

export default class LER extends Router {
	private labelSpace: Map<string, number>;

	constructor(name: string) {
		super(name);
		this.labelSpace = new Map();
	}

	processPacket(packet: Packet) {
		const nextHop = this.routingTable.get(packet.destination);
		if (nextHop) {
			packet.destination = nextHop;
			packet.label = this.labelSpace.get(packet.destination) || 0;

			this.sendPacket(packet, nextHop);
		}
	}

	assignLabel(destinationIP: string, label: number) {
		this.labelSpace.set(destinationIP, label);
	}
}
