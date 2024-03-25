<script lang="ts">
  import { locked } from "$lib/stores/locked";
  import { config } from "$lib/stores/config";

  let resizeBar: HTMLElement;
  let transition = "width 250ms";

  $: panelWidth = $locked ? 500 : 0;

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
<div
  id="control-panel"
  style={`width: ${panelWidth}px; transition: ${transition}; overflow: hidden;`}
>
  <button>Play</button>
  <button>Pause</button>
  <button>Clear</button>
  <button>Lock</button>
  <button>Reset</button>

  <p>{$config.speedMultiplier}</p>
  <input type="range" min="0.1" max="2" step="0.1" bind:value={$config.speedMultiplier} />
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
    background-color: white;
  }

  #control-panel {
    background-color: #333333;
  }
</style>
