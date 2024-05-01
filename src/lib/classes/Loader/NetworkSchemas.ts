import { z } from "zod";
import defaultNetworkJson from "$lib/data/DefaultNetwork.json";

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

export const LFIBSchema = z.record(
  z.coerce.number(),
  z.object({
    outgoingLabel: z.number(),
    nextHop: z.string(),
  }),
);

export const FIBSchema = z.record(
  z.string(),
  z.object({
    label: z.number(),
    nextHop: z.string(),
  }),
);

export const firstHopSchema = z.record(z.number());

const CESchema = z.object({
  address: z.string(),
  firstHop: firstHopSchema.or(z.object({})),
  type: z.literal("CE"),
});

const LERSchema = z.object({
  LFIB: LFIBSchema.or(z.object({})),
  FIB: FIBSchema.or(z.object({})),
  type: z.literal("LER"),
});

const LSRSchema = z.object({
  LFIB: LFIBSchema.or(z.object({})),
  type: z.literal("LSR"),
});

const RouterSchema = z
  .object({
    id: z.number(),
    node: NodeSchema,
  })
  .and(z.union([CESchema, LERSchema, LSRSchema]));

const LinkSchema = z.object({
  id: z.string(),
  source: z.number(),
  target: z.number(),
  bandwidth: z.number(),
});

const DefaultNetworkSchema = z.object({
  routers: z.array(RouterSchema),
  links: z.array(LinkSchema),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(defaultNetworkJson);
