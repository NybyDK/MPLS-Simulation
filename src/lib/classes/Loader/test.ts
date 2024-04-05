import { z } from "zod";
import DefaultNetwork from "$lib/data/network.json";

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const LIBSchema = z.record(
  z.object({
    outgoingLabel: z.number(),
    nextHop: z.string(),
  }),
);

const FIBSchema = z.record(
  z.object({
    label: z.number(),
    nextHop: z.string(),
  }),
);

const firstHopSchema = z.record(z.number());

const CESchema = z.object({
  address: z.string(),
  destinations: z.array(z.string()),
  firstHop: firstHopSchema,
});

const LERSchema = z.object({
  LIB: LIBSchema,
  FIB: FIBSchema,
});

const LSRSchema = z.object({
  LIB: LIBSchema,
});

const RouterSchema = z
  .object({
    type: z.union([z.literal("CE"), z.literal("LER"), z.literal("LSR")]),
    id: z.number(),
    node: NodeSchema,
    address: z.string(),
    destinations: z.array(z.string()),
  })
  .and(z.union([CESchema, LERSchema, LSRSchema]));

const Link = z.object({
  id: z.string(),
  source: RouterSchema,
  target: RouterSchema,
  bandwidth: z.number(),
});

const DefaultNetworkSchema = z.object({
  store: z.object({}).optional(),
  _routers: z.array(RouterSchema),
  _links: z.array(Link),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(DefaultNetwork);
