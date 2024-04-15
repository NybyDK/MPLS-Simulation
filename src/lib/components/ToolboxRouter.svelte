<script lang="ts">
  import locked from "$lib/stores/locked";
  import editorState from "$lib/stores/editorState";

  export let text: string;
  export let type: "CE" | "LER" | "LSR";
  export let color: string;

  function handleDragStart(event: DragEvent) {
    if ($locked) {
      alert("Network is locked.");
      return;
    }

    event.dataTransfer?.setData("text/plain", type);
  }

  function handleClick() {
    $editorState.placing = type;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  draggable="true"
  on:dragstart={handleDragStart}
  on:click={handleClick}
  role="button"
  tabindex="-1"
  style="background-color: {color};"
>
  {text}
</div>

<style>
  div {
    color: black;
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    user-select: none;
    cursor: grab;
    transition: opacity 200ms;
  }

  div:focus {
    outline: none;
  }

  @media (prefers-color-scheme: dark) {
    div {
      border: 2px solid white;
    }
  }
</style>
