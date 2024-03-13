export interface ConnectionConfig {
	source: {
		labelSpace: Record<string, unknown>;
		neighborRouters: Record<string, unknown>;
		id: number;
		node: {
			label: string;
			x: number;
			y: number;
		};
		allowedConnections: string[];
	};
	target: {
		labelSpace: Record<string, unknown>;
		neighborRouters: Record<string, unknown>;
		id: number;
		node: {
			label: string;
			x: number;
			y: number;
		};
		routingTable?: Record<string, unknown>;
		allowedConnections: string[];
	};
}