import { z } from "zod";
import DefaultNetwork from "$lib/data/DefaultNetwork.json";

type FIBType = Record<string, { label: number; nextHop: string }>;
type LIBType = Record<string, { outgoingLabel: number; nextHop: string }>;

function FibObjectToMap(obj: FIBType): Map<string, string> {
  const map = new Map<string, string>();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const { label, nextHop } = obj[key];
      map.set(key, `${label},${nextHop}`);
    }
  }
  return map;
}

function LibObjectToMap(obj: LIBType): Map<string, string> {
  const map = new Map<string, string>();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const { outgoingLabel, nextHop } = obj[key];
      map.set(key, `${outgoingLabel},${nextHop}`);
    }
  }
  return map;
}

const FIBSchema = z
  .record(
    z.object({
      label: z.number(),
      nextHop: z.string(),
    }),
  )
  .transform(FibObjectToMap);

const LIBSchema = z
  .record(
    z.object({
      outgoingLabel: z.number(),
      nextHop: z.string(),
    }),
  )
  .transform(LibObjectToMap);

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const Router = z.object({
  id: z.number(),
  node: NodeSchema,
  LIB: LIBSchema.optional(),
  FIB: FIBSchema.optional(),
  address: z.string().optional(),
  destinations: z.array(z.string()).optional(),
});

const Link = z.object({
  id: z.string(),
  source: Router,
  target: Router,
  bandwidth: z.number().optional(),
});

const DefaultNetworkSchema = z.object({
  store: z.object({}).optional(),
  _routers: z.array(Router),
  _links: z.array(Link).optional(),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(DefaultNetwork);
