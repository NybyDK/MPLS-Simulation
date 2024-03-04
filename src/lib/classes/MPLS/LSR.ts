import Router from "$lib/classes/MPLS/Router";
import Packet from "$lib/classes/MPLS/Packet";

export default class LSR extends Router {
	private labelTable: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();

	allowedConnections: string[] = ["LSR", "LER"];

	receiveLabelMapping(incomingLabel: number, outgoingLabel: number, nextHop: string) {
		this.labelTable.set(incomingLabel, { outgoingLabel, nextHop });
	}

	advertiseLabelMapping(incomingLabel: number, outgoingLabel: number, nextHop: string) {
		for (const neighborRouter of this.neighborRouters) {
			if (neighborRouter instanceof LSR) {
				neighborRouter.receiveLabelMapping(incomingLabel, outgoingLabel, nextHop);
			}
		}
	}

	processPacket(packet: Packet) {
		const forwardingInfo = this.labelTable.get(packet.label);
		if (forwardingInfo) {
			packet.destination = forwardingInfo.nextHop;
			packet.label = forwardingInfo.outgoingLabel;

			this.sendPacket(packet, packet.destination);
		}
	}

	get type(): "LSR" {
		return "LSR";
	}
}
