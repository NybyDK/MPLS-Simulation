<script lang="ts">
	export let dialog: HTMLDialogElement | null = null;
</script>

<dialog bind:this={dialog} on:close>
	<slot />
</dialog>

<style>
	dialog {
		padding: 10px;
		margin: auto;
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 139, 0.25);
	}
</style>
