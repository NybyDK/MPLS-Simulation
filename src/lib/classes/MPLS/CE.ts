import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class CE extends Router {
  address = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  destinations: string[] = [];

  addEmptyDestination = () => {
    this.destinations.push("");
  };

  deleteDestination = (index: number) => {
    this.destinations.splice(index, 1);
  };

  receivePacket(packet: Packet): void {
    packet.drop();
  }

  get type(): "CE" {
    return "CE";
  }
}
