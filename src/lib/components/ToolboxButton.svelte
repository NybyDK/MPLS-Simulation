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
    display: block;
    background-color: #666666;
    color: black;
    border: 2px solid black;
    padding: 5px;
    margin: 2.5px;
    font-size: 16px;
    user-select: none;
    min-width: 35px;
    transition:
      background-color 200ms,
      transform 200ms;
  }

  button:hover {
    background-color: #888888;
  }

  button:focus {
    transform: scale(1.1);
    background-color: #6495ed;
  }

  @media (prefers-color-scheme: dark) {
    button {
      border: 2px solid white;
    }
  }
</style>
