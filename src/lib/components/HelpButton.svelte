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
  <p>Drag and drop routers that to add them to the network.</p>
  <p>Hold the shift key and drag routers to make links.</p>
  <p>Double click a router to configure it.</p>
  <p>The clear button will delete the entire network.</p>
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

  @media (prefers-color-scheme: dark) {
    button {
      border: 2px solid white;
    }
  }
</style>
