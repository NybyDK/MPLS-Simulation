<script lang="ts">
  import ToolboxButton from "$lib/components/ToolboxButton.svelte";
  import Dialog from "$lib/components/Dialog.svelte";

  let dialog: HTMLDialogElement;
</script>

<div>
  <ToolboxButton
    text="Credits"
    callback={() => {
      dialog.showModal();
    }}
  />
</div>

<Dialog bind:dialog>
  <p>Attribution: The following Icon has been used</p>
  <br />

  <p>https://commons.wikimedia.org/wiki/File:Router.svg#</p>
  <br />

  <p>Share Alike: We hereby grant permission to</p>
  <p>
    Copy, distribute and/or modify this document under the terms of the GNU Free Documentation
    License.
  </p>
  <p>Version 1.2 or any later version published by the Free Software Foundation;</p>
  <p>with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.</p>
  <p>A copy of the license is included in the section entitled GNU Free Documentation License.</p>
  <br />
  <p>
    The Icon used for CE routers is almost identical to the one on Wikimedia (aspect ratio changed)
  </p>
  <br />
  <p>
    The Icon used for LSR/LER routers is almost identical, except with different colors. (aspect
    ratio changed)
  </p>
  <br />
  <p>Press Esc to close this popup</p>
</Dialog>
