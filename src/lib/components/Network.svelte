<script lang="ts">
  import { network } from "$lib/stores/network";
  import ViewBox from "$lib/components/ViewBox.svelte";
  import Packet from "$lib/components/Packet.svelte";
  import Link from "$lib/components/Link.svelte";
  import Router from "$lib/components/Router.svelte";
  import Toolbox from "$lib/components/Toolbox.svelte";
  import HelpButton from "$lib/components/HelpButton.svelte";
  import ViewBoxControls from "$lib/components/ViewBoxControls.svelte";

  let zooming: (zoomFactor: number) => void;
</script>

<div id="network">
  <ViewBox>
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
    <ViewBoxControls bind:zooming />
  </div>
</div>

<style>
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

  .absolute-flex {
    position: absolute;
    display: flex;
    margin: 10px;
  }
</style>
