<script lang="ts">
  import { config } from "$lib/stores/config";
  import type Packet from "$lib/classes/MPLS/Packet";

  export let packet: Packet;

  let transitionDuration: number;

  function calculateTransitionDuration() {
    // TOOD: In the future, nextHop will be a link, not a router, and then we can use the link's distance here, as it is already calculated in the Link class
    const distance = Math.sqrt(
      (packet.node.x - packet.nextHop.node.x) ** 2 + (packet.node.y - packet.nextHop.node.y) ** 2,
    );

    // 1000 ms for every 250 km, TODO: make this configurable
    transitionDuration = ((distance / 250) * 1000) / $config.speedMultiplier;
  }

  function updatePosition() {
    calculateTransitionDuration();

    packet.node.x = packet.nextHop.node.x;
    packet.node.y = packet.nextHop.node.y;
  }

  function handleTransitionEnd() {
    packet.nextHop.receivePacket(packet);

    updatePosition();
  }

  requestAnimationFrame(updatePosition);
</script>

<circle
  on:transitionend={handleTransitionEnd}
  r="5"
  transform={`translate(${packet.node.x}, ${packet.node.y})`}
  style={`transition: transform ${transitionDuration}ms linear;`}
/>

<style>
  circle {
    fill: red;
  }
</style>
