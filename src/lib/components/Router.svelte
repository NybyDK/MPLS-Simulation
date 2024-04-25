<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";
  import RouterSymbol from "$lib/components/RouterSymbol.svelte";

  export let router: Router;
</script>

<svg
  id={router.id.toString()}
  x={router.node.x - 20}
  y={router.node.y - 20}
  width="45"
  height="45"
  href={`/${router.type}Router.svg`}
/>
<RouterSymbol routerID={router.id} />
<text x={router.node.x + 2} y={router.node.y + 10} dominant-baseline="central" font-size="smaller">
  {router.node.label}
</text>

<style>
  text {
    user-select: none;
    pointer-events: none;
    text-anchor: middle;
  }

  svg {
    cursor: pointer;
  }
</style>
