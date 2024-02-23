<script lang="ts">
	import mermaid from "mermaid";
	import { onMount } from "svelte";
	import { Render } from "svelte-purify/browser-only";
	import { network } from "$lib/stores/network";

	let input: string;
	$: {
		input = `flowchart LR\n`;
		input += $network.nodes.map((n) => `  ${n.id}[(${n.label})]`).join("\n");
		input += "\n";
		input += $network.connections.map((c) => `  ${c.source} --- ${c.target}`).join("\n");
	}

	onMount(() => {
		mermaid.initialize({ startOnLoad: true });
	});

	async function graphDefinitionToSVG(graphDefinition: string) {
		// This is to display the "Loading..." message before Mermaid hogs the main thread
		await new Promise((resolve) => setTimeout(resolve, 0));
		return (await mermaid.render("mermaid-container", graphDefinition)).svg;
	}
</script>

{#await graphDefinitionToSVG(input)}
	<p>Loading...</p>
{:then svg}
	<Render html={svg} config={{ ADD_TAGS: ["foreignObject"] }}></Render>
{:catch error}
	<p>{error}</p>
{/await}
