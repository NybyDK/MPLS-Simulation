<script lang="ts">
  import network from "$lib/stores/network";
  import type CE from "$lib/classes/MPLS/CE";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";

  export let source: CE;
  export let destination: CE;

  function createPacket() {
    network.addPacket(source, destination);
  }

  function deleteDestination() {
    if (!confirm("Are you sure you want to delete this LSP?")) return;
    source.deleteEntry(destination.address);
    network.notify();
  }
</script>

<div>
  <p>{source.address}</p>
  <p>→</p>
  <p>{destination.address}</p>
  <ToolboxButton text={"Play"} callback={createPacket} />
  <ToolboxButton text={"Delete"} callback={deleteDestination} />
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div > * {
    margin: 0 10px;
  }
</style>
