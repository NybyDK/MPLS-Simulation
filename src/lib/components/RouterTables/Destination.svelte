<script lang="ts">
  import network from "$lib/stores/network";
  import findShortestPath from "$lib/functions/findShortestPath";
  import type CE from "$lib/classes/MPLS/CE";
  import LDP from "$lib/classes/MPLS/LDP";
  import SmallButton from "$lib/components/RouterTables/SmallButton.svelte";

  export let router: CE;

  function addAndUpdate(addCallback: () => void) {
    return () => {
      addCallback();
      router = router;
    };
  }

  function handleOnChangeDestination(event: Event, destination: string) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const target = event.target.value.toUpperCase();

    const destinationRouter = network.getCERouter(target);

    if (router.address === target) {
      alert("Destination router cannot be the same as the source router.");
      return;
    }

    if (!destinationRouter) {
      alert("Destination router not found.");
      event.target.value = destination;
      return;
    }

    router.updateAddress(destination, target);

    router = router;
  }

  function handleLDPClick(target: string) {
    const destinationRouter = network.getCERouter(target);

    if (!destinationRouter) {
      alert("Destination router not found.");
      return;
    }

    const path = findShortestPath(router, destinationRouter);

    if (path.length <= 1) {
      alert("No path found");
      return;
    }

    LDP(path, target);

    router = router;
  }

  function handleOnChangeLink(event: Event, destination: string) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const target = parseInt(event.target.value);

    router.firstHop.set(destination, target);
  }
</script>

<p title="Maps IP addresses to IDs of the first LERs in the LSPs found by Dijkstra's">
  Destinations: <span style:color="grey">(?)</span>
</p>
<table>
  <thead>
    <tr>
      <th>Destination</th>
      <th>First hop</th>
      <th><span style:color="grey" title="Generates shortest path">(?)</span></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each [...router.firstHop] as [destination, link]}
      <tr>
        <td>
          <input
            type="text"
            value={destination}
            placeholder="Address"
            on:change={(event) => {
              handleOnChangeDestination(event, destination);
            }}
          />
        </td>
        <td>
          <input
            type="text"
            value={link}
            placeholder="Link"
            on:change={(event) => {
              handleOnChangeLink(event, destination);
            }}
          />
        </td>
        <td title="Generates shortest path">
          <SmallButton
            text="LDP"
            callback={() => {
              handleLDPClick(destination);
            }}
          />
        </td>
        <td>
          <SmallButton
            text="-"
            callback={() => {
              router.firstHop.delete(destination);
              router = router;
            }}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div>
  <SmallButton text="+" callback={addAndUpdate(router.addEmptyEntry)} />
</div>

<style>
  div {
    margin-top: 5px;
  }

  th:nth-last-child(2) {
    width: 44px;
  }
</style>
