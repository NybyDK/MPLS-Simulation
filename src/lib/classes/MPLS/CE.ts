import Router from "$lib/classes/MPLS/Router";
import type Packet from "$lib/classes/MPLS/Packet";

export default class CE extends Router {
  address = `CE-IP-${this.id}`;
  // Maps address destination to link
  firstHop: Map<string, number> = new Map();

  constructor(
    id: number,
    node: { label: string; x: number; y: number },
    map?: Map<string, number>,
  ) {
    super(id, node);
    this.address = `CE-IP-${this.id}`;
    this.firstHop = map ? map : new Map<string, number>();
  }

  addEmptyEntry = () => {
    this.firstHop.set("", 0);
  };

  receiveEntry = (address: string, link: number) => {
    this.firstHop.set(address, link);
  };

  updateAddress = (oldAddress: string, newAddress: string) => {
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
    packet.drop("CE received packet. Dropping.");
  }

  clearTables() {
    this.firstHop.clear();
  }

  get type(): "CE" {
    return "CE";
  }
}
