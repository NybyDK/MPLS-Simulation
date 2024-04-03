<script lang="ts">
  import type LER from "$lib/classes/MPLS/LER";

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

<table>
  <tr>
    <th>Address</th>
    <th>Label</th>
    <th>Next hop</th>
  </tr>
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
      <button
        on:click={() => {
          router.FIB.deleteEntry(address);
          router = router;
        }}
      >
        -
      </button>
    </tr>
  {/each}
  <button on:click={addAndUpdate(router.FIB.addEmptyEntry)}>+</button>
</table>
