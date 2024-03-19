export default abstract class Router {
  abstract allowedConnections: string[];

  constructor(
    public readonly id: number,
    public node: { label: string; x: number; y: number },
  ) {}

  abstract get type(): "LER" | "LSR" | "CE";
}
