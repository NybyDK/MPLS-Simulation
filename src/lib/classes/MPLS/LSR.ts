import Router from "$lib/classes/MPLS/Router";
import Packet from "$lib/classes/MPLS/Packet";

export default class LSR extends Router {
	processPacket(packet: Packet) {
		const forwardingInfo = this.labelTable.get(packet.label);
		if (forwardingInfo) {
			packet.destination = forwardingInfo.nextHop;
			packet.label = forwardingInfo.outgoingLabel;

			this.sendPacket(packet, packet.destination);
		}
	}
}
