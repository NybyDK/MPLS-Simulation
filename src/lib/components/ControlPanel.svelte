<script lang="ts">
  import { network } from "$lib/stores/network";
  import { locked } from "$lib/stores/locked";
  import { config } from "$lib/stores/config";
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import LSPList from "$lib/components/LSPList.svelte";
  import CE from "$lib/classes/MPLS/CE";

  $: CERouters = $network.routers.filter((router): router is CE => router instanceof CE);

  $: buttons = [
    {
      text: $config.running ? "Pause" : "Resume",
      callback: () => {
        $config.running = !$config.running;
      },
    },
    {
      text: "Reset",
      callback: () => {
        network.clearPackets();
      },
    },
    {
      text: "Play All",
      callback: () => {
        for (const source of CERouters) {
          for (const [destination] of source.firstHop) {
            network.addPacket(source, network.getSureCERouter(destination));
          }
        }
      },
    },
  ];

  let resizeBar: HTMLElement;
  let transition = "width 250ms";

  $: panelWidth = $locked ? 300 : 0;

  function handleResizePointerDown(event: PointerEvent) {
    if (!$locked) return;

    transition = "none";

    resizeBar.setPointerCapture(event.pointerId);

    resizeBar.addEventListener("pointermove", handlePointerMove);
    resizeBar.addEventListener("pointerup", handlePointerUp);
  }

  function handlePointerMove(event: PointerEvent) {
    panelWidth = window.innerWidth - event.clientX;

    if (panelWidth <= 20) {
      panelWidth = 0;
    }

    if (panelWidth >= window.innerWidth - 20) {
      panelWidth = window.innerWidth - 20;
    }
  }

  function handlePointerUp(event: PointerEvent) {
    resizeBar.removeEventListener("pointermove", handlePointerMove);
    resizeBar.removeEventListener("pointerup", handlePointerUp);

    resizeBar.releasePointerCapture(event.pointerId);

    transition = "width 250ms";
  }
</script>

<div id="visual-resize-bar" style={`width: ${$locked ? 1 : 0}px`}>
  <div bind:this={resizeBar} on:pointerdown={handleResizePointerDown} id="resize-bar"></div>
</div>
<div id="control-panel" style={`width: ${panelWidth}px; transition: ${transition};`}>
  <div id="control-panel-content">
    <div id="control-panel-buttons">
      {#each buttons as button}
        <ToolboxButton {...button} style={`padding: 10px 20px`} />
      {/each}
    </div>
    <div id="slider">
      <p>Speed Multiplier: {$config.speedMultiplier}</p>
      <input type="range" min="0.1" max="2" step="0.1" bind:value={$config.speedMultiplier} />
    </div>
    <LSPList />
  </div>
</div>

<style>
  #resize-bar {
    position: relative;
    left: -4.5px;
    width: 10px;
    height: 100%;
    cursor: ew-resize;
  }

  #visual-resize-bar {
    background-color: black;
  }

  #control-panel {
    display: flex;
    flex-direction: column;
    background-color: #999999;
  }

  #control-panel-content {
    min-width: 300px;
  }

  #control-panel-buttons {
    min-width: fit-content;
    padding-top: 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
  }

  #slider {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
  }

  @media (prefers-color-scheme: dark) {
    #control-panel {
      background-color: #333333;
    }

    #visual-resize-bar {
      background-color: white;
    }
  }
</style>