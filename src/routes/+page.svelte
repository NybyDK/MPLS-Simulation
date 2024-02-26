<script lang="ts">
	import NetworkManager from "$lib/components/NetworkManager.svelte";
	import Network from "$lib/components/Network.svelte";
</script>

<h1>MPLS Simulation but without any Simulation and any MPLS so far</h1>

<div id="container">
	<div id="left">
		<NetworkManager />
	</div>
	<div id="right">
		<Network />
	</div>
</div>

<style>
	#container {
		display: flex;
	}

	#left,
	#right {
		outline: 2px dashed black;
		flex: 1;
	}
</style>
