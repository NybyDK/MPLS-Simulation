<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";

  const ToolboxRouters = [
    { text: "+ Customer", type: "CE", color: "lightgreen" },
    { text: "+ Edge", type: "LER", color: "cyan" },
    { text: "+ Switch", type: "LSR", color: "hotpink" },
  ];

  $: ToolboxButtons = [
    {
      text: $locked ? "Unlock" : "Lock",
      callback: () => {
        $locked = !$locked;
      },
    },
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

{#each ToolboxRouters as router}
  <ToolboxRouter {...router} />
{/each}
{#each ToolboxButtons as button}
  <ToolboxButton {...button} />
{/each}
