<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";

  export let router: Router;

  const colorMap = {
    CE: "lightgreen",
    LER: "cyan",
    LSR: "hotpink",
  };
</script>

<circle
  id={router.id.toString()}
  cx={router.node.x}
  cy={router.node.y}
  r="20"
  fill={colorMap[router.type]}
/>
<text x={router.node.x} y={router.node.y} text-anchor="middle" alignment-baseline="middle"
  >{router.node.label}</text
>

<style>
  text {
    user-select: none;
    pointer-events: none;
  }

  circle {
    cursor: pointer;
  }
</style>
