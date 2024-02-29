<script lang="ts">
	export let dialog: HTMLDialogElement | null = null;
</script>

<dialog bind:this={dialog} on:close>
	<slot />
</dialog>

<style>
	dialog {
		margin: auto;
	}
</style>
