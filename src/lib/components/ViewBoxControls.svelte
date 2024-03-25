<script lang="ts">
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  export let zoom: (zoomFactor: number, mouse: { x: number; y: number }) => void;
</script>

<ToolboxButton
  text=" - "
  callback={() => {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    zoom(1.1, mouse);
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
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    zoom(0.9, mouse);
  }}
/>
