<script lang="ts">
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import Dialog from "$lib/components/Dialog.svelte";

  let dialog: HTMLDialogElement;
</script>

<div>
  <ToolboxButton
    text="Help"
    callback={() => {
      dialog.showModal();
    }}
  />
</div>

<Dialog bind:dialog>
  <p>Drag and drop routers that to add them to the network.</p>
  <p>Hold the shift key and drag routers to make links.</p>
  <p>Double click a router to configure it.</p>
  <p>The clear button will delete the entire network.</p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>
