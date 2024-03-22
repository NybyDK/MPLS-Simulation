import type Router from "$lib/classes/MPLS/Router";

export default class Link {
  public bandwidth: number = 0;
  public weight: number = 0;

  constructor(
    public readonly id: string,
    public readonly source: Router,
    public readonly target: Router,
  ) {}

  get distance() {
    return Math.round(
      Math.sqrt(
        (this.source.node.x - this.target.node.x) ** 2 +
          (this.source.node.y - this.target.node.y) ** 2,
      ),
    );
  }
}
