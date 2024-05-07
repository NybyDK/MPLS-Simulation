<script lang="ts">
  import loadNetwork from "$lib/classes/Loader/NetworkLoader";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import SmallNetworkJson from "$lib/data/SmallNetwork.json";
  import LargeNetworkJson from "$lib/data/LargeNetwork.json";
  import { onMount } from "svelte";

  let dialog: HTMLDialogElement;

  $: startupButtons = [
    {
      text: "Blank",
      callback: () => {
        dialog.close();
      },
    },
    {
      text: "Small",
      callback: () => {
        loadNetwork(SmallNetworkJson);
        dialog.close();
      },
    },
    {
      text: "Large",
      callback: () => {
        loadNetwork(LargeNetworkJson);
        dialog.close();
      },
    },
    {
      text: "Import",
      callback: () => {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "file";
        hiddenInput.accept = ".json";

        hiddenInput.onchange = (event: InputEvent) => {
          if (!(event.target instanceof HTMLInputElement)) return;
          if (event.target.files.length === 0) return;

          const file = event.target.files[0];

          const reader = new FileReader();

          reader.addEventListener("load", (event) => {
            if (!event.target || typeof event.target.result !== "string") return;

            const success = loadNetwork(JSON.parse(event.target.result));
            if (success) dialog.close();
          });

          reader.readAsText(file);
        };

        hiddenInput.click();
      },
    },
  ];

  onMount(() => {
    dialog.inert = true;
    dialog.showModal();
    dialog.inert = false;
  });
</script>

<Dialog bind:dialog>
  <h1>Welcome</h1>
  <p>This tool is designed to mimic the basics of MPLS</p>
  <p>Choose a network:</p>
  <div class="buttons">
    {#each startupButtons as button}
      <ToolboxButton {...button} />
    {/each}
  </div>
</Dialog>

<style>
  h1,
  p {
    text-align: center;
  }

  p:first-of-type {
    margin-bottom: 10px;
  }

  div {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
</style>
