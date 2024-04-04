export default class LIB {
  // Maps incoming label to outgoing label and next hop
  map: Map<number, { outgoingLabel: number; nextHop: string }> = new Map();

  get(number: number) {
    return this.map.get(number);
  }

  addEmptyEntry = () => {
    this.map.set(0, { outgoingLabel: 0, nextHop: "0" });
  };

  receiveEntry = (incomingLabel: number, outgoingLabel: number, nextHop: string) => {
    this.map.set(incomingLabel, { outgoingLabel, nextHop });
  };

  updateLabel = (oldLabel: number, newLabel: number) => {
    const oldValue = this.map.get(oldLabel);
    if (!oldValue) {
      throw new Error(`Unable to update old LIB label '${oldLabel}' to '${newLabel}'.`);
    }

    if (this.map.get(newLabel)) {
      throw new Error(`Label entry '${newLabel}' already exists.`);
    }

    this.map.set(newLabel, oldValue);
    this.map.delete(oldLabel);
  };

  deleteEntry = (label: number) => {
    this.map.delete(label);
  };
}
