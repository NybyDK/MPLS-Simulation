import { z } from "zod";
import test from "$lib/data/test.json";

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const LFIBSchema = z.record(
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
  firstHop: firstHopSchema,
});

const LERSchema = z.object({
  LFIB: LFIBSchema,
  FIB: FIBSchema,
});

const LSRSchema = z.object({
  LFIB: LFIBSchema,
});

const RouterSchema = z
  .object({
    type: z.union([z.literal("CE"), z.literal("LER"), z.literal("LSR")]),
    id: z.number(),
    node: NodeSchema,
    LFIB: z.optional(LFIBSchema),
    FIB: z.optional(FIBSchema),
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

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(test);
