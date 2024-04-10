<script lang="ts">
  import config from "$lib/stores/config";
  import type Packet from "$lib/classes/MPLS/Packet";

  export let packet: Packet;

  let transitionDuration: number;
  let animation: Animation | undefined;
  let packetElement: SVGElement | undefined;

  $: if (animation) $config.running ? animation.play() : animation.pause();
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

    animation = packetElement.animate(
      [
        {
          transform: `translate(${packet.node.x}px, ${packet.node.y}px)`,
        },
        {
          transform: `translate(${packet.nextHop.node.x}px, ${packet.nextHop.node.y}px)`,
        },
      ],
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
    if (currentRouter === packet.destination) return currentRouter.receivePacket(packet);
    packet.nextHop.receivePacket(packet);
    if (packet.validateNextHop(currentRouter)) return animateToNextHop();

    if (packet.fallbackRoute) return;

    packet.fallback(currentRouter);
    if (packet.validateNextHop(currentRouter)) animateToNextHop();
  }

  requestAnimationFrame(animateToNextHop);
</script>

<circle class:labeled={packet.label !== -1} bind:this={packetElement} r="5" />

<style>
  circle {
    fill: #da443f; /*weird red*/
  }

  .labeled {
    fill: #6495ed; /*light blue*/
  }
</style>
