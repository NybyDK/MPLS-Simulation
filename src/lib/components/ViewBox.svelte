<script lang="ts">
	import { onMount } from "svelte";
	import { network } from "$lib/stores/network";
	import { type Node, isNodeType } from "$lib/interfaces/network";

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
			if (!SVG) return 1;
			return this.width / SVG.getBoundingClientRect().width;
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

	let SVG: SVGElement | null = null;
	let selectedNode: Node | null = null;
	let interactionState: InteractionState = InteractionState.NONE;
	let loaded = false;

	onMount(() => {
		const resizeObserver = new ResizeObserver(updateViewBox);

		if (!SVG) return;

		resizeObserver.observe(SVG);
		loaded = true;
	});

	function updateViewBox() {
		if (!SVG) return;

		const zoomFactor = viewBox.scale || 1;

		viewBox.width = SVG.getBoundingClientRect().width * zoomFactor;
		viewBox.height = SVG.getBoundingClientRect().height * zoomFactor;
	}

	function handlePointerDown(event: PointerEvent) {
		if (!(event.target instanceof Element)) return;

		event.preventDefault();

		SVG?.addEventListener("pointermove", handlePointerMove);
		SVG?.setPointerCapture(event.pointerId);

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

		SVG?.releasePointerCapture(event.pointerId);
		SVG?.removeEventListener("pointermove", handlePointerMove);
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

			network.fastUpdate();
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

		if (!SVG) return;
		if (viewBox.scale < 0.1 && event.deltaY <= 0) return;
		if (viewBox.scale > 5 && event.deltaY >= 0) return;

		mouse.x = event.clientX;
		mouse.y = event.clientY;

		const boundingRect = SVG.getBoundingClientRect();

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
		if (!SVG) return;

		network.createNode({
			label: "Node",
			x: scaledX(event.clientX),
			y: scaledY(event.clientY),
			type: data,
		});
	}

	function scaledX(x: number) {
		return SVG ? (x - SVG.getBoundingClientRect().left) * viewBox.scale + viewBox.x : x;
	}

	function scaledY(y: number) {
		return SVG ? (y - SVG.getBoundingClientRect().top) * viewBox.scale + viewBox.y : y;
	}
</script>

{#if !loaded}
	<p style="font-size: 200px;">Loading...</p>
{/if}
<svg
	bind:this={SVG}
	viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
	on:wheel={handleWheel}
	on:pointerdown={handlePointerDown}
	on:pointerup={handlePointerUp}
	on:dragover|preventDefault
	on:drop={handleDrop}
	role="button"
	tabindex="-1"
>
	{#if interactionState === InteractionState.CONNECTING && selectedNode}
		<line
			x1={selectedNode.x}
			y1={selectedNode.y}
			x2={scaledX(mouse.x)}
			y2={scaledY(mouse.y)}
			stroke="black"
		/>
	{/if}
	<slot />
</svg>

<style>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
