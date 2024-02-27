export enum NodeType {
	Customer,
	Edge,
	Core,
}

export interface Node {
	id: number;
	label: string;
	x: number;
	y: number;
	type: NodeType;
}

export interface Connection {
	source: Node;
	target: Node;
}

export interface NetworkState {
	nodes: Node[];
	connections: Connection[];
}
