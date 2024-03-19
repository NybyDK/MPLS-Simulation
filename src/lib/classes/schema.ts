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

const Connection = z.object({
  id: z.string(),
  source: Router,
  target: Router,
  bandwidth: z.number(),
  distance: z.number(),
  weight: z.number(),
});

const DefaultNetworkSchema = z.object({
  store: z.object({}).optional(),
  _routers: z.array(Router),
  _connections: z.array(Connection).optional(),
});

export const validateDefaultNetwork = DefaultNetworkSchema.safeParse(DefaultNetwork);
