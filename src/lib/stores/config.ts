import { writable } from "svelte/store";

export default writable({
  running: true,
  enableFallback: false,
  speedMultiplier: 1,
  maxPackets: 100,
});
