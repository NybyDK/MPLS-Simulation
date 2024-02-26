<script lang="ts">
	import { onMount } from "svelte";
	import { network } from "$lib/stores/network";
	import { NodeType, type Node, type Connection, isNodeType } from "$lib/interfaces/network";
	import ToolboxItem from "$lib/components/ToolboxItem.svelte";

	enum InteractionState {
		NONE,
		DRAGGING,
		PANNING,
	}

	const viewBox = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		get scale() {
			if (!SVGContainer) return 1;
			return this.width / SVGContainer.getBoundingClientRect().width;
		},
	};

	const mouse = {
		x: 0,
		y: 0,
	};

	const initialMouse = {
		x: 0,
		y: 0,
	};

	const nodeColors = {
		[NodeType.Customer]: "lightgreen",
		[NodeType.Edge]: "cyan",
		[NodeType.Core]: "hotpink",
	};

	const ToolboxItems = [
		{ text: "+ Customer", type: NodeType.Customer },
		{ text: "+ Edge", type: NodeType.Edge },
		{ text: "+ Core", type: NodeType.Core },
	];

	let SVGContainer: SVGElement | null = null;
	let selectedNode: Node | null = null;
	let interactionState = InteractionState.NONE;

	onMount(() => {
		if (!SVGContainer) return;
		viewBox.width = SVGContainer.getBoundingClientRect().width;
		viewBox.height = SVGContainer.getBoundingClientRect().height;
	});

	function handlePointerDown(event: PointerEvent) {
		if (!(event.target instanceof Element)) return;

		event.preventDefault();

		SVGContainer?.addEventListener("pointermove", handlePointerMove);
		SVGContainer?.setPointerCapture(event.pointerId);

		const targetId = event.target.id;

		if (targetId) {
			selectedNode = $network.nodes.find((node) => node.id === targetId) || null;

			if (selectedNode) {
				initialMouse.x = selectedNode.x;
				initialMouse.y = selectedNode.y;
				interactionState = InteractionState.DRAGGING;
			}
		} else {
			interactionState = InteractionState.PANNING;
		}

		mouse.x = event.clientX;
		mouse.y = event.clientY;
	}

	function handlePointerUp(event: PointerEvent) {
		event.preventDefault();

		interactionState = InteractionState.NONE;
		selectedNode = null;

		SVGContainer?.releasePointerCapture(event.pointerId);
		SVGContainer?.removeEventListener("pointermove", handlePointerMove);
	}

	function handlePointerMove(event: MouseEvent) {
		event.preventDefault();

		const delta = {
			x: (event.clientX - mouse.x) * viewBox.scale,
			y: (event.clientY - mouse.y) * viewBox.scale,
		};

		if (interactionState === InteractionState.DRAGGING && selectedNode) {
			selectedNode.x = initialMouse.x + delta.x;
			selectedNode.y = initialMouse.y + delta.y;

			$network.nodes = $network.nodes;
		} else if (interactionState === InteractionState.PANNING) {
			viewBox.x -= delta.x;
			viewBox.y -= delta.y;

			mouse.x = event.clientX;
			mouse.y = event.clientY;
		}
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		if (!SVGContainer) return;
		if (viewBox.scale < 0.1 && event.deltaY <= 0) return;
		if (viewBox.scale > 5 && event.deltaY >= 0) return;

		mouse.x = event.clientX;
		mouse.y = event.clientY;

		const boundingRect = SVGContainer.getBoundingClientRect();

		const zoomFactor = event.deltaY > 0 ? 1 + 0.025 : 1 - 0.025;

		const offset = {
			x: (mouse.x - boundingRect.left) / boundingRect.width,
			y: (mouse.y - boundingRect.top) / boundingRect.height,
		};

		viewBox.x -= viewBox.width * (zoomFactor - 1) * offset.x;
		viewBox.y -= viewBox.height * (zoomFactor - 1) * offset.y;

		viewBox.width *= zoomFactor;
		viewBox.height *= zoomFactor;
	}

	function getCoordinates(connection: Connection) {
		const source = $network.nodes.find((node) => node.id === connection.source);
		const target = $network.nodes.find((node) => node.id === connection.target);

		if (!source || !target) return;

		return {
			x1: source.x,
			y1: source.y,
			x2: target.x,
			y2: target.y,
		};
	}

	function drop(event: DragEvent) {
		event.preventDefault();

		const data = parseInt(event.dataTransfer?.getData("text/plain") ?? "0");

		if (!isNodeType(data)) return;

		if (!SVGContainer) return;

		const newNode: Node = {
			id: Math.random().toString(36).substring(7),
			label: "L",
			x: (event.clientX - SVGContainer.getBoundingClientRect()?.left) * viewBox.scale + viewBox.x,
			y: (event.clientY - SVGContainer.getBoundingClientRect()?.top) * viewBox.scale + viewBox.y,
			type: data,
		};
		$network.nodes = [...$network.nodes, newNode];
	}
</script>

<div id="svg-container">
	<svg
		bind:this={SVGContainer}
		viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
		on:wheel={handleWheel}
		on:pointerdown={handlePointerDown}
		on:pointerup={handlePointerUp}
		on:dragover|preventDefault
		on:drop={drop}
		role="button"
		tabindex="-1"
	>
		{#each $network.connections as connection}
			<line {...getCoordinates(connection)} stroke="black" />
		{/each}
		{#each $network.nodes as node}
			<circle id={node.id} cx={node.x} cy={node.y} r="20" fill={nodeColors[node.type]} />
			<text x={node.x} y={node.y} text-anchor="middle" alignment-baseline="middle"
				>{node.label}</text
			>
		{/each}
	</svg>
	<div id="drag-and-drop-container">
		{#each ToolboxItems as item}
			<ToolboxItem {...item} />
		{/each}
	</div>
</div>

<style>
	#svg-container {
		position: relative;
	}

	svg {
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 1;
	}

	text {
		pointer-events: none;
	}

	#drag-and-drop-container {
		position: absolute;
		display: flex;
		margin: 10px;
		top: 0;
		left: 0;
	}
</style>
