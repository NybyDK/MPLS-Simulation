import { z } from "zod";

import DefaultNetwork from "$lib/data/DefaultNetwork.json";

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const Router = z.object({
  label: z.literal("LSR").or(z.literal("LER")).or(z.literal("CE")),
  id: z.number(),
  node: NodeSchema,
  LIB: z.object({}).optional(),
  FIB: z.object({}).optional(),
  adress: z.string().optional(),
  destinations: z.array(z.string()).optional(),
});

const Link = z.object({
  id: z.string(),
  source: z.object({
    id: z.number(),
    node: NodeSchema,
    LIB: z.object({}).optional(),
    FIB: z.object({}).optional(),
    adress: z.string().optional(),
    destinations: z.array(z.string()).optional(),
  }),
  target: z.object({
    id: z.number(),
    node: NodeSchema,
    LIB: z.object({}).optional(),
    FIB: z.object({}).optional(),
    address: z.string().optional(),
    destinations: z.array(z.string()).optional(),
  }),
  bandwidth: z.number().optional(),
});

const DefaultNetworkSchema = z.object({
  store: z.object({}).optional(),
  _routers: z.array(Router),
  _links: z.array(Link).optional(),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(DefaultNetwork);
