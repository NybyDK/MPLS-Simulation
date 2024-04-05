<script lang="ts">
  import { network } from "$lib/stores/network";
  import { paths } from "$lib/stores/paths";
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

    router.updateAddress(destination, target);

    const destinationRouter = network.getCERouter(target);

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
  <thead>
    <tr>
      <th>Destination</th>
      <th>First hop</th>
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
        <SmallButton
          text="-"
          callback={() => {
            router.firstHop.delete(destination);
            router = router;
          }}
        />
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
</style>
