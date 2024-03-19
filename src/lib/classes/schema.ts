import { z } from "zod";

import DefaultNetwork from "$lib/data/DefaultNetwork.json";

const NodeSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
});

const Router = z.object({
  labelSpace: z.object({}).optional(),
  neighborRouters: z.object({}).optional(),
  id: z.number(),
  node: NodeSchema,
  LIB: z.object({}).optional(),
  FIB: z.object({}).optional(),
  allowedConnections: z.array(z.string()),
});

const DefaultNetworkSchema = z.object({
  store: z.object({}).optional(),
  _routers: z.array(Router),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(DefaultNetwork);
