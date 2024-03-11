import Router from "$lib/classes/MPLS/Router";

export interface Connection {
  source: Router;
  target: Router;
}

export interface NetworkState {
  routers: Router[];
  connections: Connection[];
}

type Megabits = number;

export interface Flow {
  size: Megabits;
  destination: string;
}
