import { writable, type Writable } from "svelte/store";
import type { Connection, NetworkState, Node, NodeType } from "$lib/interfaces/network";

export class NetworkStore implements Writable<NetworkState> {
	private store = writable<NetworkState>({ nodes: [], connections: [] });

	set: Writable<NetworkState>["set"] = this.store.set;
	update: Writable<NetworkState>["update"] = this.store.update;
	subscribe: Writable<NetworkState>["subscribe"] = this.store.subscribe;

	private _nodes: Node[] = [];
	private _connections: Connection[] = [];
	private nodeMap = new Map<number, Node>();
	private counter = 0;

	get nodes() {
		return this._nodes;
	}

	get connections() {
		return this._connections;
	}

	get networkState(): NetworkState {
		return {
			nodes: this.nodes,
			connections: this.connections,
		};
	}

	deleteConnection(connection: Connection) {
		this._connections = this._connections.filter(
			(c) => c.source.id !== connection.source.id || c.target.id !== connection.target.id,
		);
	}

	deleteNode(nodeId: number) {
		const node = this.getNode(nodeId);
		if (node) {
			this._nodes = this._nodes.filter((n) => n.id !== nodeId);
			this.nodeMap.delete(nodeId);
		}
	}

	addConnection(input: { source: Node; target: Node }) {
		this._connections.push(input);
	}

	createNode(label: string, x: number, y: number, type: NodeType) {
		const node: Node = {
			id: this.counter++,
			label,
			x,
			y,
			type,
		};
		this.addNode(node);
	}

	addNode(node: Node) {
		this._nodes.push(node);
		this.nodeMap.set(node.id, node);
	}

	getNode(id: number) {
		return this.nodeMap.get(id);
	}

	getSureNode(id: number) {
		const node = this.getNode(id);
		if (!node) {
			throw new Error(`Node with id ${id} not found`);
		}
		return node;
	}

	fastUpdate() {
		this.store.set(this.networkState);
	}
}
