import { z } from "zod";

const NodeSchema = z.array({
	id: z.number(),
	
	label: z.string(),
	x: z.number(),
	y: z.number(),

});

export const RouterConfigSchema = z.object({
	labelSpace: z.record(z.unknown()),
	neighborRouters: z.record(z.unknown()),
	id: z.number(),
	node: NodeSchema,
	allowedConnections: z.array(z.string()),
	routingTable: z.record(z.unknown()).optional(),
});

export const ConnectionConfigSchema = z.object({
	source: RouterConfigSchema,
	target: RouterConfigSchema.omit({ routingTable: true }),
});
