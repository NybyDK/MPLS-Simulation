import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class LER extends Router {
  // Maps Customer Edge address to next hop and first label
  FIB: Map<string, { label: number; nextHop: string }> = new Map([
    [
      "0",
      {
        label: 0,
        nextHop: "0",
      },
    ],
  ]);
  allowedConnections: string[] = ["CE", "LSR"];

  assignLabel = (destinationIP: string, label: number) => {
    this.labelSpace.set(destinationIP, label);
  };

  addEmptyEntry = () => {
    this.FIB.set("0", { label: 0, nextHop: "0" });
  };

  updateAddress = (oldAddress: string, newAddress: string) => {
    const oldValue = this.FIB.get(oldAddress);
    if (!oldValue)
      throw new Error(`Unable to update old FIB address '${oldAddress}' to '${newAddress}'.`);

    this.FIB.set(newAddress, oldValue);
    this.FIB.delete(oldAddress);
  };

  deleteEntry = (address: string) => {
    this.FIB.delete(address);
  };

  advertiseInformation = (destination: string, label: number, nextHop: string) => {
    for (const neighborRouter of this.neighborRouters) {
      if (neighborRouter instanceof LER) {
        neighborRouter.receiveInformation(destination, label, nextHop);
      }
    }
  };

  receiveInformation = (destination: string, label: number, nextHop: string) => {
    this.FIB.set(destination, { label, nextHop });
  };

  processPacket = (packet: Packet) => {
    const destination = this.FIB.get(packet.destination);
    if (destination) {
      packet.label = destination.label;
      packet.destination = destination.nextHop;

      this.sendPacket(packet, destination.nextHop);
    }
  };

  get type(): "LER" {
    return "LER";
  }
}
