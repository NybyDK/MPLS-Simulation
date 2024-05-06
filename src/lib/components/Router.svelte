<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";

  export let router: Router;
</script>

<image
  id={router.id.toString()}
  x={router.node.x - 45 / 2}
  y={router.node.y - 45 / 2}
  width="45"
  height="45"
  href={`/Router/${router.type}.svg`}
/>
<text x={router.node.x} y={router.node.y + 10} dominant-baseline="central" font-size="smaller">
  {router.node.label}
</text>

<style>
  text {
    user-select: none;
    pointer-events: none;
    text-anchor: middle;
  }

  image {
    cursor: pointer;
  }
</style>
