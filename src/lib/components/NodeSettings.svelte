<script lang="ts">
	import { network } from "$lib/stores/network";
	import type { Node } from "$lib/interfaces/network";
	import Dialog from "$lib/components/Dialog.svelte";

	export let node: Node | null;
	export let dialog: HTMLDialogElement;

	function handleClick(event: MouseEvent) {
		if (node && confirm("Are you sure you want to delete this node?")) {
			network.deleteNode(node.id);
			dialog.close();
		}
	}
</script>

<Dialog
	bind:dialog
	on:close={() => {
		network.fastUpdate();
	}}
>
	{#if node}
		<label>
			Label:
			<input type="text" bind:value={node.label} />
		</label>

		<p>ID: {node.id}</p>
		<p>Type: {node.type}</p>
		<p>Position: {node.x.toFixed(2)}, {node.y.toFixed(2)}</p>
		<button on:click={handleClick}>Delete Node</button>
	{:else}
		<p>You somehow double-clicked on a node that can't be found?</p>
	{/if}
</Dialog>
