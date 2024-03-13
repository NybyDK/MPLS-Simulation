export interface routerConfig {
	labelSpace: Record<string, unknown>;
	neighborRouters: Record<string, unknown>;
	id: number;
	node: {
		label: string;
		x: number;
		y: number;
	};
	allowedConnections: string[];
}
