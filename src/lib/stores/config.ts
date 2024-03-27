import { writable } from "svelte/store";

export const config = writable({
  running: true,
  speedMultiplier: 1,
});
