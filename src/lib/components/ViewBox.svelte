<script lang="ts">
  import { onMount } from "svelte";
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import type Link from "$lib/classes/MPLS/Link";
  import type Router from "$lib/classes/MPLS/Router";
  import RouterSettings from "$lib/components/RouterSettings.svelte";
  import LinkSettings from "$lib/components/LinkSettings.svelte";

  enum InteractionState {
    NONE,
    DRAGGING,
    PANNING,
    CONNECTING,
  }

  const viewBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    get scale() {
      if (!SVG) return 1;
      return this.width / SVG.getBoundingClientRect().width;
    },
  };

  const mouse = {
    x: 0,
    y: 0,
  };

  const initialMouse = {
    x: 0,
    y: 0,
  };

  const cursorStyles = {
    [InteractionState.NONE]: "move",
    [InteractionState.DRAGGING]: "grabbing",
    [InteractionState.PANNING]: "grabbing",
    [InteractionState.CONNECTING]: "crosshair",
  };

  let SVG: SVGElement | null = null;
  let selectedRouter: Router | null = null;
  let selectedLink: Link | null = null;
  let interactionState: InteractionState = InteractionState.NONE;
  let routerSettingsDialog: HTMLDialogElement;
  let linkSettingsDialog: HTMLDialogElement;
  let loaded = false;

  onMount(() => {
    if (!SVG) return;

    const resizeObserver = new ResizeObserver(updateViewBox);
    resizeObserver.observe(SVG);

    requestAnimationFrame(() => {
      if (!SVG) return;
      viewBox.x = SVG.getBoundingClientRect().width / -2;
      viewBox.y = SVG.getBoundingClientRect().height / -2;
    });

    loaded = true;
  });

  function updateViewBox() {
    if (!SVG) return;

    const zoomFactor = viewBox.scale || 1;

    viewBox.width = SVG.getBoundingClientRect().width * zoomFactor;
    viewBox.height = SVG.getBoundingClientRect().height * zoomFactor;
  }

  function handlePointerDown(event: PointerEvent) {
    if (!(event.target instanceof Element)) return;

    event.preventDefault();

    SVG?.addEventListener("pointermove", handlePointerMove);
    SVG?.setPointerCapture(event.pointerId);

    const targetId = event.target.id;

    if (targetId) {
      selectedRouter = network.getRouter(parseInt(targetId)) || null;

      if (!selectedRouter) return;

      if (event.shiftKey) {
        interactionState = InteractionState.CONNECTING;
      } else {
        initialMouse.x = selectedRouter.node.x;
        initialMouse.y = selectedRouter.node.y;
        interactionState = InteractionState.DRAGGING;
      }
    } else {
      interactionState = InteractionState.PANNING;
    }

    mouse.x = event.clientX;
    mouse.y = event.clientY;
  }

  function handlePointerUp(event: PointerEvent) {
    if (!(event.target instanceof Element)) return;

    event.preventDefault();

    if (!$locked && interactionState === InteractionState.CONNECTING && selectedRouter) {
      const element = document.elementFromPoint(event.clientX, event.clientY);

      const targetId = element?.tagName === "circle" ? element.id : null;
      const target = network.getRouter(parseInt(targetId ?? ""));

      if (target) {
        network.addLink({ source: selectedRouter, target });
      }
    }

    interactionState = InteractionState.NONE;
    selectedRouter = null;

    SVG?.releasePointerCapture(event.pointerId);
    SVG?.removeEventListener("pointermove", handlePointerMove);
  }

  function handlePointerMove(event: MouseEvent) {
    event.preventDefault();

    const delta = {
      x: (event.clientX - mouse.x) * viewBox.scale,
      y: (event.clientY - mouse.y) * viewBox.scale,
    };

    if (!$locked && interactionState === InteractionState.DRAGGING && selectedRouter) {
      selectedRouter.node.x = initialMouse.x + delta.x;
      selectedRouter.node.y = initialMouse.y + delta.y;

      network.fastUpdate();
    } else if (interactionState === InteractionState.PANNING) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      viewBox.x -= delta.x;
      viewBox.y -= delta.y;
    } else if (!$locked && interactionState === InteractionState.CONNECTING) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    mouse.x = event.clientX;
    mouse.y = event.clientY;

    const zoomFactor = event.deltaY > 0 ? 1.025 : 0.975;

    zoom(zoomFactor, mouse);
  }

  export function zoom(zoomFactor: number, mouse: { x: number; y: number }) {
    if (!SVG) return;
    if (viewBox.scale < 0.1 && zoomFactor < 1) return;
    if (viewBox.scale > 5 && zoomFactor > 1) return;

    const boundingRect = SVG.getBoundingClientRect();

    const offset = {
      x: (mouse.x - boundingRect.left) / boundingRect.width,
      y: (mouse.y - boundingRect.top) / boundingRect.height,
    };

    viewBox.x -= viewBox.width * (zoomFactor - 1) * offset.x;
    viewBox.y -= viewBox.height * (zoomFactor - 1) * offset.y;

    viewBox.width *= zoomFactor;
    viewBox.height *= zoomFactor;
  }

  function handleDoubleClick(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;

    event.preventDefault();

    const element = document.elementFromPoint(event.clientX, event.clientY);

    if (!element) return;

    if (element.tagName === "circle") {
      openRouterSettings(element.id);
    } else if (element.tagName === "rect") {
      openLinkSettings(element.id);
    }
  }

  function openRouterSettings(id: string) {
    const target = network.getRouter(parseInt(id));

    if (!target) return;

    selectedRouter = target;

    routerSettingsDialog.showModal();
  }

  function openLinkSettings(id: string) {
    const target = network.links.find((link) => id === link.id);

    if (!target) return;

    selectedLink = target;

    linkSettingsDialog.showModal();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();

    const data = event.dataTransfer?.getData("text/plain");

    switch (data) {
      case "CE":
        network.createCE({
          label: "CE",
          x: scaledX(event.clientX),
          y: scaledY(event.clientY),
        });
        break;
      case "LER":
        network.createLER({
          label: "LER",
          x: scaledX(event.clientX),
          y: scaledY(event.clientY),
        });
        break;
      case "LSR":
        network.createLSR({
          label: "LSR",
          x: scaledX(event.clientX),
          y: scaledY(event.clientY),
        });
        break;
    }
  }

  function scaledX(x: number) {
    return SVG ? (x - SVG.getBoundingClientRect().left) * viewBox.scale + viewBox.x : x;
  }

  function scaledY(y: number) {
    return SVG ? (y - SVG.getBoundingClientRect().top) * viewBox.scale + viewBox.y : y;
  }
</script>

{#if !loaded}
  <p style="font-size: 200px;">Loading...</p>
{/if}
<svg
  bind:this={SVG}
  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
  on:pointerdown={handlePointerDown}
  on:pointerup={handlePointerUp}
  on:wheel={handleWheel}
  on:dblclick={handleDoubleClick}
  on:dragover|preventDefault
  on:drop={handleDrop}
  role="button"
  tabindex="-1"
  style="cursor: {$locked ? 'default' : cursorStyles[interactionState]};"
>
  {#if !$locked && interactionState === InteractionState.CONNECTING && selectedRouter}
    <line
      x1={selectedRouter.node.x}
      y1={selectedRouter.node.y}
      x2={scaledX(mouse.x)}
      y2={scaledY(mouse.y)}
      stroke="black"
    />
  {/if}
  <slot />
</svg>

<RouterSettings bind:router={selectedRouter} bind:dialog={routerSettingsDialog} />
<LinkSettings bind:link={selectedLink} bind:dialog={linkSettingsDialog} />

<style>
  svg {
    width: 100%;
    height: 100%;
  }
</style>
