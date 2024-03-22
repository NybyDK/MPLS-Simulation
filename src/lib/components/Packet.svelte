<script lang="ts">
  import { onMount } from "svelte";
  import type Packet from "$lib/classes/MPLS/Packet";

  export let packet: Packet;

  function handleTransitionEnd() {
    packet.nextHop.receivePacket(packet);
    packet.node.x = packet.nextHop.node.x;
    packet.node.y = packet.nextHop.node.y;
  }

  onMount(() => {
    requestAnimationFrame(() => {
      packet.node.x = packet.nextHop.node.x;
      packet.node.y = packet.nextHop.node.y;
    });
  });
</script>

<circle
  on:transitionend={handleTransitionEnd}
  class="moving-circle"
  transform={`translate(${packet.node.x}, ${packet.node.y})`}
  r="5"
/>

<style>
  .moving-circle {
    fill: red;
    transition: transform 1000ms linear;
  }
</style>
