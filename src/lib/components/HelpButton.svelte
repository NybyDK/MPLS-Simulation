<script lang="ts">
	import Dialog from "$lib/components/Modal.svelte";

	let dialog: HTMLDialogElement;
</script>

<div>
	<button on:click={() => dialog.showModal()}>Help</button>
</div>

<Dialog bind:dialog>
	Drag and drop nodes that you want to add. <br /><br />
	Hold shiftKey and drag nodes to make connections between the nodes. <br /><br />
	Press Esc to close this popup.
</Dialog>

<style>
	button {
		padding: 5px;
	}
</style>
