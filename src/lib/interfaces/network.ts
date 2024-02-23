export enum NodeType {
	Customer,
	Edge,
	Core,
}

export interface Node {
	id: string;
	label: string;
	type: NodeType;
}

export interface Connection {
	source: string;
	target: string;
}

export interface NetworkState {
	nodes: Node[];
	connections: Connection[];
}
