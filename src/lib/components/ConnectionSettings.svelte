<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import type { Connection } from "$lib/interfaces/network";
  import Dialog from "$lib/components/Dialog.svelte";

  export let connection: Connection | null;
  export let dialog: HTMLDialogElement;

  function handleClickDeleteButton() {
    if (!$locked && connection && confirm("Are you sure you want to delete this connection?")) {
      network.deleteConnection(connection.id);
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
  {#if connection}
    <label>
      Bandwidth:
      <input type="number" disabled={$locked} bind:value={connection.bandwidth} />
    </label>
    <label>
      Distance:
      <input type="number" disabled={$locked} bind:value={connection.distance} />
    </label>
    <label>
      Weight:
      <input type="number" disabled={$locked} bind:value={connection.weight} />
    </label>
    <button on:click={handleClickDeleteButton}>Delete Connection</button>
  {:else}
    <p>You somehow double-clicked on a connection that can't be found?</p>
  {/if}
</Dialog>

<style>
  label {
    display: block;
  }

  input {
    width: 100%;
  }
</style>
