<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import type Router from "$lib/classes/MPLS/Router";
  import CE from "$lib/classes/MPLS/CE";
  import Dialog from "$lib/components/Dialog.svelte";
  import RouterTable from "$lib/components/RouterTable.svelte";

  export let router: Router | null;
  export let dialog: HTMLDialogElement;

  function handleClickDeleteButton() {
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
    <label>
      Position:
      <input type="number" disabled={$locked} bind:value={router.node.x} />
      <input type="number" disabled={$locked} bind:value={router.node.y} />
    </label>
    {#if router instanceof CE}
      <p>Address: {router.address}</p>
    {/if}
    <RouterTable bind:router />
    <button on:click={handleClickDeleteButton}>Delete Router</button>
  {:else}
    <p>You somehow double-clicked on a router that can't be found?</p>
  {/if}
</Dialog>
