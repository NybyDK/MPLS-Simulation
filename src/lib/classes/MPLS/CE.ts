import Router from "$lib/classes/MPLS/Router";
import Packet from "$lib/classes/MPLS/Packet";

export default class CE extends Router {
	nextHop: string | undefined;
	allowedConnections: string[] = ["LER"];

	processPacket(packet: Packet) {
		if (!this.nextHop) return;
		this.sendPacket(packet, this.nextHop);
	}

	get type(): "CE" {
		return "CE";
	}
}
