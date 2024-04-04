<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";

  import type Router from "$lib/classes/MPLS/Router";
  import CE from "$lib/classes/MPLS/CE";
  import LER from "$lib/classes/MPLS/LER";
  import LSR from "$lib/classes/MPLS/LSR";

  import Dialog from "$lib/components/Dialog.svelte";
  import Destination from "$lib/components/RouterTables/Destination.svelte";
  import LIB from "$lib/components/RouterTables/LIB.svelte";
  import FIB from "$lib/components/RouterTables/FIB.svelte";

  export let router: Router | null;
  export let dialog: HTMLDialogElement;

  function handleDelete() {
    if (!$locked && router && confirm("Are you sure you want to delete this router?")) {
      network.deleteRouter(router.id);
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
      <Destination bind:router />
    {/if}
    {#if router instanceof LER}
      <LIB bind:router />
      <FIB bind:router />
    {/if}
    {#if router instanceof LSR}
      <LIB bind:router />
    {/if}
    <button on:click={handleDelete}>Delete Router</button>
  {:else}
    <p>You somehow double-clicked on a router that can't be found?</p>
  {/if}
</Dialog>

<style>
  :global(table) {
    border-collapse: collapse;
    min-width: 500px;
  }

  :global(th),
  :global(td) {
    border: 1px solid black;
  }

  @media (prefers-color-scheme: dark) {
    :global(th),
    :global(td) {
      border: 1px solid white;
    }
  }

  :global(table input) {
    width: 100%;
    text-align: center;
  }

  :global(button) {
    display: block;
  }
</style>
