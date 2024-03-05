<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,700;1,400;1,700&display=swap"
    rel="stylesheet"
  />
  <title>MPLS Simulation</title>
</svelte:head>

<slot />

<style>
  :global(*) {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  :global(body) {
    font-family: Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }

  :global(button:not(:disabled)) {
    cursor: pointer;
  }
</style>
