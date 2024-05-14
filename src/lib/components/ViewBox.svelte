<script lang="ts">
  import { onMount } from "svelte";
  import network from "$lib/stores/network";
  import config from "$lib/stores/config";
  import editorState from "$lib/stores/editorState";
  import findShortestPath from "$lib/functions/findShortestPath";
  import locked from "$lib/stores/locked";
  import type Link from "$lib/classes/MPLS/Link";
  import type Router from "$lib/classes/MPLS/Router";
  import RouterSettings from "$lib/components/RouterSettings.svelte";
  import LinkSettings from "$lib/components/LinkSettings.svelte";
  import LDP from "$lib/classes/MPLS/LDP";
  import CE from "$lib/classes/MPLS/CE";

  enum InteractionState {
    NONE,
    DRAGGING,
    PANNING,
    CONNECTING,
    ADDING_DESTINATION,
    ADDING_ROUTERS,
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

  const previewRouterMouse = {
    x: 0,
    y: 0,
  };

  $: cursorStyles = {
    [InteractionState.NONE]: "move",
    [InteractionState.DRAGGING]: $locked ? "not-allowed" : "grabbing",
    [InteractionState.PANNING]: "grabbing",
    [InteractionState.CONNECTING]: $locked ? "not-allowed" : "crosshair",
    [InteractionState.ADDING_DESTINATION]: "crosshair",
    [InteractionState.ADDING_ROUTERS]: "none",
  };

  let SVG: SVGElement | null = null;
  let selectedRouter: Router | null = null;
  let selectedLink: Link | null = null;
  let interactionState: InteractionState = InteractionState.NONE;
  let routerSettingsDialog: HTMLDialogElement;
  let linkSettingsDialog: HTMLDialogElement;
  let loaded = false;

  editorState.subscribe((value) => {
    if (value.placing && ["CE", "LER", "LSR"].includes(value.placing)) {
      interactionState = InteractionState.ADDING_ROUTERS;
    } else {
      interactionState = InteractionState.NONE;
    }
  });

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

  function handleRouterPreviewMove(event: PointerEvent) {
    previewRouterMouse.x = event.clientX;
    previewRouterMouse.y = event.clientY;
  }

  function handleKeyDown(event: KeyboardEvent) {
    for (const dialog of document.querySelectorAll("dialog")) {
      if (dialog.hasAttribute("open")) return;
    }

    switch (event.code) {
      case "Escape":
        $editorState.placing = null;
        break;
      case "Tab":
        if (routerSettingsDialog.open || linkSettingsDialog.open) return;
        event.preventDefault();
        $locked = !$locked;
        $editorState.placing = null;
        network.clearPackets();
        break;
      case "Digit1":
        buttonPreviewRouter("CE");
        break;
      case "Digit2":
        buttonPreviewRouter("LER");
        break;
      case "Digit3":
        buttonPreviewRouter("LSR");
        break;
      case "Space":
        event.preventDefault();
        $config.running = !$config.running;
    }
  }

  function buttonPreviewRouter(type: "CE" | "LSR" | "LER") {
    if ($locked) return;
    $editorState.placing = type;
  }

  function handlePointerDown(event: PointerEvent) {
    if (!(event.target instanceof Element)) return;

    event.preventDefault();

    if (interactionState === InteractionState.ADDING_ROUTERS && !$locked) {
      switch ($editorState.placing) {
        case "CE":
          network.createCE(scaledX(event.clientX), scaledY(event.clientY));
          break;
        case "LER":
          network.createLER(scaledX(event.clientX), scaledY(event.clientY));
          break;
        case "LSR":
          network.createLSR(scaledX(event.clientX), scaledY(event.clientY));
          break;
      }

      if (!event.shiftKey) {
        $editorState.placing = null;
      }

      return;
    }

    SVG?.addEventListener("pointermove", handlePointerMove);
    SVG?.setPointerCapture(event.pointerId);

    const targetId = event.target.id;

    if (targetId) {
      selectedRouter = network.getRouter(parseInt(targetId)) || null;

      if (!selectedRouter) return;

      if (event.shiftKey) {
        interactionState = InteractionState.CONNECTING;
      } else if (event.altKey && selectedRouter instanceof CE) {
        interactionState = InteractionState.ADDING_DESTINATION;
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
    if (interactionState === InteractionState.ADDING_ROUTERS) return;

    event.preventDefault();

    earlyReturn: if (selectedRouter) {
      if (interactionState === InteractionState.ADDING_DESTINATION) {
        const element = document.elementFromPoint(event.clientX, event.clientY);

        const targetId = element?.tagName === "image" ? element.id : null;
        const target = network.getRouter(parseInt(targetId ?? ""));

        if (!target || selectedRouter === target) break earlyReturn;

        if (!(target instanceof CE)) {
          alert("Destination must be a CE");
          break earlyReturn;
        }

        const path = findShortestPath(selectedRouter, target);

        if (path.length <= 1) {
          alert("No path found");
          break earlyReturn;
        }

        LDP(path, target.address);

        network.notify();
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
      selectedRouter.node.x = Math.round(initialMouse.x + delta.x);
      selectedRouter.node.y = Math.round(initialMouse.y + delta.y);

      network.notify();
    } else if (interactionState === InteractionState.PANNING) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      viewBox.x -= delta.x;
      viewBox.y -= delta.y;
    } else if (interactionState === InteractionState.ADDING_DESTINATION) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    } else if (!$locked && interactionState === InteractionState.CONNECTING) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) return;

      const target = network.getRouter(parseInt(element.id));

      if (element.tagName === "image" && target && selectedRouter) {
        network.addLink({ source: selectedRouter, target });
        selectedRouter = target;
      }
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

    if (element.tagName === "image") {
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

    if (!data) return;

    switch (data) {
      case "CE":
        network.createCE(scaledX(event.clientX), scaledY(event.clientY));
        break;
      case "LER":
        network.createLER(scaledX(event.clientX), scaledY(event.clientY));
        break;
      case "LSR":
        network.createLSR(scaledX(event.clientX), scaledY(event.clientY));
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
  on:pointermove={handleRouterPreviewMove}
  on:pointerup={handlePointerUp}
  on:wheel={handleWheel}
  on:dblclick={handleDoubleClick}
  on:dragover|preventDefault
  on:drop={handleDrop}
  role="button"
  tabindex="-1"
  style:cursor={cursorStyles[interactionState]}
>
  {#if ((!$locked && interactionState === InteractionState.CONNECTING) || interactionState === InteractionState.ADDING_DESTINATION) && selectedRouter}
    <line
      class="preview"
      x1={selectedRouter.node.x}
      y1={selectedRouter.node.y}
      x2={scaledX(mouse.x)}
      y2={scaledY(mouse.y)}
      stroke={interactionState === InteractionState.CONNECTING ? "green" : "blue"}
    />
  {/if}
  <slot />
  {#if interactionState === InteractionState.ADDING_ROUTERS && $editorState.placing}
    <image
      x={scaledX(previewRouterMouse.x) - 45 / 2}
      y={scaledY(previewRouterMouse.y) - 45 / 2}
      width="45"
      height="45"
      href={`Router/${$editorState.placing}.svg`}
    />
    <text
      x={scaledX(previewRouterMouse.x)}
      y={scaledY(previewRouterMouse.y)}
      dominant-baseline="central"
      font-size="smaller"
    >
      {$editorState.placing}
    </text>
  {/if}
</svg>

<svelte:window on:keydown={handleKeyDown} />

<RouterSettings bind:router={selectedRouter} bind:dialog={routerSettingsDialog} />
<LinkSettings bind:link={selectedLink} bind:dialog={linkSettingsDialog} />

<style>
  svg {
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  text {
    text-anchor: middle;
  }
</style>
