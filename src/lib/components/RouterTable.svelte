<script lang="ts">
  import { network } from "$lib/stores/network";
  import { paths } from "$lib/stores/paths";
  import type Router from "$lib/classes/MPLS/Router";
  import LER from "$lib/classes/MPLS/LER";
  import LSR from "$lib/classes/MPLS/LSR";
  import CE from "$lib/classes/MPLS/CE";

  export let router: Router;

  const max = 2 ** 20 - 1; //Two to the power of twenty minus one
  const min = 16;

  function addAndUpdate(addCallback: () => void) {
    return () => {
      addCallback();
      router = router;
    };
  }

  function handleOnChangeFIB(event: Event, oldAddress: string) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (!(router instanceof LER)) return;

    const newAddress = event.target.value;
    if (router.FIB.get(newAddress)) {
      alert("Address already exists in FIB.");
      return;
    }

    router.updateFIBAddress(oldAddress, newAddress);
  }

  function handleOnChangeLIB(event: Event, oldLabel: number) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (!(router instanceof LSR)) return;

    const newLabel = parseInt(event.target.value);
    if (router.LIB.get(newLabel)) {
      alert("Label already exists in LIB.");
      return;
    }

    router.updateLIBLabel(oldLabel, newLabel);
  }

  function handleOnChangeDestination(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (!(router instanceof CE)) return;

    const target = event.target.value;

    const CERouters = $network.routers.filter((router): router is CE => router instanceof CE);
    const destinationRouter = CERouters.find((router) => router.address === target);

    if (!destinationRouter) {
      alert("Destination router not found.");
      return;
    }

    const path = paths.findShortestPath(router, destinationRouter);

    let incomingLabel = generateLabel();
    let firstLER = true;

    for (let i = path.length - 1; i > 0; i--) {
      const currentRouter = path[i];
      const previousRouter = path[i - 1];

      const outgoingLabel = incomingLabel;
      incomingLabel = generateLabel();

      if (previousRouter instanceof LER && firstLER) {
        previousRouter.receiveLIBEntry(incomingLabel, -1, target);
        firstLER = false;
      } else if (previousRouter instanceof LER && !firstLER) {
        previousRouter.receiveFIBEntry(target, outgoingLabel, currentRouter.id.toString());
      } else if (previousRouter instanceof LSR) {
        previousRouter.receiveLIBEntry(incomingLabel, outgoingLabel, currentRouter.id.toString());
      }
    }
  }

  function isLabelUsed(label: number) {
    if (router instanceof LSR || router instanceof LER) {
      return router.LIB.has(label);
    }

    return false;
  }

  function generateLabel() {
    let label: number;

    do {
      label = Math.floor(Math.random() * (max - min + 1) + min);
    } while (isLabelUsed(label));

    return label;
  }
</script>

{#if router instanceof CE}
  <p>Destinations:</p>
  <table>
    <tr>
      <th>Destination</th>
    </tr>
    {#each router.destinations as destination, index}
      <tr>
        <td>
          <input
            type="text"
            bind:value={destination}
            placeholder="Address"
            on:change={(event) => {
              handleOnChangeDestination(event);
            }}
          />
        </td>
        <button
          on:click={() => {
            if (router instanceof CE) {
              router.deleteDestination(index);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyDestination)}>+</button>
{:else if router instanceof LER}
  <p>FIB:</p>
  <table>
    <tr>
      <th>Address</th>
      <th>Label</th>
      <th>Next hop</th>
    </tr>
    {#each [...router.FIB] as [address, value]}
      <tr>
        <td>
          <input
            type="text"
            value={address}
            on:change={(event) => {
              handleOnChangeFIB(event, address);
            }}
          />
        </td>
        <td><input type="number" bind:value={value.label} /></td>
        <td><input type="text" bind:value={value.nextHop} /></td>
        <button
          on:click={() => {
            if (router instanceof LER) {
              router.deleteFIBEntry(address);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyFIBEntry)}>+</button>
  <p>LIB:</p>
  <table>
    <tr>
      <th>Incoming</th>
      <th>Outgoing</th>
      <th>Next hop</th>
    </tr>
    {#each [...router.LIB] as [incomingLabel, value]}
      <tr>
        <td>
          <input
            type="number"
            value={incomingLabel}
            on:change={(event) => {
              handleOnChangeLIB(event, incomingLabel);
            }}
          />
        </td>
        <td><input type="number" bind:value={value.outgoingLabel} /></td>
        <td><input type="text" bind:value={value.nextHop} /></td>
        <button
          on:click={() => {
            if (router instanceof LER) {
              router.deleteLIBEntry(incomingLabel);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyLIBEntry)}>+</button>
{:else if router instanceof LSR}
  <p>LIB:</p>
  <table>
    <tr>
      <th>Incoming</th>
      <th>Outgoing</th>
      <th>Next hop</th>
    </tr>
    {#each [...router.LIB] as [incomingLabel, value]}
      <tr>
        <td>
          <input
            type="number"
            value={incomingLabel}
            on:change={(event) => {
              handleOnChangeLIB(event, incomingLabel);
            }}
          />
        </td>
        <td><input type="number" bind:value={value.outgoingLabel} /></td>
        <td><input type="text" bind:value={value.nextHop} /></td>
        <button
          on:click={() => {
            if (router instanceof LSR) {
              router.deleteLIBEntry(incomingLabel);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyLIBEntry)}>+</button>
{/if}

<style>
  table {
    border-collapse: collapse;
    min-width: 500px;
  }

  th,
  td {
    border: 1px solid black;
  }

  @media (prefers-color-scheme: dark) {
    th,
    td {
      border: 1px solid white;
    }
  }

  input {
    width: 100%;
    text-align: center;
  }

  button {
    display: block;
  }
</style>
