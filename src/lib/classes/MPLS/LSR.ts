import Router from "$lib/classes/MPLS/Router";

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

  get type(): "LSR" {
    return "LSR";
  }
}
