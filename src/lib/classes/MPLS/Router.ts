import type Packet from "$lib/classes/MPLS/Packet";

export default abstract class Router {
  abstract allowedConnections: string[];

  constructor(
    public readonly id: number,
    public node: { label: string; x: number; y: number },
  ) {}

  abstract receivePacket(packet: Packet): void;

  abstract get type(): "LER" | "LSR" | "CE";
}
