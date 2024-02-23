import { writable } from "svelte/store";

import type { NetworkState } from "$lib/interfaces/network";

const initialState: NetworkState = {
	nodes: [],
	connections: [],
};

export const network = writable(initialState);
