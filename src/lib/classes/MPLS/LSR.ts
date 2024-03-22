import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class LSR extends Router {
  // Maps incoming label to outgoing label and next hop
  LIB: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();
  allowedConnections: string[] = ["LSR", "LER"];

  addEmptyLIBEntry = () => {
    this.LIB.set(0, { outgoingLabel: 0, nextHop: "0" });
  };

  updateLIBLabel = (oldLabel: number, newLabel: number) => {
    const oldValue = this.LIB.get(oldLabel);
    if (!oldValue)
      throw new Error(`Unable to update old LIB label '${oldLabel}' to '${newLabel}'.`);

    this.LIB.set(newLabel, oldValue);
    this.LIB.delete(oldLabel);
  };

  deleteLIBEntry = (label: number) => {
    this.LIB.delete(label);
  };

  receiveLIBEntry = (incomingLabel: number, outgoingLabel: number, nextHop: string) => {
    this.LIB.set(incomingLabel, { outgoingLabel, nextHop });
  };

  // TODO: Instead of early return, do fallback to normal routing lookup, and if that fails too, packet.destroy();
  receivePacket(packet: Packet): void {
    const nextHop = this.LIB.get(packet.label)?.nextHop;
    if (!nextHop) return;

    const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
    if (!newLabel) return;
    packet.label = newLabel;

    const nextRouter = network.getRouter(parseInt(nextHop));
    if (!nextRouter) return;
    packet.nextHop = nextRouter;

    // TODO: Check if packet is below 0, if so, destroy it
    packet.ttl -= 1;
  }

  get type(): "LSR" {
    return "LSR";
  }
}
