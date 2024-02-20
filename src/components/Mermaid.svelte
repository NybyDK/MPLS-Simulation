<script lang="ts">
	import mermaid from "mermaid";
	import { onMount } from "svelte";

	export let input: string;

	onMount(async () => {
		mermaid.initialize({ startOnLoad: true });
	});

	async function graphDefinitionToSVG(mermaidCode: any) {
		// This is to display the "Loading..." message before Mermaid hogs the main thread
		await new Promise((resolve) => setTimeout(resolve, 0));
		return (await mermaid.render("container", mermaidCode)).svg;
	}
</script>

{#await graphDefinitionToSVG(input)}
	<p>Loading...</p>
{:then svg}
	{@html svg}
{:catch error}
	<p>{error}</p>
{/await}
