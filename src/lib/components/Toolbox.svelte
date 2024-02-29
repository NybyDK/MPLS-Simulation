<script lang="ts">
	import { NodeType } from "$lib/interfaces/network";
	import ToolboxItem from "$lib/components/ToolboxItem.svelte";

	const ToolboxItems = [
		{ text: "+ Customer", type: NodeType.Customer, color: "lightgreen" },
		{ text: "+ Edge", type: NodeType.Edge, color: "cyan" },
		{ text: "+ Core", type: NodeType.Core, color: "hotpink" },
	];
</script>

{#each ToolboxItems as item}
	<ToolboxItem {...item} />
{/each}
