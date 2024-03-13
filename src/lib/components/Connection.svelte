<script lang="ts">
  import type { Connection } from "$lib/interfaces/network";

  export let connection: Connection;

  const width = 50;
  const height = 20;

  function middleOf(a: number, b: number) {
    return (a + b) / 2;
  }

  $: x1 = connection.source.node.x;
  $: x2 = connection.target.node.x;
  $: y1 = connection.source.node.y;
  $: y2 = connection.target.node.y;
  $: middleOfX = middleOf(x1, x2);
  $: middleOfY = middleOf(y1, y2);
</script>

<line {x1} {y1} {x2} {y2} stroke="black" />
<rect
  id={connection.id}
  x={middleOfX - width / 2}
  y={middleOfY - height / 2}
  {width}
  {height}
  fill="#222222"
  stroke="white"
/>
<text
  x={middleOfX}
  y={middleOfY}
  text-anchor="middle"
  dominant-baseline="middle"
  fill="white"
  font-size="12px"
>
  {connection.distance} km
</text>

<style>
  text {
    pointer-events: none;
  }
</style>
