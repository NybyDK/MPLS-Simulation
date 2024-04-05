<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import ToolboxRouter from "$lib/components/ToolboxRouter.svelte";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import CE from "$lib/classes/MPLS/CE";
  import LER from "$lib/classes/MPLS/LER";
  import LSR from "$lib/classes/MPLS/LSR";

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
                LIB: Object.fromEntries(router.LIB.map),
              };
            }

            if (router instanceof LSR) {
              return {
                ...router,
                type: router.type,
                LIB: Object.fromEntries(router.LIB.map),
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
