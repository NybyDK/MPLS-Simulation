import { writable } from "svelte/store";

export default writable({
  running: true,
  speedMultiplier: 1,
});
