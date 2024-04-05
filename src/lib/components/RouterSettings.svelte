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
  import SmallButton from "$lib/components/RouterTables/SmallButton.svelte";

  export let router: Router | null;
  export let dialog: HTMLDialogElement;

  function handleDelete() {
    if (!$locked && router) {
      if (confirm("Are you sure you want to delete this router?")) {
        network.deleteRouter(router.id);
        dialog.close();
      }
    } else {
      alert("You can't delete a router while the network is locked.");
    }
  }
</script>

<Dialog
  bind:dialog
  on:close={() => {
    // TODO: Temporary fix to not crash app (ISSUE #125) - remove when fixed - it's because LSPList.svelte using getSureCERouter
    if (router instanceof CE) {
      for (const key of router.firstHop.keys()) {
        if (key === "") router.firstHop.delete(key);
      }
    }
    network.notify();
  }}
>
  {#if router}
    <div
      on:input={() => {
        network.notify();
      }}
    >
      <div>
        <label>
          Label:
          <input type="text" bind:value={router.node.label} />
        </label>
      </div>
      <label>
        Position:
        <input type="number" disabled={$locked} bind:value={router.node.x} />
        <input type="number" disabled={$locked} bind:value={router.node.y} />
      </label>
      <p>ID: {router.id}</p>
    </div>
    {#if router instanceof CE}
      <p style:display={"inline"}>Address:</p>
      <button
        on:click={async () => {
          if (router instanceof CE) await navigator.clipboard.writeText(router.address);
        }}>{router.address}</button
      >
      <div class="margin-top">
        <Destination bind:router />
      </div>
    {/if}
    {#if router instanceof LER}
      <div class="margin-top">
        <FIB bind:router />
      </div>
    {/if}
    {#if router instanceof LER || router instanceof LSR}
      <div class="margin-top">
        <LIB bind:router />
      </div>
    {/if}
    <div class="margin-top">
      <SmallButton text="Delete Router" callback={handleDelete} />
    </div>
  {:else}
    <p>You somehow double-clicked on a router that can't be found?</p>
  {/if}
</Dialog>

<style>
  input {
    width: 75px;
  }

  button {
    padding: 0 10px;
  }

  :global(table) {
    border-collapse: collapse;
    table-layout: fixed;
    width: 500px;
  }

  :global(th),
  :global(td) {
    outline: 1px solid black;
  }

  :global(td) {
    background-color: #cccccc;
  }

  :global(th:last-child) {
    width: 30px;
  }

  @media (prefers-color-scheme: dark) {
    :global(th),
    :global(td) {
      outline: 1px solid white;
    }

    :global(td) {
      background-color: #333333;
    }
  }

  :global(table input::-webkit-inner-spin-button) {
    appearance: none;
  }

  :global(table input) {
    width: 100%;
    text-align: center;
    outline: none;
    border: none;
    background: none;
  }

  .margin-top {
    margin-top: 10px;
  }
</style>
