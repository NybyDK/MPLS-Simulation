<script lang="ts">
  export let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog} on:close>
  <slot />
</dialog>

<style>
  dialog {
    max-height: 500px;
    padding: 10px;
    margin: auto;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
