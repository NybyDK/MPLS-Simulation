<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";

  export let router: Router;

  const colorMap = {
    CE: "#7FC8F8",
    LER: "#FFE45E",
    LSR: "#FF6392",
  };
</script>

<image
  xlink:href={static/[router.type]Router.svg}
  x={router.node.x - 20} 
  y={router.node.y - 20}
  width="40" 
  height="40" 
/>
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
