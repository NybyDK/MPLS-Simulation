<script lang="ts">
	import Mermaid from "../components/Mermaid.svelte";

	let mermaidCode = `flowchart LR
		Router_1 --- Router_3
		Router_1 --- Router_5
		Router_2 --- Router_4 
		Router_2 --- Router_6
		Router_3 --- Edge_Router_2
		Router_3 --- Edge_Router_4
		Router_4 --- Edge_Router_2
		Router_4 --- Edge_Router_4
		Router_5 --- Router_3
		Router_6 --- Router_4
		Edge_Router_1 --- Router_1
		Edge_Router_1 --- Router_2
		Edge_Router_2 --- Customer_3
		Edge_Router_2 --- Customer_4
		Edge_Router_3 --- Router_1
		Edge_Router_3 --- Router_2
		Edge_Router_4 --- Customer_7
		Edge_Router_4 --- Customer_8
		Customer_1 --- Edge_Router_1
		Customer_2 --- Edge_Router_1
		Customer_5 --- Edge_Router_3
		Customer_6 --- Edge_Router_3`;
</script>

<h1>MPLS Simulation but without any Simulation and any MPLS so far</h1>

<textarea bind:value={mermaidCode} />
<Mermaid input={mermaidCode}></Mermaid>
