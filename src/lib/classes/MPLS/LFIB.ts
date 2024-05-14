export default class LFIB {
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
    if (oldLabel === newLabel) return;

    const oldValue = this.map.get(oldLabel);
    if (!oldValue) {
      alert(`Unable to update old LFIB label '${oldLabel}' to '${newLabel}'.`);
      return;
    }

    if (this.map.get(newLabel)) {
      alert(`Label entry '${newLabel}' already exists.`);
      return;
    }

    this.map.set(newLabel, oldValue);
    this.map.delete(oldLabel);
  };

  deleteEntry = (label: number) => {
    this.map.delete(label);
  };
}
