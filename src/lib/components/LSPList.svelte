<script lang="ts">
  import network from "$lib/stores/network";
  import CE from "$lib/classes/MPLS/CE";
  import LSPElement from "$lib/components/LSPElement.svelte";

  $: CERouters = $network.routers.filter((router): router is CE => router instanceof CE);
</script>

<div>
  {#each CERouters as source}
    {#each [...source.firstHop] as [destination]}
      <LSPElement {source} destination={network.getCERouter(destination)} />
    {/each}
  {/each}
</div>

<style>
  div {
    overflow-y: auto;
    margin-bottom: 10px;
  }
</style>
