<script lang="ts">
	import dagre from "@dagrejs/dagre";
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
		{ text: "Dagre", callback: dagreify },
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
	];

	function dagreify() {
		if ($network.nodes.length === 0) return;

		const graph = new dagre.graphlib.Graph();

		graph.setGraph({ rankdir: "LR" });
		graph.setDefaultEdgeLabel(() => ({}));

		$network.nodes.forEach((node) => {
			graph.setNode(node.id.toString(), { label: node.label, width: 20, height: 20 });
		});

		$network.connections.forEach((connection) => {
			graph.setEdge(connection.source.id.toString(), connection.target.id.toString());
		});

		dagre.layout(graph);

		graph.nodes().forEach((id) => {
			const node = network.getNode(parseInt(id));

			if (node) {
				const layout = graph.node(id);
				node.x = layout.x;
				node.y = layout.y;
			}
		});

		network.fastUpdate();
	}

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

		const layout = cy.layout(layoutOptions);

		layout.run();

		cy.nodes().forEach((n) => {
			const layout = n.position();
			const node = network.getSureNode(parseInt(n.id()));
			node.x = layout.x;
			node.y = layout.y;
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
