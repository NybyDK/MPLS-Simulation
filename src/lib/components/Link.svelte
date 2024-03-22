<script lang="ts">
  import type Link from "$lib/classes/MPLS/Link";

  export let link: Link;

  const width = 50;
  const height = 20;

  function middleOf(a: number, b: number) {
    return (a + b) / 2;
  }

  $: x1 = link.source.node.x;
  $: x2 = link.target.node.x;
  $: y1 = link.source.node.y;
  $: y2 = link.target.node.y;
  $: middle = {
    x: middleOf(x1, x2),
    y: middleOf(y1, y2),
  };
</script>

<line {x1} {y1} {x2} {y2} stroke="black" />
<rect
  id={link.id}
  x={middle.x - width / 2}
  y={middle.y - height / 2}
  {width}
  {height}
  stroke="white"
/>
<text x={middle.x} y={middle.y} text-anchor="middle" dominant-baseline="middle" font-size="12px">
  {link.distance} km
</text>

<style>
  text {
    pointer-events: none;
    fill: white;
  }

  rect {
    cursor: pointer;
    fill: #222222;
  }
</style>
