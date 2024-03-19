import Router from "$lib/classes/MPLS/Router";

export default class LER extends Router {
  // Maps Customer Edge address to next hop and first label
  FIB: Map<string, { label: number; nextHop: string }> = new Map();
  // Maps incoming label to outgoing label and next hop
  LIB: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();
  allowedConnections: string[] = ["CE", "LSR"];

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

  get type(): "LER" {
    return "LER";
  }
}
