<script lang="ts">
  import network from "$lib/stores/network";
  import locked from "$lib/stores/locked";
  import type Link from "$lib/classes/MPLS/Link";
  import Dialog from "$lib/components/Dialog.svelte";
  import SmallButton from "$lib/components/RouterTables/SmallButton.svelte";

  export let link: Link | null;
  export let dialog: HTMLDialogElement;

  function handleClickDeleteButton() {
    if (!$locked && link) {
      if (!confirm("Are you sure you want to delete this link?")) return;
      network.deleteLink(link.id);
      dialog.close();
    } else {
      alert("You can't delete a link while the network is locked.");
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
    Distance: {link.distance} km
    <label>
      Bandwidth:
      <input type="number" disabled={$locked} bind:value={link.bandwidth} />
    </label>
    <div>
      <SmallButton text="Delete Link" callback={handleClickDeleteButton} />
    </div>
  {:else}
    <p>You somehow double-clicked on a link that can't be found?</p>
  {/if}
</Dialog>

<style>
  div {
    margin-top: 5px;
  }

  label {
    display: block;
  }

  input {
    width: 100%;
  }
</style>
