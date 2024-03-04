import { writable, type Writable } from "svelte/store";
import type { Connection, NetworkState, Node, NodeType } from "$lib/interfaces/network";

export class NetworkStore implements Writable<NetworkState> {
	private store = writable<NetworkState>({ nodes: [], connections: [] });

	set = this.store.set;
	update = this.store.update;
	subscribe = this.store.subscribe;

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

		this.fastUpdate();
	}

	deleteNode(nodeId: number) {
		const node = this.getNode(nodeId);

		if (node) {
			this._nodes = this._nodes.filter((n) => n.id !== nodeId);
			this._connections = this._connections.filter(
				(c) => c.source.id !== nodeId && c.target.id !== nodeId,
			);
			this.nodeMap.delete(nodeId);
		}

		this.fastUpdate();
	}

	addConnection(input: { source: Node; target: Node }) {
		if (input.source === input.target) return;

		if (
			this.doesConnectionExist(input.source, input.target) ||
			this.doesConnectionExist(input.target, input.source)
		) {
			return;
		}

		this._connections.push(input);
		this.fastUpdate();
	}

	private doesConnectionExist(source: Node, target: Node) {
		return this._connections.some((c) => c.source === source && c.target === target);
	}

	createNode(input: { label: string; x: number; y: number; type: NodeType }) {
		const node: Node = {
			id: this.counter++,
			...input,
		};

		this.addNode(node);
	}

	addNode(node: Node) {
		this._nodes.push(node);
		this.nodeMap.set(node.id, node);
		this.fastUpdate();
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

	clear() {
		this._nodes = [];
		this._connections = [];
		this.nodeMap.clear();
		this.counter = 0;
		this.fastUpdate();
	}

	fastUpdate() {
		this.store.set(this.networkState);
	}
}
