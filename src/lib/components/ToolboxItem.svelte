<script lang="ts">
	import type { NodeType } from "$lib/interfaces/network";
	export let text: string;
	export let type: NodeType;

	function dragStart(event: DragEvent) {
		event.dataTransfer?.setData("text/plain", type.toString());
	}
</script>

<div draggable="true" on:dragstart={dragStart} role="button" tabindex="-1">
	{text}
</div>

<style>
	div {
		border: 2px solid black;
		padding: 5px;
		user-select: none;
	}
</style>
