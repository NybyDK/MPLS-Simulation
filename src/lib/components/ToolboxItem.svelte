<script lang="ts">
	import type { NodeType } from "$lib/interfaces/network";

	export let text: string;
	export let type: NodeType;
	export let color: string;

	function handleDragStart(event: DragEvent) {
		event.dataTransfer?.setData("text/plain", type.toString());
	}
</script>

<div
	draggable="true"
	on:dragstart={handleDragStart}
	role="button"
	tabindex="-1"
	style="background-color: {color};"
>
	{text}
</div>

<style>
	div {
		border: 2px solid black;
		padding: 5px;
		margin: 2.5px;
		user-select: none;
	}
</style>
