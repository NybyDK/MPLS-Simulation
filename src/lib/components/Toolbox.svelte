<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";

  export let resetToHome: () => void;

  const ToolboxRouters = [
    { text: "+ CE", type: "CE", color: "lightgreen" },
    { text: "+ LER", type: "LER", color: "cyan" },
    { text: "+ LSR", type: "LSR", color: "hotpink" },
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
    {
      text: "Home",
      callback: resetToHome,
    },
  ];
</script>

{#each ToolboxRouters as router}
  <ToolboxRouter {...router} />
{/each}
{#each ToolboxButtons as button}
  <ToolboxButton {...button} />
{/each}
