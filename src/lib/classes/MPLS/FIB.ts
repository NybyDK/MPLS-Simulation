export default class FIB {
  // Maps Customer Edge address to first label and next hop
  map: Map<string, { label: number; nextHop: string }> = new Map();

  get(address: string) {
    return this.map.get(address);
  }

  addEmptyEntry = () => {
    this.map.set("0", { label: 0, nextHop: "0" });
  };

  receiveEntry = (destination: string, label: number, nextHop: string) => {
    this.map.set(destination, { label, nextHop });
  };

  updateAddress = (oldAddress: string, newAddress: string) => {
    const oldValue = this.map.get(oldAddress);
    if (!oldValue) {
      alert(`Unable to update old FIB address '${oldAddress}' to '${newAddress}'.`);
      return;
    }

    if (this.map.get(newAddress)) {
      alert(`Address '${newAddress}' already exists in FIB.`);
      return;
    }

    this.map.set(newAddress, oldValue);
    this.map.delete(oldAddress);
  };

  deleteEntry = (address: string) => {
    this.map.delete(address);
  };
}
