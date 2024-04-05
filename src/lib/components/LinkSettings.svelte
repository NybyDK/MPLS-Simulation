<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import type Link from "$lib/classes/MPLS/Link";
  import Dialog from "$lib/components/Dialog.svelte";

  export let link: Link | null;
  export let dialog: HTMLDialogElement;

  function handleClickDeleteButton() {
    if (!$locked && link && confirm("Are you sure you want to delete this link?")) {
      network.deleteLink(link.id);
      dialog.close();
    }
  }
</script>

<Dialog
  bind:dialog
  on:close={() => {
    network.notify();
  }}
>
  {#if link}
    Distance: {link.distance}
    <label>
      Bandwidth:
      <input type="number" disabled={$locked} bind:value={link.bandwidth} />
    </label>
    <button on:click={handleClickDeleteButton}>Delete Link</button>
  {:else}
    <p>You somehow double-clicked on a link that can't be found?</p>
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
