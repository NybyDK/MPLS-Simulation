<script lang="ts">
  import { network } from "$lib/stores/network";
  import { paths } from "$lib/stores/paths";
  import LDP from "$lib/classes/MPLS/LDP";
  import CE from "$lib/classes/MPLS/CE";

  export let router: CE;

  function addAndUpdate(addCallback: () => void) {
    return () => {
      addCallback();
      router = router;
    };
  }

  function handleOnChangeDestination(event: Event, destination: string) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const target = event.target.value;

    router.updateAddress(destination, target);

    const CERouters = $network.routers.filter((router): router is CE => router instanceof CE);
    const destinationRouter = CERouters.find((router) => router.address === target);

    if (!destinationRouter) {
      alert("Destination router not found.");
      return;
    }

    const path = paths.findShortestPath(router, destinationRouter);

    LDP(path, target);

    router = router;
  }

  function handleOnChangeLink(event: Event, destination: string) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const target = parseInt(event.target.value);

    router.firstHop.set(destination, target);
  }
</script>

<p>Destinations:</p>
<table>
  <tr>
    <th>Destination</th>
    <th>First hop</th>
  </tr>
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
      <button
        on:click={() => {
          router.deleteEntry(destination);
          router = router;
        }}
      >
        -
      </button>
    </tr>
  {/each}
</table>
<button on:click={addAndUpdate(router.addEmptyEntry)}>+</button>
<!-- <p>First Hop Table:</p>
<table>
  <tr>
    <th>Destination</th>
  </tr>
  {#each router.firstHop as [destination, nextHop]}
    <tr>
      <td><input type="text" bind:value={destination} /></td>
      <td><input type="text" bind:value={nextHop} /></td>
      <button
        on:click={() => {
          router.deleteFirstHop(destination);
          router = router;
        }}
      >
        -
      </button>
    </tr>
  {/each}
</table>
<button on:click={addAndUpdate(router.addEmptyHop)}>+</button> -->
