<script lang="ts">
	import { onMount } from "svelte";
	import { network } from "$lib/stores/network";
	import { NodeType, type Node, type Connection, isNodeType } from "$lib/interfaces/network";
	import ToolboxItem from "$lib/components/ToolboxItem.svelte";
	import HelpButton from "$lib/components/HelpButton.svelte";

	enum InteractionState {
		NONE,
		DRAGGING,
		PANNING,
		CONNECTING,
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
		{ text: "+ Customer", type: NodeType.Customer, color: nodeColors[NodeType.Customer] },
		{ text: "+ Edge", type: NodeType.Edge, color: nodeColors[NodeType.Edge] },
		{ text: "+ Core", type: NodeType.Core, color: nodeColors[NodeType.Core] },
	];

	let SVGContainer: SVGElement | null = null;
	let selectedNode: Node | null = null;
	let interactionState = InteractionState.NONE;
	let loaded = false;

	onMount(() => {
		const resizeObserver = new ResizeObserver(updateViewBox);

		if (!SVGContainer) return;

		resizeObserver.observe(SVGContainer);
		loaded = true;
	});

	function updateViewBox() {
		if (!SVGContainer) return;

		const zoomFactor = viewBox.scale || 1;

		viewBox.width = SVGContainer.getBoundingClientRect().width * zoomFactor;
		viewBox.height = SVGContainer.getBoundingClientRect().height * zoomFactor;
	}

	function handlePointerDown(event: PointerEvent) {
		if (!(event.target instanceof Element)) return;

		event.preventDefault();

		SVGContainer?.addEventListener("pointermove", handlePointerMove);
		SVGContainer?.setPointerCapture(event.pointerId);

		const targetId = event.target.id;

		if (targetId) {
			selectedNode = network.getNode(parseInt(targetId)) || null;

			if (!selectedNode) return;

			if (event.shiftKey) {
				interactionState = InteractionState.CONNECTING;
			} else {
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
		if (!(event.target instanceof Element)) return;

		event.preventDefault();

		if (interactionState === InteractionState.CONNECTING && selectedNode) {
			const element = document.elementFromPoint(event.clientX, event.clientY);

			const targetId = element?.tagName === "circle" ? element.id : null;
			const target = network.getNode(parseInt(targetId ?? ""));

			if (target !== undefined) {
				network.addConnection({ source: selectedNode, target: target });
			}
		}

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
			mouse.x = event.clientX;
			mouse.y = event.clientY;

			viewBox.x -= delta.x;
			viewBox.y -= delta.y;
		} else if (interactionState === InteractionState.CONNECTING) {
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

	function handleDrop(event: DragEvent) {
		event.preventDefault();

		const data = parseInt(event.dataTransfer?.getData("text/plain") ?? "0");

		if (!isNodeType(data)) return;
		if (!SVGContainer) return;

		network.createNode({
			label: "Node",
			...scaledMousePosition(event.clientX, event.clientY),
			type: data,
		});
	}

	function getCoordinates(connection: Connection) {
		return {
			...transformToLineSource(connection.source),
			...transformToLineDestination(connection.target),
		};
	}

	function scaledMousePosition(x: number, y: number) {
		if (!SVGContainer) return { x, y };

		return {
			x: (x - SVGContainer.getBoundingClientRect().left) * viewBox.scale + viewBox.x,
			y: (y - SVGContainer.getBoundingClientRect().top) * viewBox.scale + viewBox.y,
		};
	}

	function transformToLineDestination(origin: { x: number; y: number }) {
		return {
			x2: origin.x,
			y2: origin.y,
		};
	}

	function transformToLineSource(origin: { x: number; y: number }) {
		return {
			x1: origin.x,
			y1: origin.y,
		};
	}
</script>

<div id="svg-container">
	{#if !loaded}
		<h1 style="font-size: 200px">Loading...</h1>
	{/if}
	<svg
		bind:this={SVGContainer}
		viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
		on:wheel={handleWheel}
		on:pointerdown={handlePointerDown}
		on:pointerup={handlePointerUp}
		on:dragover|preventDefault
		on:drop={handleDrop}
		role="button"
		tabindex="-1"
	>
		{#each $network.connections as connection}
			<line {...getCoordinates(connection)} stroke="black" />
		{/each}
		{#if interactionState === InteractionState.CONNECTING && selectedNode}
			<line
				{...transformToLineSource(selectedNode)}
				{...transformToLineDestination(scaledMousePosition(mouse.x, mouse.y))}
				stroke="black"
			/>
		{/if}
		{#each $network.nodes as node}
			<circle id={node.id.toString()} cx={node.x} cy={node.y} r="20" fill={nodeColors[node.type]} />
			<text x={node.x} y={node.y} text-anchor="middle" alignment-baseline="middle">
				{node.label}
			</text>
		{/each}
	</svg>
	<div id="drag-and-drop-container" class="absolute-flex">
		{#each ToolboxItems as item}
			<ToolboxItem {...item} />
		{/each}
	</div>
	<div id="bottom-bar" class="absolute-flex">
		<HelpButton />
	</div>
</div>

<style>
	#svg-container {
		position: relative;
		display: flex;
		overflow: hidden;
		flex: 1;
	}

	svg {
		width: 100%;
		height: 100%;
	}

	text {
		user-select: none;
		pointer-events: none;
	}

	.absolute-flex {
		position: absolute;
		display: flex;
	}

	#drag-and-drop-container {
		margin: 10px;
	}

	#bottom-bar {
		margin: 10px;
		bottom: 0;
	}
</style>
