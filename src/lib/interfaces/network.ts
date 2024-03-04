import Router from "$lib/classes/MPLS/Router";

export interface Connection {
	source: Router;
	target: Router;
}

export interface NetworkState {
	routers: Router[];
	connections: Connection[];
}
