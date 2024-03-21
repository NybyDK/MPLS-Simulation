import Router from "$lib/classes/MPLS/Router";
import type { Flow } from "$lib/interfaces/network";
import type Packet from "./Packet";

export default class CE extends Router {
  flows: Flow[] = [];
  address = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  nextHop: string | undefined;
  allowedConnections: string[] = ["LER"];

  addEmptyFlow = () => {
    this.flows.push({ size: 0, destination: "" });
  };

  deleteFlow = (index: number) => {
    this.flows.splice(index, 1);
  };

  receivePacket(packet: Packet): void {
    packet.destroy();
  }

  get type(): "CE" {
    return "CE";
  }
}
