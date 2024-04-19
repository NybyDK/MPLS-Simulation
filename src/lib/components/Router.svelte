<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";

  export let router: Router;
</script>


<svg>
  <image
    id={router.id.toString()}
    x={router.node.x - 20}
    y={router.node.y - 20}
    width="40"
    height="40"
    xlink:href={`/images/${router.type}Router.svg`}
  />
  <text x={router.node.x} y={router.node.y} dominant-baseline="central" font-size="smaller">
    {router.node.label}
  </text>
</svg>
<text x={router.node.x} y={router.node.y} dominant-baseline="central" font-size="smaller">
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
