<template>
	<main class="grid min-h-screen grid-cols-1 gap-4 p-5 lg:grid-cols-[minmax(280px,380px)_1fr]" :class="isDark ? 'bg-[#14181d] text-[#e8edf2]' : 'bg-[#f8f8f6] text-[#2f2a25]'">
		<section class="rounded-2xl border p-4" :class="isDark ? 'border-[#3a424c] bg-[#1d232b]' : 'border-[#d7ccbf] bg-white'">
			<div class="mb-2 flex items-center justify-between gap-2">
				<h1 class="m-0 text-2xl">Image Text Composer</h1>
				<button
					type="button"
					class="rounded-[10px] border px-3 py-1.5 text-sm"
					:class="isDark ? 'border-[#596575] bg-[#12171d] text-[#dce4ed]' : 'border-[#2f2a25] bg-white text-[#2f2a25]'"
					@click="isDark = !isDark"
				>
					{{ isDark ? "Light mode" : "Dark mode" }}
				</button>
			</div>
			<p class="mb-4 mt-2 text-sm" :class="isDark ? 'text-[#a9b3bf]' : 'text-[#6c5f52]'">Upload a photo, enter your text, then drag text on the preview.</p>

			<label class="mb-4 grid gap-1.5">
				<span class="text-[0.92rem]" :class="isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">Photo</span>
				<input
					class="rounded-[10px] border px-3 py-2"
					:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
					type="file"
					accept="image/png,image/jpeg,image/webp"
					@change="onFileSelected"
				/>
			</label>

			<label class="mb-4 grid gap-1.5">
				<span class="text-[0.92rem]" :class="isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">Text</span>
				<input
					class="rounded-[10px] border px-3 py-2"
					:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
					v-model="overlay.text"
					type="text"
					placeholder="Type text to place on image"
					:disabled="!image"
				/>
			</label>

			<label class="mb-4 grid gap-1.5">
				<span class="text-[0.92rem]" :class="isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">Text color</span>
				<input class="h-9 w-full rounded-[10px] border p-1" :class="isDark ? 'border-[#4f5967] bg-[#131820]' : 'border-[#cdbfae] bg-white'" v-model="overlay.color" type="color" :disabled="!image" />
			</label>

			<div class="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
				<button
					class="cursor-pointer rounded-[10px] border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
					:class="isDark ? 'border-[#708094] bg-[#364050] text-[#f0f4f8]' : 'border-[#2f2a25] bg-[#2f2a25] text-[#fffdf8]'"
					type="button"
					:disabled="!image || busy"
					@click="downloadImage"
				>
					Download PNG
				</button>
				<button
					type="button"
					class="cursor-pointer rounded-[10px] border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
					:class="isDark ? 'border-[#708094] bg-[#12171d] text-[#dce4ed]' : 'border-[#2f2a25] bg-[#fffdf8] text-[#2f2a25]'"
					:disabled="!image || busy"
					@click="copyToClipboard"
				>
					Copy image
				</button>
			</div>

			<p v-if="status" class="mt-3 text-[0.92rem]" :class="isDark ? 'text-[#7fd3a5]' : 'text-[#2d6a4f]'">{{ status }}</p>
			<p v-if="errorMessage" class="mt-3 text-[0.92rem] text-[#9b2226]">{{ errorMessage }}</p>
		</section>

		<section class="flex flex-col justify-center rounded-2xl border p-4" :class="isDark ? 'border-[#3a424c] bg-[#1d232b]' : 'border-[#d7ccbf] bg-white'" ref="previewHostRef">
			<div
				class="flex min-h-[300px] items-center justify-center overflow-hidden rounded-[14px] border border-dashed"
				:class="isDark ? 'border-[#4f5967] bg-[#10151b]' : 'border-[#b8a892] bg-[#fdfdfb]'"
			>
				<canvas
					ref="canvasRef"
					class="touch-none"
					:class="image ? 'h-auto max-w-full cursor-grab active:cursor-grabbing' : 'h-[300px] w-full cursor-default'"
					@pointerdown="onPointerDown"
					@pointermove="onPointerMove"
					@pointerup="onPointerUp"
					@pointercancel="onPointerUp"
					@pointerleave="onPointerUp"
				/>
			</div>

			<p class="mt-3 text-sm" :class="isDark ? 'text-[#a9b3bf]' : 'text-[#6c5f52]'" v-if="image">Drag inside text box to move, drag bottom-right diagonal button to resize.</p>
			<p class="mt-3 text-sm" :class="isDark ? 'text-[#a9b3bf]' : 'text-[#6c5f52]'" v-else>Preview appears here after selecting an image.</p>
		</section>
	</main>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
	clampOverlayPosition,
	exportCompositionBlob,
	fitWithin,
	getResizeHandleRect,
	loadImageFromFile,
	pointHitsRect,
	pointHitsResizeHandle,
	renderPreview,
	type Rect,
	type Size,
	type TextOverlay
} from "../utils/canvasComposer";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const previewHostRef = ref<HTMLElement | null>(null);

const image = ref<HTMLImageElement | null>(null);
const previewSize = reactive<Size>({ width: 0, height: 0 });
const textRect = reactive<Rect>({ x: 0, y: 0, width: 0, height: 0 });
const resizeHandleRect = reactive<Rect>({ x: 0, y: 0, width: 16, height: 16 });

const overlay = reactive<TextOverlay>({
	text: "Sample text",
	x: 24,
	y: 24,
	fontSize: 40,
	color: "#ffffff",
	fontFamily: "system-ui, sans-serif",
	fontWeight: "700"
});

const busy = ref(false);
const status = ref("");
const errorMessage = ref("");
const isDark = ref(false);

const drag = reactive({
	active: false,
	mode: "move" as "move" | "resize",
	offsetX: 0,
	offsetY: 0,
	startX: 0,
	startY: 0,
	startFontSize: 40
});

let resizeObserver: ResizeObserver | null = null;

function setStatus(message: string) {
	status.value = message;
	errorMessage.value = "";
}

function setError(message: string) {
	errorMessage.value = message;
	status.value = "";
}

function clearMessages() {
	status.value = "";
	errorMessage.value = "";
}

function getPreviewBounds(source: HTMLImageElement): Size {
	const hostWidth = previewHostRef.value?.clientWidth ?? 680;
	const maxWidth = Math.max(240, hostWidth - 28);
	const maxHeight = 560;
	return fitWithin(source.naturalWidth, source.naturalHeight, maxWidth, maxHeight);
}

function redraw() {
	if (!image.value || !canvasRef.value) {
		return;
	}

	const nextSize = getPreviewBounds(image.value);

	if (nextSize.width === 0 || nextSize.height === 0) {
		return;
	}

	if (previewSize.width > 0 && previewSize.height > 0) {
		const sx = nextSize.width / previewSize.width;
		const sy = nextSize.height / previewSize.height;
		overlay.x *= sx;
		overlay.y *= sy;
	}

	previewSize.width = nextSize.width;
	previewSize.height = nextSize.height;

	const clampedOverlay = clampOverlayPosition(overlay, previewSize, textRect);
	overlay.x = clampedOverlay.x;
	overlay.y = clampedOverlay.y;

	const rect = renderPreview({
		canvas: canvasRef.value,
		image: image.value,
		overlay,
		size: previewSize
	});

	textRect.x = rect.x;
	textRect.y = rect.y;
	textRect.width = rect.width;
	textRect.height = rect.height;

	const handleRect = getResizeHandleRect(textRect);
	resizeHandleRect.x = handleRect.x;
	resizeHandleRect.y = handleRect.y;
	resizeHandleRect.width = handleRect.width;
	resizeHandleRect.height = handleRect.height;

	const postClamp = clampOverlayPosition(overlay, previewSize, textRect);
	const changed = postClamp.x !== overlay.x || postClamp.y !== overlay.y;

	if (changed) {
		overlay.x = postClamp.x;
		overlay.y = postClamp.y;
		const correctedRect = renderPreview({
			canvas: canvasRef.value,
			image: image.value,
			overlay,
			size: previewSize
		});

		textRect.x = correctedRect.x;
		textRect.y = correctedRect.y;
		textRect.width = correctedRect.width;
		textRect.height = correctedRect.height;

		const correctedHandleRect = getResizeHandleRect(textRect);
		resizeHandleRect.x = correctedHandleRect.x;
		resizeHandleRect.y = correctedHandleRect.y;
		resizeHandleRect.width = correctedHandleRect.width;
		resizeHandleRect.height = correctedHandleRect.height;
	}
}

function initializeOverlayPosition() {
	overlay.x = 24;
	overlay.y = Math.max(24, previewSize.height - overlay.fontSize - 40);
}

function getCanvasPoint(event: PointerEvent): { x: number; y: number } | null {
	const canvas = canvasRef.value;
	if (!canvas) {
		return null;
	}

	const rect = canvas.getBoundingClientRect();

	if (rect.width <= 0 || rect.height <= 0) {
		return null;
	}

	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

function updateCanvasCursor(point: { x: number; y: number } | null) {
	const canvas = canvasRef.value;
	if (!canvas || !point || !image.value) {
		if (canvas) {
			canvas.style.cursor = image.value ? "grab" : "default";
		}
		return;
	}

	if (pointHitsResizeHandle(point.x, point.y, resizeHandleRect)) {
		canvas.style.cursor = "nwse-resize";
		return;
	}

	if (pointHitsRect(point.x, point.y, textRect, 10)) {
		canvas.style.cursor = "grab";
		return;
	}

	canvas.style.cursor = "default";
}

async function onFileSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];

	clearMessages();

	if (!file) {
		return;
	}

	if (!file.type.startsWith("image/")) {
		setError("Please choose a valid image file.");
		target.value = "";
		return;
	}

	if (file.size > 12 * 1024 * 1024) {
		setError("Image must be smaller than 12MB.");
		target.value = "";
		return;
	}

	busy.value = true;

	try {
		image.value = await loadImageFromFile(file);
		await nextTick();
		redraw();
		initializeOverlayPosition();
		redraw();
		setStatus("Image loaded. Drag text box to move, drag corner handle to resize.");
	} catch {
		setError("Failed to load image. Please try another file.");
	} finally {
		busy.value = false;
	}
}

function onPointerDown(event: PointerEvent) {
	if (!image.value) {
		return;
	}

	const point = getCanvasPoint(event);

	if (!point) {
		return;
	}

	const hitResizeHandle = pointHitsResizeHandle(point.x, point.y, resizeHandleRect);
	const hitTextBox = pointHitsRect(point.x, point.y, textRect, 10);

	if (!hitResizeHandle && !hitTextBox) {
		return;
	}

	drag.active = true;
	drag.mode = hitResizeHandle ? "resize" : "move";
	drag.offsetX = point.x - overlay.x;
	drag.offsetY = point.y - overlay.y;
	drag.startX = point.x;
	drag.startY = point.y;
	drag.startFontSize = overlay.fontSize;

	event.preventDefault();
	canvasRef.value?.setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
	if (!image.value) {
		return;
	}

	const point = getCanvasPoint(event);

	if (!point) {
		return;
	}

	if (!drag.active) {
		updateCanvasCursor(point);
		return;
	}

	if (drag.mode === "resize") {
		const delta = Math.max(point.x - drag.startX, point.y - drag.startY);
		overlay.fontSize = Math.max(14, Math.min(260, drag.startFontSize + delta));
	} else {
		overlay.x = point.x - drag.offsetX;
		overlay.y = point.y - drag.offsetY;

		const clamped = clampOverlayPosition(overlay, previewSize, textRect);
		overlay.x = clamped.x;
		overlay.y = clamped.y;
	}

	redraw();
	updateCanvasCursor(point);
}

function onPointerUp(event: PointerEvent) {
	if (!drag.active) {
		return;
	}

	drag.active = false;
	updateCanvasCursor(getCanvasPoint(event));
	canvasRef.value?.releasePointerCapture(event.pointerId);
}

function formatDownloadName() {
	const now = new Date();
	const pad = (value: number) => value.toString().padStart(2, "0");
	const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	return `composed-${stamp}.png`;
}

async function downloadImage() {
	if (!image.value) {
		return;
	}

	clearMessages();
	busy.value = true;

	try {
		const blob = await exportCompositionBlob({
			image: image.value,
			overlay,
			previewSize,
			mimeType: "image/png"
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = formatDownloadName();
		a.click();
		URL.revokeObjectURL(url);
		setStatus("Downloaded PNG successfully.");
	} catch {
		setError("Failed to generate download image.");
	} finally {
		busy.value = false;
	}
}

async function copyToClipboard() {
	if (!image.value) {
		return;
	}

	clearMessages();

	if (!("clipboard" in navigator) || typeof ClipboardItem === "undefined") {
		setError("Clipboard image copy is not supported in this browser.");
		return;
	}

	busy.value = true;

	try {
		const blob = await exportCompositionBlob({
			image: image.value,
			overlay,
			previewSize,
			mimeType: "image/png"
		});

		await navigator.clipboard.write([
			new ClipboardItem({
				"image/png": blob
			})
		]);

		setStatus("Image copied to clipboard.");
	} catch {
		setError("Clipboard copy failed. Browser may require HTTPS or permission.");
	} finally {
		busy.value = false;
	}
}

watch(
	() => [overlay.text, overlay.fontSize, overlay.color],
	() => {
		if (!image.value) {
			return;
		}

		redraw();
	}
);

onMounted(() => {
	if (typeof window !== "undefined") {
		isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
	}

	if (typeof ResizeObserver !== "undefined") {
		resizeObserver = new ResizeObserver(() => {
			if (!image.value) {
				return;
			}

			redraw();
		});

		if (previewHostRef.value) {
			resizeObserver.observe(previewHostRef.value);
		}
	}
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
	resizeObserver = null;
});
</script>
