export enum NodeType {
	Customer,
	Edge,
	Core,
}

export function isNodeType(type: number): type is NodeType {
	return Object.values(NodeType).includes(type as NodeType);
}

export interface Node {
	id: string;
	label: string;
	x: number;
	y: number;
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
