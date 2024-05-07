<script lang="ts">
  export let text: string;
  export let callback: () => void;
</script>

<button on:click={callback}>{text}</button>

<style>
  button {
    background-color: #cccccc;
    color: black;
    outline: 1px solid black;
    border: none;
    height: 21px;
    min-width: 30px;
    padding: 0 10px;
    user-select: none;
    transition: background-color 200ms ease;
  }

  button:hover {
    background-color: #666666;
  }

  @media (prefers-color-scheme: dark) {
    button {
      background-color: #222222;
      outline: 1px solid white;
      color: white;
    }
  }
</style>
