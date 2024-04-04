<script lang="ts">
  import { network } from "$lib/stores/network";
  import type CE from "$lib/classes/MPLS/CE";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";

  export let source: CE;
  export let destination: CE;

  function createPacket() {
    network.addPacket(source, destination);
  }
</script>

<div>
  <p>{source.address}</p>
  <p>→</p>
  <p>{destination.address}</p>
  <ToolboxButton text={"Play"} callback={createPacket} />
</div>

<style>
  div {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>
