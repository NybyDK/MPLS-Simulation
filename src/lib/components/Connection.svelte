<script lang="ts">
	import type { Connection } from "$lib/interfaces/network";

	export let connection: Connection;
</script>

<line
	x1={connection.source.x}
	y1={connection.source.y}
	x2={connection.target.x}
	y2={connection.target.y}
	stroke="black"
/>
