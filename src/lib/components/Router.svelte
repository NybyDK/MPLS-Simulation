<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";

  export let router: Router;

  const colorMap = {
    CE: "#7FC8F8",
    LER: "#FFE45E",
    LSR: "#FF6392",
  };
</script>

<circle
  id={router.id.toString()}
  cx={router.node.x}
  cy={router.node.y}
  r="20"
  fill={colorMap[router.type]}
/>
<text x={router.node.x} y={router.node.y} dominant-baseline="central">
  {router.node.label}
</text>

<style>
  text {
    user-select: none;
    pointer-events: none;
    text-anchor: middle;
  }

  circle {
    cursor: pointer;
  }
</style>
