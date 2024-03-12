import type Router from "$lib/classes/MPLS/Router";

type Megabits = number;
type Kilometers = number;

export interface Connection {
  source: Router;
  target: Router;
  bandwidth: Megabits;
  distance: Kilometers;
}

export interface Flow {
  size: Megabits;
  destination: string;
}

export interface NetworkState {
  routers: Router[];
  connections: Connection[];
}
