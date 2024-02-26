<script lang="ts">
	import { network } from "$lib/stores/network";
	import { type Node, type Connection, NodeType } from "$lib/interfaces/network";

	const sections = [
		{ title: "Customers", nodeType: NodeType.Customer },
		{ title: "Edge Routers", nodeType: NodeType.Edge },
		{ title: "Core Routers", nodeType: NodeType.Core },
	];

	let openNodeIndex = -1;

	// Add a uniquely named node to the network by prompting for its name
	function addNode(type: NodeType) {
		const name = prompt("Name");

		if (!name) {
			return;
		}

		if ($network.nodes.find((node) => node.id === name)) {
			alert("Name already exists");
			return;
		}

		const newNode: Node = { id: name, label: name, x: 20, y: 20, type };
		$network.nodes = [...$network.nodes, newNode];
	}

	// Add a connection between two nodes by prompting for their IDs
	function addConnection() {
		const id1 = prompt("Source");

		if (!id1) {
			return;
		}

		if (!$network.nodes.find((node) => node.id === id1)) {
			alert("Source does not exist");
			return;
		}

		const id2 = prompt("Target");

		if (!id2) {
			return;
		}

		if (!$network.nodes.find((node) => node.id === id2)) {
			alert("Target does not exist");
			return;
		}

		const newConnection: Connection = { source: id1, target: id2 };
		$network.connections = [...$network.connections, newConnection];
	}

	// Delete a node from the network and all connections to it
	function deleteNode(id: string) {
		const index = $network.nodes.findIndex((node) => node.id === id);
		const nodeId = $network.nodes[index].id;

		$network.nodes = $network.nodes.toSpliced(index, 1);
		$network.connections = $network.connections.filter(
			(connection) => connection.source !== nodeId && connection.target !== nodeId,
		);
	}

	// Delete a connection from the network
	function deleteConnection(index: number) {
		$network.connections = $network.connections.toSpliced(index, 1);
	}

	// Toggle the display of additional information about a node
	function toggleNode(id: string) {
		const index = $network.nodes.findIndex((node) => node.id === id);
		openNodeIndex = index === openNodeIndex ? -1 : index;
	}
</script>

<div>
	<h2>Nodes</h2>
	<button
		on:click={() => {
			addNode(NodeType.Customer);
		}}>Add Customer</button
	>
	<button
		on:click={() => {
			addNode(NodeType.Edge);
		}}>Add Edge Router</button
	>
	<button
		on:click={() => {
			addNode(NodeType.Core);
		}}>Add Core Router</button
	>
	{#each sections as section}
		<h2>{section.title}</h2>
		{#each $network.nodes.filter((node) => node.type === section.nodeType) as node}
			<div>
				<button
					on:click={() => {
						toggleNode(node.id);
					}}>{node.label}</button
				><button
					on:click={() => {
						deleteNode(node.id);
					}}>Delete</button
				>
			</div>
		{/each}
	{/each}
</div>
<div>
	<h2>Connections</h2>
	<button on:click={addConnection}>Add Connection</button>
	<ul>
		{#each $network.connections as connection, index}
			<li>{connection.source} - {connection.target}</li>
			<button
				on:click={() => {
					deleteConnection(index);
				}}>Delete</button
			>
		{/each}
	</ul>
</div>
<div>
	{#if openNodeIndex !== -1}
		<div>
			<h2>Additional Information</h2>
			<p>ID: {$network.nodes[openNodeIndex].id}</p>
			<p>Name: {$network.nodes[openNodeIndex].label}</p>
			<p>Type: {NodeType[$network.nodes[openNodeIndex].type]}</p>
		</div>
	{/if}
</div>
