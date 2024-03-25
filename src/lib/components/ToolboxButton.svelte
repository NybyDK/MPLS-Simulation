<script lang="ts">
  export let text: string;
  export let callback: () => void = () => {};
  export let style: string | undefined = undefined;
</script>

<button on:click={callback} {style}>
  {text}
</button>

<style>
  button {
    color: black;
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    font-size: 16px;
    user-select: none;
    transition: background-color 250ms ease;
    min-width: 35px;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border: 2px solid white;
    }
  }
</style>
