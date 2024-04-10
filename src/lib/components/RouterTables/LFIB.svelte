<script lang="ts">
  import type LSR from "$lib/classes/MPLS/LSR";
  import type LER from "$lib/classes/MPLS/LER";
  import SmallButton from "$lib/components/RouterTables/SmallButton.svelte";

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

    router.LFIB.updateLabel(oldLabel, newLabel);
  }
</script>

<p>LFIB:</p>
<table>
  <thead>
    <tr>
      <th>Incoming</th>
      <th>Outgoing</th>
      <th>Next hop</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each [...router.LFIB.map] as [incomingLabel, value]}
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
        <SmallButton
          text="-"
          callback={() => {
            router.LFIB.deleteEntry(incomingLabel);
            router = router;
          }}
        />
      </tr>
    {/each}
  </tbody>
</table>
<div>
  <SmallButton text="+" callback={addAndUpdate(router.LFIB.addEmptyEntry)} />
</div>

<style>
  div {
    margin-top: 5px;
  }
</style>
