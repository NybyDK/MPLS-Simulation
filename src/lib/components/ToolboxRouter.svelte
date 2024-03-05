<script lang="ts">
  export let text: string;
  export let type: string;
  export let color: string;

  function handleDragStart(event: DragEvent) {
    event.dataTransfer?.setData("text/plain", type);
  }
</script>

<div
  draggable="true"
  on:dragstart={handleDragStart}
  role="button"
  tabindex="-1"
  style="background-color: {color};"
>
  {text}
</div>

<style>
  div {
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    user-select: none;
    cursor: grab;
  }
</style>
