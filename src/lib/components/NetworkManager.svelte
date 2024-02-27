<script lang="ts">
	import { network } from "$lib/stores/network";
	import { type Node, NodeType } from "$lib/interfaces/network";

	const sections = [
		{ title: "Customers", nodeType: NodeType.Customer },
		{ title: "Edge Routers", nodeType: NodeType.Edge },
		{ title: "Core Routers", nodeType: NodeType.Core },
	];

	let openNode: Node | undefined = undefined;

	// Add a uniquely named node to the network by prompting for its name
	function addNode(type: NodeType) {
		const name = prompt("Name") || "Name";

		network.createNode(name, 20, 20, type);
	}

	// Toggle the display of additional information about a node
	function toggleNode(id: string) {
		openNode = network.getNode(id);
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
						network.deleteNode(node.id);
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
		{#each $network.connections as connection}
			<li>{connection.source} - {connection.target}</li>
			<button
				on:click={() => {
					network.deleteConnection(connection);
				}}>Delete</button
			>
		{/each}
	</ul>
</div>
<div>
	{#if openNode}
		<div>
			<h2>Additional Information</h2>
			<p>ID: {openNode.id}</p>
			<p>Name: {openNode.label}</p>
			<p>Type: {openNode.type}</p>
		</div>
	{/if}
</div>
