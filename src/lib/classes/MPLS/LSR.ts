import { network } from "$lib/stores/network";
import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class LSR extends Router {
  // Maps Customer Edge address to next hop and first label
  FIB: Map<string, { label: number; nextHop: string }> = new Map();
  // Maps incoming label to outgoing label and next hop
  LIB: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();

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

  receivePacket(packet: Packet): void { //In short: recieve packet, see if the label is "readable", if not do normal routing.
    const nextHop = this.LIB.get(packet.label)?.nextHop;
    const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
  
    // If either next hop or outgoing label is missing, fallback to normal routing
    if (!nextHop || !newLabel) {       
      const destination = packet.destination.address;
  
      // Attempt to retrieve next hop information from FIB
      const fallbackNextHop = this.FIB.get(destination)?.nextHop;
  
      // If fallback next hop information is available, proceed with normal routing
      if (fallbackNextHop) {
        // Attempt to retrieve label information for the fallback next hop from the FIB
        const fallbackNewLabel = this.FIB.get(destination)?.label;
  
        // If label information for the fallback next hop is available, update the packet's label
        if (fallbackNewLabel) {
          packet.label = fallbackNewLabel;
  
          // Retrieve the next router based on the fallback next hop information
          const nextRouter = network.getRouter(parseInt(fallbackNextHop));
  
          // If the next router is found, assign it as the next hop for the packet
          if (nextRouter) {
            packet.nextHop = nextRouter;
          }
        }
      }
    } else { // If next hop and outgoing label are both present, we finna MPLS (OG code)
      packet.label = newLabel;
  
      // Retrieve the next router based on the next hop information
      const nextRouter = network.getRouter(parseInt(nextHop));
  
      // If the next router is found, assign it as the next hop for the packet
      if (nextRouter) {
        packet.nextHop = nextRouter;
      }
    }
  
    // Decrease the Time-to-Live (TTL) of the packet
    packet.decrementTTL();
  }
  

  get type(): "LSR" {
    return "LSR";
  }
}
