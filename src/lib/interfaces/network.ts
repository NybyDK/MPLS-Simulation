import type Router from "$lib/classes/MPLS/Router";
import type Link from "$lib/classes/MPLS/Link";
import type Packet from "$lib/classes/MPLS/Packet";

export interface NetworkState {
  routers: Router[];
  links: Link[];
  packets: Packet[];
}
