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
  <p>
    Instead of drag and drop, you can also click and hold shift while continuously clicking to add
    many routers.
  </p>
  <p>Hold the shift key and drag routers to make links.</p>
  <p>Hold the ctrl key and drag CE's to add destinations.</p>
  <p>Double click a router or link to configure it.</p>
  <p>The clear button will delete the entire network.</p>
  <p>The export button will download your network as a .json file</p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>
