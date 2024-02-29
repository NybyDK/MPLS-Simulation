<script lang="ts">
	import Network from "$lib/components/Network.svelte";
	import Dialog from "$lib/components/Dialog.svelte";
	let dialog: HTMLDialogElement;
</script>

<h1>MPLS Simulation but without any Simulation and any MPLS so far</h1>

<button on:click={() => dialog.showModal()}>Open It!</button>

<Dialog bind:dialog on:close={() => console.log("closed")}>
	This is amazingly simple! (press esc to close)
</Dialog>

<Network />
