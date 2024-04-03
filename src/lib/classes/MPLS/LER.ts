import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";
import CE from "$lib/classes/MPLS/CE";

export default class LER extends Router {
  // Maps Customer Edge address to next hop and first label
  FIB: Map<string, { label: number; nextHop: string }> = new Map();
  // Maps incoming label to outgoing label and next hop
  LIB: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();

  addEmptyFIBEntry = () => {
    this.FIB.set("0", { label: 0, nextHop: "0" });
  };

  addEmptyLIBEntry = () => {
    this.LIB.set(0, { outgoingLabel: 0, nextHop: "0" });
  };

  updateFIBAddress = (oldAddress: string, newAddress: string) => {
    const oldValue = this.FIB.get(oldAddress);
    if (!oldValue)
      throw new Error(`Unable to update old FIB address '${oldAddress}' to '${newAddress}'.`);

    this.FIB.set(newAddress, oldValue);
    this.FIB.delete(oldAddress);
  };

  updateLIBLabel = (oldLabel: number, newLabel: number) => {
    const oldValue = this.LIB.get(oldLabel);
    if (!oldValue)
      throw new Error(`Unable to update old LIB label '${oldLabel}' to '${newLabel}'.`);

    this.LIB.set(newLabel, oldValue);
    this.LIB.delete(oldLabel);
  };

  deleteFIBEntry = (address: string) => {
    this.FIB.delete(address);
  };

  deleteLIBEntry = (label: number) => {
    this.LIB.delete(label);
  };

  receiveFIBEntry = (destination: string, label: number, nextHop: string) => {
    this.FIB.set(destination, { label, nextHop });
  };

  receiveLIBEntry = (incomingLabel: number, outgoingLabel: number, nextHop: string) => {
    this.LIB.set(incomingLabel, { outgoingLabel, nextHop });
  };

  receivePacket(packet: Packet): void {
    // Extract destination address from the packet
    const destination = packet.destination.address;
  
    // If the packet's label is -1, indicating it's not labeled
    if (packet.label === -1) {
      // Attempt to retrieve next hop information from the Forwarding Information Base (FIB)
      const nextHop = this.FIB.get(destination)?.nextHop;
      if (nextHop) { // If next hop is found, attempt to retrieve label information from FIB
        const newLabel = this.FIB.get(destination)?.label;
        if (newLabel) { // update packet's label and node information
          packet.label = newLabel;
          packet.node = { x: this.node.x, y: this.node.y };
  
          // Retrieve next router based on next hop information
          const nextRouter = network.getRouter(parseInt(nextHop));
          if (nextRouter) { // If next router is found, assign it as the next hop for the packet
            packet.nextHop = nextRouter;
          }
        }
      }
    } else {
      // else the packet must be labelled and we retrieve hop information from the LIB
      const nextHop = this.LIB.get(packet.label)?.nextHop;
      if (nextHop) { // If next hop is found, retrieve outgoing label information from LIB
        const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
        if (newLabel) { // If outgoing info = found, update packet's label and node information
          packet.label = newLabel;
          packet.node = { x: this.node.x, y: this.node.y };
  
          // LDP needs to communicate first hop to source CE, so it can start by sending to the correct LER
          // Find the next router which is a CE and matches the next hop address
          const nextRouter = network.routers.find(
            (router) => router instanceof CE && router.address === nextHop,
          );
          if (nextRouter) {  // If next router is found, assign it as the next hop for the packet
            packet.nextHop = nextRouter;
          }
        }
      }
    }
  
    // Check if packet's TTL is below 0, if so, it will be dropped
    packet.decrementTTL();
  }

  get type(): "LER" {
    return "LER";
  }
}
