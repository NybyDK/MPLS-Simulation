<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";

  const ToolboxRouters = [
    { text: "+ Customer", type: "CE", color: "#7FC8F8" },
    { text: "+ Edge", type: "LER", color: "#FFE45E" },
    { text: "+ Switch", type: "LSR", color: "#FF6392" },
  ];

  $: ToolboxButtons = [
    {
      text: "Clear",
      callback: () => {
        if ($locked) {
          alert("Network is locked.");
          return;
        }
        if (confirm("Are you sure you want to clear the network?")) network.clear();
      },
    },
  ];
</script>

<ToolboxButton
  text={$locked ? "Edit" : "Simulation"}
  callback={() => {
    $locked = !$locked;
    network.clearPackets();
  }}
  style={`width: 100px; background-color: ${$locked ? "#3CB371" : "#6495ED"};`}
/>
{#if !$locked}
  {#each ToolboxRouters as router}
    <ToolboxRouter {...router} />
  {/each}
  {#each ToolboxButtons as button}
    <ToolboxButton {...button} />
  {/each}
{/if}
