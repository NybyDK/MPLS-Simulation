<script lang="ts">
	import Mermaid from "../components/Mermaid.svelte";
	import NetworkManager from "../components/NetworkManager.svelte";
</script>

<h1>MPLS Simulation but without any Simulation and any MPLS so far</h1>

<div id="container">
	<div id="left">
		<NetworkManager />
	</div>
	<div id="right">
		<Mermaid />
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
