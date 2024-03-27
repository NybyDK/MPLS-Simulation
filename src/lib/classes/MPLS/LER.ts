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

  // TODO: Instead of early return, do fallback to normal routing lookup, and if that fails too, packet.drop();
  receivePacket(packet: Packet): void {
    const destination = packet.destination;

    if (packet.label === -1) {
      const nextHop = this.FIB.get(destination.address)?.nextHop;
      if (!nextHop) return;

      const newLabel = this.FIB.get(destination.address)?.label;
      if (!newLabel) return;

      packet.label = newLabel;

      const nextRouter = network.getRouter(parseInt(nextHop));
      if (!nextRouter) return;

      packet.nextHop = nextRouter;
    } else {
      const nextHop = this.LIB.get(packet.label)?.nextHop;
      if (!nextHop) return;

      const newLabel = this.LIB.get(packet.label)?.outgoingLabel;
      if (!newLabel) return;
      packet.label = newLabel;

      // LDP needs to communicate firsthop to source CE, so it can start by sending to the correct LER
      const nextRouter = network.routers.find(
        (router) => router instanceof CE && router.address === nextHop,
      );
      if (!nextRouter) return;

      packet.nextHop = nextRouter;
    }

    packet.decrementTTL();
  }

  get type(): "LER" {
    return "LER";
  }
}
