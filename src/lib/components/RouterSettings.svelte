<script lang="ts">
	import { network } from "$lib/stores/network";
	import Dialog from "$lib/components/Dialog.svelte";
	import type Router from "$lib/classes/MPLS/Router";
	import CE from "$lib/classes/MPLS/CE";
	import RoutingTable from "./RoutingTable.svelte";

	export let router: Router | null;
	export let dialog: HTMLDialogElement;

	function handleClick() {
		if (router && confirm("Are you sure you want to delete this router?")) {
			network.deleteRouter(router.id);
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
	{#if router}
		<label>
			Label:
			<input type="text" bind:value={router.node.label} />
		</label>

		<p>ID: {router.id}</p>
		<p>Type: {router.type}</p>
		<p>Position: {router.node.x.toFixed(2)}, {router.node.y.toFixed(2)}</p>
		{#if router instanceof CE}
			<p>Address: {router.address}</p>
		{/if}
		<RoutingTable bind:router />
		<button on:click={handleClick}>Delete Router</button>
	{:else}
		<p>You somehow double-clicked on a router that can't be found?</p>
	{/if}
</Dialog>
