<script lang="ts">
  import type Router from "$lib/classes/MPLS/Router";
  import LER from "$lib/classes/MPLS/LER";
  import LSR from "$lib/classes/MPLS/LSR";
  import CE from "$lib/classes/MPLS/CE";

  export let router: Router;

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

    router.updateAddress(oldAddress, newAddress);
  }

  function handleOnChangeLIB(event: Event, oldLabel: number) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (!(router instanceof LSR)) return;

    const newLabel = parseInt(event.target.value);
    if (router.LIB.get(newLabel)) {
      alert("Label already exists in LIB.");
      return;
    }

    router.updateLabel(oldLabel, newLabel);
  }
</script>

{#if router instanceof CE}
  <p>Flows:</p>
  <table>
    <tr>
      <th>Size (Megabits)</th>
      <th>Destination</th>
    </tr>
    {#each router.flows as flow, index}
      <tr>
        <td>
          <input type="number" bind:value={flow.size} />
        </td>
        <td>
          <input type="text" bind:value={flow.destination} placeholder="Address" />
        </td>
        <button
          on:click={() => {
            if (router instanceof CE) {
              router.deleteFlow(index);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyFlow)}>+</button>
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
              router.deleteEntry(address);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyEntry)}>+</button>
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
              router.deleteEntry(incomingLabel);
              router = router;
            }
          }}
        >
          -
        </button>
      </tr>
    {/each}
  </table>
  <button on:click={addAndUpdate(router.addEmptyEntry)}>+</button>
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