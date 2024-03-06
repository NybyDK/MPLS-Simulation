<script lang="ts">
  export let text: string;
  export let callback: () => void = () => {};
</script>

<button on:click={callback}>
  {text}
</button>

<style>
  button {
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    font-size: 16px;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border: 2px solid white;
    }
  }
</style>
