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
  <p>Drag and drop routers to add them to the network.</p><br>
  <p>
    Instead of drag and drop, you can also click and hold shift while continuously clicking to add
    many routers.
  </p><br>
  <p>
    Pressing 1, 2 or 3 will respectively select CE, LER or LSR, this works with the holding of shift to insert routers.
  </p><br>
  <p>Hold the shift key and drag routers to make links.</p> <br>
  <p>Hold the ctrl key and drag CE's to add destinations.</p> <br>
  <p>Double click a router or link to configure it.</p> <br> 
  <p>The clear button will delete the entire network.</p> <br>  
  <p>The export button will download your network as a .json file</p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>
