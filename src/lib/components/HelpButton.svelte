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
  <br />
  <p>
    Instead of drag and drop, you can also click and hold shift while continuously clicking to add
    many routers.
  </p>
  <br />
  <p>
    Pressing 1, 2 or 3 will respectively select CE, LER or LSR, this works with the holding of shift
    to insert routers.
  </p>
  <br />
  <p>Pressing Space will pause/resume the packet animations.</p>
  <br />
  <p>Pressing Tab will open the packet control panel.</p>
  <br />
  <p>Hold Shift, then click and drag between routers to create links</p>
  <br />
  <p>Hold Ctrl, then click and drag between CE's to create destinations</p>
  <br />
  <p>Double click a router or link to configure it.</p>
  <br />
  <p>The clear button will delete the entire network.</p>
  <br />
  <p>The export button will download your network as a .json file</p>
  <br />
  <p>If you are experiencing packets going offroad, please lower the max packets count.</p>
  <br />
  <p>Press Esc to close this popup.</p>
</Dialog>
