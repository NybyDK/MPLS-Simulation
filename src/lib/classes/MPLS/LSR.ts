import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class LSR extends Router {
  // Maps incoming label to outgoing label and next hop
  LIB: Map<number, { outgoingLabel: number; nextHop: string }> = new Map([
    [
      0,
      {
        outgoingLabel: 0,
        nextHop: "0",
      },
    ],
  ]);
  allowedConnections: string[] = ["LSR", "LER"];

  addEmptyEntry = () => {
    this.LIB.set(0, { outgoingLabel: 0, nextHop: "0" });
  };

  updateLabel = (oldLabel: number, newLabel: number) => {
    const oldValue = this.LIB.get(oldLabel);
    if (!oldValue)
      throw new Error(`Unable to update old LIB label '${oldLabel}' to '${newLabel}'.`);

    this.LIB.set(newLabel, oldValue);
    this.LIB.delete(oldLabel);
  };

  deleteEntry = (label: number) => {
    this.LIB.delete(label);
  };

  advertiseInformation = (incomingLabel: number, outgoingLabel: number, nextHop: string) => {
    for (const neighborRouter of this.neighborRouters) {
      if (neighborRouter instanceof LSR) {
        neighborRouter.receiveInformation(incomingLabel, outgoingLabel, nextHop);
      }
    }
  };

  receiveInformation = (incomingLabel: number, outgoingLabel: number, nextHop: string) => {
    this.LIB.set(incomingLabel, { outgoingLabel, nextHop });
  };

  processPacket = (packet: Packet) => {
    const forwardingInfo = this.LIB.get(packet.label);
    if (forwardingInfo) {
      packet.destination = forwardingInfo.nextHop;
      packet.label = forwardingInfo.outgoingLabel;

      this.sendPacket(packet, packet.destination);
    }
  };

  get type(): "LSR" {
    return "LSR";
  }
}
