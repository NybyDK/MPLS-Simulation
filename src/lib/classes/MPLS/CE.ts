import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class CE extends Router {
  address = `CE-IP-${this.id}`;
  // Maps address destination to link
  firstHop: Map<string, number> = new Map();

  addEmptyEntry = () => {
    this.firstHop.set("", 0);
  };

  receiveEntry = (address: string, link: number) => {
    this.firstHop.set(address, link);
  };

  updateAddress = (oldAddress: string, newAddress: string) => {
    if (oldAddress === newAddress) return;

    const oldValue = this.firstHop.get(oldAddress);
    if (oldValue === undefined) {
      alert(`Unable to update old first hop Address '${oldAddress}' to '${newAddress}'.`);
      return;
    }

    this.firstHop.set(newAddress, oldValue);
    this.firstHop.delete(oldAddress);
  };

  deleteEntry = (address: string) => {
    this.firstHop.delete(address);
  };

  receivePacket(packet: Packet) {
    packet.drop("CE received packet.");
  }

  clearTables() {
    this.firstHop.clear();
  }

  get type(): "CE" {
    return "CE";
  }
}
