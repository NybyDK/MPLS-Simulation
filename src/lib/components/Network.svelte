<script lang="ts">
  import { onMount } from "svelte";
  import network from "$lib/stores/network";
  import config from "$lib/stores/config";
  import ViewBox from "$lib/components/ViewBox.svelte";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import Packet from "$lib/components/Packet.svelte";
  import Link from "$lib/components/Link.svelte";
  import Router from "$lib/components/Router.svelte";
  import Toolbox from "$lib/components/Toolbox.svelte";
  import HelpButton from "$lib/components/HelpButton.svelte";
  import ViewBoxControls from "$lib/components/ViewBoxControls.svelte";

  let zoom: (zoomFactor: number, mouse: { x: number; y: number }) => void;

  onMount(() => {
    window.addEventListener("visibilitychanged", () => {
      $config.running = !document.hidden;
    });
  });
</script>

<div id="mpls">
  <div id="network">
    <ViewBox bind:zoom>
      {#each $network.links as link (link.id)}
        <Link {link} />
      {/each}
      {#each $network.routers as router (router.id)}
        <Router {router} />
      {/each}
      {#each $network.packets as packet (packet.id)}
        <Packet {packet} />
      {/each}
    </ViewBox>
    <div id="top-left-bar" class="absolute-flex">
      <Toolbox />
    </div>
    <div id="bottom-left-bar" class="absolute-flex">
      <HelpButton />
    </div>
    <div id="bottom-right-bar" class="absolute-flex">
      <ViewBoxControls bind:zoom />
    </div>
  </div>
  <ControlPanel />
</div>

<style>
  #mpls {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  #network {
    position: relative;
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  #top-left-bar {
    top: 0;
    left: 0;
  }

  #bottom-left-bar {
    bottom: 0;
    left: 0;
  }

  #bottom-right-bar {
    bottom: 0;
    right: 0;
  }

  .absolute-flex {
    position: absolute;
    display: flex;
    margin: 10px;
  }
</style>
