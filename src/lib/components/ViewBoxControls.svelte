<script lang="ts">
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  export let zooming: (zoomFactor: number) => void;
</script>

<div class="zoomButtons">
  <ToolboxButton
    text=" - "
    callback={() => {
      zooming(1.1);
    }}
  />
  <ToolboxButton
    text="Fullscreen"
    callback={async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    }}
  />
  <ToolboxButton
    text=" + "
    callback={() => {
      zooming(0.9);
    }}
  />
</div>

<style>
  .zoomButtons {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
</style>
