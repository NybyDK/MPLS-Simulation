<script lang="ts">
  import { network } from "$lib/stores/network";
  import ViewBox from "$lib/components/ViewBox.svelte";
  import Connection from "$lib/components/Connection.svelte";
  import Router from "$lib/components/Router.svelte";
  import Toolbox from "$lib/components/Toolbox.svelte";
  import HelpButton from "$lib/components/HelpButton.svelte";

  let resetToHome: () => void;
</script>

<div id="network">
  <ViewBox bind:resetToHome>
    {#each $network.connections as connection}
      <Connection {connection} />
    {/each}
    {#each $network.routers as router}
      <Router {router} />
    {/each}
  </ViewBox>
  <div id="top-left-bar" class="absolute-flex">
    <Toolbox bind:resetToHome />
  </div>
  <div id="bottom-left-bar" class="absolute-flex">
    <HelpButton />
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
