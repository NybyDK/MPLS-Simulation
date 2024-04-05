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
    font-family: "Roboto", sans-serif;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  :global(body) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }

  :global(button:not(:disabled)) {
    cursor: pointer;
  }

  :global(line:not(.preview)) {
    stroke: black;
  }

  @media (prefers-color-scheme: dark) {
    :global(body) {
      color-scheme: dark;
      background-color: #222222;
    }

    :global(p) {
      color: white;
    }

    :global(line:not(.preview)) {
      stroke: white;
    }
  }
</style>
