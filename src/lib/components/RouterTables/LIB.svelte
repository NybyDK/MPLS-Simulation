<script lang="ts">
  import type LSR from "$lib/classes/MPLS/LSR";
  import type LER from "$lib/classes/MPLS/LER";

  export let router: LSR | LER;

  function addAndUpdate(addCallback: () => void) {
    return () => {
      addCallback();
      router = router;
    };
  }

  function handleOnChange(event: Event, oldLabel: number) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const newLabel = parseInt(event.target.value);

    router.LIB.updateLabel(oldLabel, newLabel);
  }
</script>

<table>
  <tr>
    <th>Incoming</th>
    <th>Outgoing</th>
    <th>Next hop</th>
  </tr>
  {#each [...router.LIB.map] as [incomingLabel, value]}
    <tr>
      <td>
        <input
          type="number"
          value={incomingLabel}
          on:change={(event) => {
            handleOnChange(event, incomingLabel);
          }}
        />
      </td>
      <td><input type="number" bind:value={value.outgoingLabel} /></td>
      <td><input type="text" bind:value={value.nextHop} /></td>
      <button
        on:click={() => {
          router.LIB.deleteEntry(incomingLabel);
          router = router;
        }}
      >
        -
      </button>
    </tr>
  {/each}
  <button on:click={addAndUpdate(router.LIB.addEmptyEntry)}>+</button>
</table>
