<script lang="ts">
  import Dialog from "$lib/components/Dialog.svelte";

  let dialog: HTMLDialogElement;
</script>

<div>
  <button
    on:click={() => {
      dialog.showModal();
    }}>Help</button
  >
</div>

<Dialog bind:dialog>
  <p>Drag and drop routers that you want to add.</p>
  <p>Hold the shift key and drag routers to make connections between the routers.</p>
  <p>Double press a router to configure/delete it.</p>
  <p>The clear button will delete everything.</p>
  <p>
    The Dagre, Grid, and Breadthfirst buttons will attempt to calculate appropriate x and y
    coordinates for routers.
  </p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>

<style>
  button {
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    user-select: none;
    font-size: 16px;
  }
</style>
