<script lang="ts">
  import config from "$lib/stores/config";
  import type Packet from "$lib/classes/MPLS/Packet";

  export let packet: Packet;

  let transitionDuration: number;
  let animation: Animation | undefined;
  let packetElement: SVGElement | undefined;
  let textX: number = 0;
  let textY: number = 0;

  $: {
    if (animation) {
      requestAnimationFrame(() => {
        if (packetElement) {
          const matrix = new DOMMatrixReadOnly(getComputedStyle(packetElement).transform);
          textX = matrix.m41;
          textY = matrix.m42;
        }
        if ($config.running) {
          animation?.play();
        } else {
          animation?.pause();
        }
      });
    }
  }
  $: if (animation) animation.playbackRate = $config.speedMultiplier;

  function calculateTransitionDuration() {
    const distance = Math.sqrt(
      (packet.node.x - packet.nextHop.node.x) ** 2 + (packet.node.y - packet.nextHop.node.y) ** 2,
    );

    // Base speed of 250 km in 1000 ms
    transitionDuration = Math.round((distance / 250) * 1000);
  }

  function animateToNextHop() {
    calculateTransitionDuration();

    if (!packetElement) return;

    const current = packet.node;
    const next = packet.nextHop.node;

    animation = packetElement.animate(
      {
        transform: [
          `translate(${current.x}px, ${current.y}px)`,
          `translate(${next.x}px, ${next.y}px)`,
        ],
      },
      {
        duration: transitionDuration,
        easing: "linear",
      },
    );

    animation.onfinish = handleAnimationFinish;
  }

  function handleAnimationFinish() {
    packet.node = packet.nextHop.node;

    const currentRouter = packet.nextHop;

    currentRouter.receivePacket(packet);

    // Return if packet arrived, or if fallback is required but disabled (currentRouter is the same as nextHop after receivePacket)
    if (currentRouter === packet.nextHop) return;

    if (!packet.validateNextHop(currentRouter)) return packet.drop("Invalid next hop");

    animateToNextHop();
  }

  if (packet.validateFirstHop()) {
    requestAnimationFrame(animateToNextHop);
  } else {
    packet.drop("Invalid first hop");
  }
</script>

<circle class:labeled={packet.label !== -1} bind:this={packetElement} r="5" />
{#if packetElement}
  <text x={textX - 50} y={textY - 15}>Label: {packet.label}</text>
{/if}

<style>
  circle {
    cursor: default;
    fill: #da443f; /*weird red*/
  }

  .labeled {
    fill: #6495ed; /*light blue*/
  }

  text {
    font-size: 24px;
    fill: white;
    stroke: black;
    display: none;
  }

  circle:hover + text {
    display: block;
  }
</style>
