import type Router from "$lib/classes/MPLS/Router";

type Megabits = number;
type Kilometers = number;

export interface Connection {
  id: string;
  source: Router;
  target: Router;
  bandwidth: Megabits;
  distance: Kilometers;
  weight: number;
}

export interface Flow {
  size: Megabits;
  destination: string;
}

export interface NetworkState {
  routers: Router[];
  connections: Connection[];
}
