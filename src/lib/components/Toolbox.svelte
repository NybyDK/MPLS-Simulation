<script lang="ts">
	import cytoscape from "cytoscape";
	import type { LayoutOptions } from "cytoscape";
	import { network } from "$lib/stores/network";
	import { NodeType } from "$lib/interfaces/network";
	import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
	import ToolboxButton from "$lib/components/ToolboxButton.svelte";

	const ToolboxRouters = [
		{ text: "+ Customer", type: NodeType.Customer, color: "lightgreen" },
		{ text: "+ Edge", type: NodeType.Edge, color: "cyan" },
		{ text: "+ Core", type: NodeType.Core, color: "hotpink" },
	];

	const ToolboxButtons = [
		{
			text: "Clear",
			callback: () => {
				if (confirm("Are you sure you want to clear the network?")) network.clear();
			},
		},
		{
			text: "Grid",
			callback: () => {
				cytoscapeify({ name: "grid", spacingFactor: 10, animate: false });
			},
		},
		{
			text: "Breadthfirst",
			callback: () => {
				cytoscapeify({ name: "breadthfirst", spacingFactor: 100, animate: false });
			},
		},
		{
			text: "Cose",
			callback: () => {
				cytoscapeify({
					name: "cose",
					nodeRepulsion: function () {
						return 524288;
					},
					animate: false,
				});
			},
		},
		{
			text: "Concentric",
			callback: () => {
				cytoscapeify({ name: "concentric", spacingFactor: 10, animate: false });
			},
		},
		{
			text: "Circle",
			callback: () => {
				cytoscapeify({ name: "circle", spacingFactor: 50, animate: false });
			},
		},
	];

	function cytoscapeify(layoutOptions: LayoutOptions) {
		if ($network.nodes.length === 0) return;

		const cy = cytoscape({
			headless: true,
			elements: {
				nodes: $network.nodes.map((node) => ({
					data: { id: node.id.toString() },
				})),
				edges: $network.connections.map((connection) => ({
					data: {
						source: connection.source.id.toString(),
						target: connection.target.id.toString(),
					},
				})),
			},
		});

		cy.layout(layoutOptions).run();

		cy.nodes().forEach((n) => {
			const node = network.getNode(parseInt(n.id()));

			if (node) {
				const layout = n.position();
				node.x = layout.x;
				node.y = layout.y;
			}
		});

		network.fastUpdate();
	}
</script>

{#each ToolboxRouters as router}
	<ToolboxRouter {...router} />
{/each}
{#each ToolboxButtons as button}
	<ToolboxButton {...button} />
{/each}
