<script lang="ts">
  import network from "$lib/stores/network";
  import locked from "$lib/stores/locked";
  import editorState from "$lib/stores/editorState";
  import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import CE from "$lib/classes/MPLS/CE";
  import LER from "$lib/classes/MPLS/LER";
  import LSR from "$lib/classes/MPLS/LSR";

  const ToolboxRouters: {
    text: string;
    type: "CE" | "LER" | "LSR";
    color: string;
  }[] = [
    { text: "+ Customer", type: "CE", color: "#7FC8F8" },
    { text: "+ Edge", type: "LER", color: "#FFE45E" },
    { text: "+ Switch", type: "LSR", color: "#FF6392" },
  ];

  $: ToolboxEditButtons = [
    {
      text: "Clear Network",
      callback: () => {
        if (confirm("Are you sure you want to clear the network?")) network.clear();
      },
    },
    {
      text: "Clear Links",
      callback: () => {
        if (confirm("Are you sure you want to clear the links?")) network.clearLinks();
      },
    },
    ...ToolboxSimulationButtons,
  ];

  $: ToolboxSimulationButtons = [
    {
      text: "Clear Tables",
      callback: () => {
        if (confirm("Are you sure you want to clear the routing tables?")) network.clearTables();
      },
    },
    {
      text: "Export",
      callback: () => {
        const data = {
          routers: $network.routers.map((router) => {
            if (router instanceof CE) {
              return {
                ...router,
                type: router.type,
                firstHop: Object.fromEntries(router.firstHop),
              };
            }

            if (router instanceof LER) {
              return {
                ...router,
                type: router.type,
                FIB: Object.fromEntries(router.FIB.map),
                LFIB: Object.fromEntries(router.LFIB.map),
              };
            }

            if (router instanceof LSR) {
              return {
                ...router,
                type: router.type,
                LFIB: Object.fromEntries(router.LFIB.map),
              };
            }
          }),
          links: $network.links.map((link) => ({
            ...link,
            source: link.source.id,
            target: link.target.id,
          })),
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);

        const hiddenA = document.createElement("a");
        hiddenA.href = url;
        hiddenA.download = "network.json";
        hiddenA.click();

        window.URL.revokeObjectURL(url);
      },
    },
  ];
</script>

<ToolboxButton
  text={$locked ? "Edit" : "Simulation"}
  callback={() => {
    $locked = !$locked;
    $editorState.placing = null;
    network.clearPackets();
  }}
  style={`width: 100px; background-color: ${$locked ? "#3CB371" : "#6495ED"};`}
/>
{#if !$locked}
  {#each ToolboxRouters as router}
    <ToolboxRouter {...router} />
  {/each}
  {#each ToolboxEditButtons as button}
    <ToolboxButton {...button} />
  {/each}
{:else}
  {#each ToolboxSimulationButtons as button}
    <ToolboxButton {...button} />
  {/each}
{/if}
