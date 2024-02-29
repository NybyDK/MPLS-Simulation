<script lang="ts">
	import type { Node } from "$lib/interfaces/network";

	export let node: Node;
</script>

<circle
	id={node.id.toString()}
	cx={node.x}
	cy={node.y}
	r="20"
	fill={["lightgreen", "cyan", "hotpink"][node.type]}
/>
<text x={node.x} y={node.y} text-anchor="middle" alignment-baseline="middle">{node.label}</text>

<style>
	text {
		user-select: none;
		pointer-events: none;
	}
</style>
