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
  <p>Drag and drop routers to add them to the network.</p>
  <p>Hold the shift key and drag routers to make a singular link.</p>
  <p>Hold the alt key and drag routers to make continous links.</p>
  <p>Hold the ctrl key and drag CE's to add destinations.</p>
  <p>Double click a router to configure it.</p>
  <p>The clear button will delete the entire network.</p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>
