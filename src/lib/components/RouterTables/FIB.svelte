<script lang="ts">
  import type LER from "$lib/classes/MPLS/LER";
  import SmallButton from "$lib/components/RouterTables/SmallButton.svelte";

  export let router: LER;

  function addAndUpdate(addCallback: () => void) {
    return () => {
      addCallback();
      router = router;
    };
  }

  function handleOnChange(event: Event, oldAddress: string) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const newAddress = event.target.value;

    router.FIB.updateAddress(oldAddress, newAddress);
  }
</script>

<p title="Maps IP addresses to labels and router IDs">FIB: <span style:color="grey">(?)</span></p>
<table>
  <thead>
    <tr>
      <th>Address</th>
      <th>Label</th>
      <th>Next hop</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {#each [...router.FIB.map] as [address, value]}
      <tr>
        <td>
          <input
            type="text"
            value={address}
            on:change={(event) => {
              handleOnChange(event, address);
            }}
          />
        </td>
        <td><input type="number" bind:value={value.label} /></td>
        <td><input type="text" bind:value={value.nextHop} /></td>
        <SmallButton
          text="-"
          callback={() => {
            router.FIB.deleteEntry(address);
            router = router;
          }}
        />
      </tr>
    {/each}
  </tbody>
</table>
<div>
  <SmallButton text="+" callback={addAndUpdate(router.FIB.addEmptyEntry)} />
</div>

<style>
  div {
    margin-top: 5px;
  }
</style>
