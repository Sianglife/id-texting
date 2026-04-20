<template>
	<main class="grid min-h-screen grid-cols-1 gap-4 p-5 lg:grid-cols-[minmax(280px,380px)_1fr]" :class="isDark ? 'bg-[#14181d] text-[#e8edf2]' : 'bg-[#f8f8f6] text-[#2f2a25]'">
		<section class="rounded-2xl border p-4" :class="isDark ? 'border-[#3a424c] bg-[#1d232b]' : 'border-[#d7ccbf] bg-white'">
			<div class="mb-2 flex items-center justify-between gap-2">
				<h1 class="m-0 my-2 text-2xl">圖上字</h1>
				<button
					type="button"
					class="rounded-[10px] border px-3 py-1.5 text-sm"
					:class="isDark ? 'border-[#596575] bg-[#12171d] text-[#dce4ed]' : 'border-[#2f2a25] bg-white text-[#2f2a25]'"
					:aria-label="isDark ? '切換為淺色模式' : '切換為深色模式'"
					:title="isDark ? '切換為淺色模式' : '切換為深色模式'"
					@click="isDark = !isDark"
				>
					<span class="sr-only">{{ isDark ? "淺色模式" : "深色模式" }}</span>
					<svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>
					<svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 3a7 7 0 1 0 9 9 9 9 0 1 1-9-9z" />
					</svg>
				</button>
			</div>

			<label class="mb-4 grid gap-1.5">
				<span class="text-[0.92rem]" :class="isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">圖片</span>
				<div class="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden">
					<input
						class="w-full min-w-0 max-w-full rounded-[10px] border px-3 py-2"
						:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
						type="file"
						accept="image/png,image/jpeg,image/webp"
						@change="onFileSelected"
					/>
					<button
						type="button"
						class="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border disabled:cursor-not-allowed disabled:opacity-50"
						:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
						:disabled="busy"
						aria-label="從剪貼簿匯入圖片"
						title="從剪貼簿匯入圖片"
						@click="importImageFromClipboard"
					>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<rect x="8" y="3" width="8" height="4" rx="1" />
							<path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
							<path d="M9 12h6" />
							<path d="M9 16h6" />
						</svg>
					</button>
				</div>
				<label class="mt-2 inline-flex items-center gap-2 text-sm" :class="isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">
					<input type="checkbox" class="h-4 w-4 rounded border" :class="isDark ? 'border-[#4f5967] bg-[#131820]' : 'border-[#cdbfae] bg-white'" v-model="cacheImageInBrowser" />
					<span>在瀏覽器中儲存圖片與編輯狀態</span>
				</label>
			</label>

			<div class="mb-4 grid gap-1.5">
				<div class="flex items-center justify-between gap-2">
					<span class="text-[0.92rem]" :class="!image ? (isDark ? 'text-[#7c8794]' : 'text-[#a3988a]') : isDark ? 'text-[#c4cdd7]' : 'text-[#594f45]'">文字</span>
					<div class="relative" ref="templatePickerRef">
						<button
							type="button"
							class="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border text-lg leading-none disabled:cursor-not-allowed disabled:opacity-50"
							:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
							:disabled="busy"
							aria-label="新增文字框"
							title="新增文字框"
							@click="openTemplatePicker"
						>
							+
						</button>

						<div
							v-if="isTemplatePickerOpen"
							class="absolute right-0 top-[44px] z-30 w-[280px] rounded-[14px] border p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
							:class="isDark ? 'border-[#4f5967] bg-[#1a2027] text-[#e8edf2]' : 'border-[#cdbfae] bg-[#fffdf8] text-[#2f2a25]'"
						>
							<div class="absolute right-3 top-[-6px] h-3 w-3 rotate-45 border-l border-t" :class="isDark ? 'border-[#4f5967] bg-[#1a2027]' : 'border-[#cdbfae] bg-[#fffdf8]'" />
							<p class="mb-2 text-xs" :class="isDark ? 'text-[#aab6c4]' : 'text-[#6f6255]'">選一個文字來新增</p>
							<div class="grid max-h-[220px] gap-1.5 overflow-auto">
								<button
									v-for="item in templateTextOptionsList"
									:key="item.id"
									type="button"
									class="rounded-[10px] border px-2.5 py-2 text-left"
									:class="
										selectedTemplateId === item.id
											? isDark
												? 'border-[#8ea0b6] bg-[#222b35]'
												: 'border-[#8b7761] bg-[#f3ede4]'
											: isDark
												? 'border-[#4f5967] bg-[#131820]'
												: 'border-[#d8cdbf] bg-white'
									"
									@click="selectTemplateAndAdd(item.id)"
								>
									<div class="text-sm font-semibold">{{ item.label }}</div>
									<div class="mt-0.5 text-xs" :class="isDark ? 'text-[#aab6c4]' : 'text-[#6f6255]'">{{ item.text || "(空白)" }}</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="grid gap-2">
					<div v-for="(item, index) in overlays" :key="`overlay-${index}`" class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
						<input
							:ref="el => setTextInputRef(el, index)"
							class="rounded-[10px] border border-transparent px-3 py-2 focus:outline-none"
							:class="
								!image
									? isDark
										? 'bg-[#10151b] text-[#7c8794] placeholder:text-[#68727e] focus:border-[#586777]'
										: 'bg-[#f3eee7] text-[#a3988a] placeholder:text-[#b6ab9d] focus:border-[#b7aa9b]'
									: isDark
										? 'bg-[#131820] text-[#e8edf2] focus:border-[#8ea0b6]'
										: 'bg-white text-[#2f2a25] focus:border-[#8b7761]'
							"
							v-model="item.text"
							type="text"
							:placeholder="`輸入文字 ${index + 1}`"
							:disabled="!image"
							@focus="setActiveOverlay(index)"
						/>
						<input
							class="h-[38px] w-[38px] rounded-[10px] border p-1"
							:class="!image ? (isDark ? 'border-[#3f4752] bg-[#10151b]' : 'border-[#ddd3c7] bg-[#f3eee7]') : isDark ? 'border-[#4f5967] bg-[#131820]' : 'border-[#cdbfae] bg-white'"
							v-model="item.color"
							type="color"
							:disabled="!image"
							:title="`設定文字 ${index + 1} 顏色`"
							@focus="setActiveOverlay(index)"
						/>
						<button
							type="button"
							class="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border text-base leading-none disabled:cursor-not-allowed disabled:opacity-50"
							:class="isDark ? 'border-[#4f5967] bg-[#131820] text-[#e8edf2]' : 'border-[#cdbfae] bg-white text-[#2f2a25]'"
							:disabled="busy || overlays.length <= 1"
							aria-label="刪除此文字框"
							title="刪除此文字框"
							@click="removeOverlayInput(index)"
						>
							×
						</button>
					</div>
				</div>

				<p v-if="isDev && selectedOverlay" class="mt-1 text-xs" :class="isDark ? 'text-[#8fa2b7]' : 'text-[#6f6255]'">
					選取資訊 x: {{ Math.round(selectedOverlay.x) }}, y: {{ Math.round(selectedOverlay.y) }}, font-size: {{ Math.round(selectedOverlay.fontSize) }}
				</p>
			</div>

			<div class="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
				<button
					class="cursor-pointer rounded-[10px] border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
					:class="isDark ? 'border-[#708094] bg-[#364050] text-[#f0f4f8]' : 'border-[#2f2a25] bg-[#2f2a25] text-[#fffdf8]'"
					type="button"
					:disabled="!image || busy"
					@click="downloadImage"
				>
					下載圖片(PNG)
				</button>
				<button
					type="button"
					class="cursor-pointer rounded-[10px] border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
					:class="isDark ? 'border-[#708094] bg-[#12171d] text-[#dce4ed]' : 'border-[#2f2a25] bg-[#fffdf8] text-[#2f2a25]'"
					:disabled="!image || busy"
					@click="copyToClipboard"
				>
					複製圖片
				</button>
			</div>

			<p v-if="status" class="mt-3 rounded-[10px] border px-3 py-2 text-[0.92rem]" :class="isDark ? 'border-[#2f6b4d] bg-[#173526] text-[#9ce5bd]' : 'border-[#9ac7ae] bg-[#eaf7ef] text-[#2d6a4f]'">
				{{ status }}
			</p>
			<p v-if="errorMessage" class="mt-3 text-[0.92rem] text-[#9b2226]">{{ errorMessage }}</p>
			<p class="mt-4 text-sm leading-relaxed" :class="isDark ? 'text-[#e7a95d]' : 'text-[#8a4b00]'">此工具完全在你的裝置運行，不會將您的圖片上傳到伺服器，敬請安心使用</p>
			<button
				type="button"
				class="mt-2 cursor-pointer rounded-[10px] border px-3 py-2 text-sm"
				:class="isDark ? 'border-[#708094] bg-[#12171d] text-[#dce4ed]' : 'border-[#2f2a25] bg-[#fffdf8] text-[#2f2a25]'"
				@click="resetWorkspace"
			>
				重設畫面
			</button>
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
					@dblclick="onCanvasDoubleClick"
				/>
			</div>

			<p class="mt-3 text-sm" :class="isDark ? 'text-[#a9b3bf]' : 'text-[#6c5f52]'" v-if="image">拖曳文字框可移動位置，拖曳右下角斜線把手可調整大小。</p>
			<p class="mt-3 text-sm" :class="isDark ? 'text-[#a9b3bf]' : 'text-[#6c5f52]'" v-else>請先載入圖片</p>
		</section>
	</main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, type ComponentPublicInstance } from "vue";
import textTemplates from "../data/textTemplates.json";
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
	type TextOverlay,
} from "../utils/canvasComposer";

type TemplateTextOption = {
	id: string;
	label: string;
	text: string;
	fontSize?: number;
	position?: {
		x: number;
		y: number;
	};
};

type PersistedOverlayState = {
	overlays: TextOverlay[];
	activeOverlayIndex: number;
};

const OVERLAY_STATE_STORAGE_KEY = "id-texting-overlay-state-v1";
const CACHE_IMAGE_OPTION_STORAGE_KEY = "id-texting-cache-image-option-v1";
const CACHED_IMAGE_STORAGE_KEY = "id-texting-cached-image-base64-v1";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const previewHostRef = ref<HTMLElement | null>(null);
const textInputRefs = ref<Array<HTMLInputElement | null>>([]);
const templatePickerRef = ref<HTMLElement | null>(null);

const image = ref<HTMLImageElement | null>(null);
const previewSize = reactive<Size>({ width: 0, height: 0 });
const textRects = ref<Rect[]>([]);
const resizeHandleRect = reactive<Rect>({ x: 0, y: 0, width: 16, height: 16 });

const createDefaultOverlay = (text = ""): TextOverlay => ({
	text,
	x: 24,
	y: 24,
	fontSize: 40,
	color: "#ff0000",
	fontFamily: "system-ui, sans-serif",
	fontWeight: "700",
});

const overlays = ref<TextOverlay[]>([]);
const activeOverlayIndex = ref(0);
const isTemplatePickerOpen = ref(false);
const selectedTemplateId = ref<string>("");
const pendingTemplateOverlayIndex = ref<number | null>(null);
const templateTick = ref(Date.now());
const templateTextOptionsList = computed<TemplateTextOption[]>(() => {
	void templateTick.value;

	return (textTemplates as TemplateTextOption[]).map(item => {
		if (item.id === "date-roc-number") {
			return {
				...item,
				text: getCurrentRocDateText(),
			};
		}

		if (item.id === "date-gregorian-number") {
			return {
				...item,
				text: getCurrentGregorianDateText(),
			};
		}

		return item;
	});
});
const isDev = import.meta.dev;
const selectedOverlay = computed(() => overlays.value[activeOverlayIndex.value] ?? null);
const hasRestoredOverlayState = ref(false);

const busy = ref(false);
const status = ref("");
const errorMessage = ref("");
const isDark = ref(false);
const cacheImageInBrowser = ref(false);
const imageSourceDataUrl = ref("");

const drag = reactive({
	active: false,
	mode: "move" as "move" | "resize",
	overlayIndex: 0,
	offsetX: 0,
	offsetY: 0,
	startX: 0,
	startY: 0,
	startFontSize: 40,
});

let resizeObserver: ResizeObserver | null = null;
let templateClockTimer: ReturnType<typeof setInterval> | null = null;

function getCurrentRocDateText() {
	const now = new Date();
	const rocYear = now.getFullYear() - 1911;
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const day = now.getDate().toString().padStart(2, "0");
	return `${rocYear}/${month}/${day}`;
}

function getCurrentGregorianDateText() {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, "0");
	const day = now.getDate().toString().padStart(2, "0");
	return `${year}/${month}/${day}`;
}

function setTextInputRef(element: Element | ComponentPublicInstance | null, index: number) {
	if (element && "$el" in element) {
		textInputRefs.value[index] = element.$el as HTMLInputElement | null;
		return;
	}

	textInputRefs.value[index] = element as HTMLInputElement | null;
}

function setActiveOverlay(index: number) {
	if (index < 0 || index >= overlays.value.length) {
		return;
	}

	if (activeOverlayIndex.value === index) {
		return;
	}

	activeOverlayIndex.value = index;

	if (image.value) {
		redraw();
	}
}

function positionOverlay(index: number) {
	const overlay = overlays.value[index];

	if (!overlay) {
		return;
	}

	overlay.x = 24;
	overlay.y = Math.max(24, previewSize.height - overlay.fontSize - 40 - index * Math.round(overlay.fontSize * 1.35));
}

function initializeOverlayPositions() {
	for (let index = 0; index < overlays.value.length; index += 1) {
		positionOverlay(index);
	}
}

function persistOverlayState() {
	if (typeof window === "undefined") {
		return;
	}

	const payload: PersistedOverlayState = {
		overlays: overlays.value.map(overlay => ({ ...overlay })),
		activeOverlayIndex: activeOverlayIndex.value,
	};

	window.localStorage.setItem(OVERLAY_STATE_STORAGE_KEY, JSON.stringify(payload));
}

function persistCacheImageOptionState() {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(CACHE_IMAGE_OPTION_STORAGE_KEY, cacheImageInBrowser.value ? "1" : "0");
}

function restoreCacheImageOptionState() {
	if (typeof window === "undefined") {
		return;
	}

	const saved = window.localStorage.getItem(CACHE_IMAGE_OPTION_STORAGE_KEY);
	cacheImageInBrowser.value = saved === "1";
}

function clearCachedImage() {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(CACHED_IMAGE_STORAGE_KEY);
}

function isStorageQuotaExceeded(error: unknown) {
	return error instanceof DOMException && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
}

function blobToDataURL(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
				return;
			}

			reject(new Error("Failed to convert blob to base64"));
		};

		reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
		reader.readAsDataURL(blob);
	});
}

function cacheSourceImageToLocalStorage(sourceDataUrl: string) {
	if (typeof window === "undefined" || !cacheImageInBrowser.value || !sourceDataUrl.startsWith("data:image/")) {
		return;
	}

	try {
		window.localStorage.setItem(CACHED_IMAGE_STORAGE_KEY, sourceDataUrl);
	} catch (error) {
		if (isStorageQuotaExceeded(error)) {
			clearCachedImage();
			setError("圖片過大，瀏覽器儲存空間不足，無法暫存原圖。");
			return;
		}

		console.warn("Unable to cache source image in localStorage", error);
	}
}

async function cacheSourceImageFromBlob(blob: Blob) {
	if (!cacheImageInBrowser.value) {
		return;
	}

	const dataUrl = await blobToDataURL(blob);
	imageSourceDataUrl.value = dataUrl;
	cacheSourceImageToLocalStorage(dataUrl);
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("Unable to load cached image"));
		img.src = dataUrl;
	});
}

async function restoreCachedImage() {
	if (typeof window === "undefined") {
		return;
	}

	const cachedDataUrl = window.localStorage.getItem(CACHED_IMAGE_STORAGE_KEY);

	if (!cachedDataUrl || !cachedDataUrl.startsWith("data:image/")) {
		return;
	}

	try {
		image.value = await loadImageFromDataUrl(cachedDataUrl);
		imageSourceDataUrl.value = cachedDataUrl;
		await nextTick();

		if (!hasRestoredOverlayState.value) {
			initializeOverlayPositions();
		}

		redraw();
		setStatus("已載入暫存圖片");
	} catch {
		clearCachedImage();
	}
}

function restoreOverlayState() {
	if (typeof window === "undefined") {
		return;
	}

	const raw = window.localStorage.getItem(OVERLAY_STATE_STORAGE_KEY);

	if (!raw) {
		return;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<PersistedOverlayState>;

		if (!Array.isArray(parsed.overlays)) {
			return;
		}

		overlays.value = parsed.overlays
			.filter(overlay => overlay && typeof overlay === "object")
			.map(overlay => {
				const normalized = createDefaultOverlay(typeof overlay.text === "string" ? overlay.text : "");

				if (typeof overlay.x === "number") {
					normalized.x = overlay.x;
				}

				if (typeof overlay.y === "number") {
					normalized.y = overlay.y;
				}

				if (typeof overlay.fontSize === "number") {
					normalized.fontSize = overlay.fontSize;
				}

				if (typeof overlay.color === "string") {
					normalized.color = overlay.color;
				}

				if (typeof overlay.fontFamily === "string") {
					normalized.fontFamily = overlay.fontFamily;
				}

				if (typeof overlay.fontWeight === "string") {
					normalized.fontWeight = overlay.fontWeight;
				}

				return normalized;
			});

		const fallbackIndex = overlays.value.length > 0 ? overlays.value.length - 1 : 0;
		const restoredIndex = typeof parsed.activeOverlayIndex === "number" ? parsed.activeOverlayIndex : 0;
		activeOverlayIndex.value = Math.max(0, Math.min(restoredIndex, fallbackIndex));
		hasRestoredOverlayState.value = overlays.value.length > 0;
	} catch {
		window.localStorage.removeItem(OVERLAY_STATE_STORAGE_KEY);
	}
}

function resetWorkspace() {
	closeTemplatePicker();
	image.value = null;
	imageSourceDataUrl.value = "";
	overlays.value = [];
	textInputRefs.value = [];
	activeOverlayIndex.value = 0;
	selectedTemplateId.value = "";
	previewSize.width = 0;
	previewSize.height = 0;
	textRects.value = [];
	resizeHandleRect.x = 0;
	resizeHandleRect.y = 0;
	resizeHandleRect.width = 16;
	resizeHandleRect.height = 16;
	drag.active = false;
	clearMessages();

	if (typeof window !== "undefined") {
		window.localStorage.removeItem(OVERLAY_STATE_STORAGE_KEY);
		clearCachedImage();
	}

	hasRestoredOverlayState.value = false;

	const canvas = canvasRef.value;

	if (canvas) {
		const ctx = canvas.getContext("2d");
		ctx?.clearRect(0, 0, canvas.width, canvas.height);
	}

	setStatus("畫面已重設。");
}

function openTemplatePicker() {
	if (isTemplatePickerOpen.value) {
		closeTemplatePicker();
		return;
	}

	addOverlayInput("");
	pendingTemplateOverlayIndex.value = activeOverlayIndex.value;
	selectedTemplateId.value = templateTextOptionsList.value[0]?.id ?? "";
	isTemplatePickerOpen.value = true;
}

function closeTemplatePicker() {
	isTemplatePickerOpen.value = false;
	pendingTemplateOverlayIndex.value = null;
}

function addOverlayInput(text = "") {
	overlays.value.push(createDefaultOverlay(text));
	const nextIndex = overlays.value.length - 1;
	activeOverlayIndex.value = nextIndex;

	if (image.value) {
		positionOverlay(nextIndex);
		redraw();
	}

	void nextTick(() => {
		textInputRefs.value[nextIndex]?.focus();
	});
}

function selectTemplateAndAdd(templateId: string) {
	selectedTemplateId.value = templateId;

	const targetIndex = pendingTemplateOverlayIndex.value;

	if (targetIndex === null) {
		closeTemplatePicker();
		return;
	}

	const selected = templateTextOptionsList.value.find(item => item.id === templateId);
	const targetOverlay = overlays.value[targetIndex];

	if (targetOverlay) {
		targetOverlay.text = selected?.text ?? "";

		if (typeof selected?.fontSize === "number") {
			targetOverlay.fontSize = selected.fontSize;
		}

		if (selected?.position) {
			targetOverlay.x = selected.position.x;
			targetOverlay.y = selected.position.y;
		}

		setActiveOverlay(targetIndex);
	}

	closeTemplatePicker();
}

function onGlobalPointerDown(event: PointerEvent) {
	if (!isTemplatePickerOpen.value) {
		return;
	}

	const target = event.target as Node | null;

	if (!target) {
		closeTemplatePicker();
		return;
	}

	if (templatePickerRef.value?.contains(target)) {
		return;
	}

	closeTemplatePicker();
}

function removeOverlayInput(index: number) {
	if (index < 0 || index >= overlays.value.length || overlays.value.length <= 1) {
		return;
	}

	overlays.value.splice(index, 1);
	textInputRefs.value.splice(index, 1);

	if (activeOverlayIndex.value > index) {
		activeOverlayIndex.value -= 1;
	} else if (activeOverlayIndex.value === index) {
		activeOverlayIndex.value = Math.max(0, Math.min(index, overlays.value.length - 1));
	}

	if (image.value) {
		redraw();
	}

	persistOverlayState();
}

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

		for (const overlay of overlays.value) {
			overlay.x *= sx;
			overlay.y *= sy;
		}
	}

	previewSize.width = nextSize.width;
	previewSize.height = nextSize.height;

	textRects.value = renderPreview({
		canvas: canvasRef.value,
		image: image.value,
		overlays: overlays.value,
		size: previewSize,
		activeOverlayIndex: activeOverlayIndex.value,
	});

	let changed = false;

	for (let index = 0; index < overlays.value.length; index += 1) {
		const overlay = overlays.value[index];

		if (!overlay) {
			continue;
		}

		const rect = textRects.value[index] ?? { x: overlay.x, y: overlay.y, width: 1, height: Math.max(1, overlay.fontSize * 1.25) };
		const clamped = clampOverlayPosition(overlay, previewSize, rect);

		if (clamped.x !== overlay.x || clamped.y !== overlay.y) {
			overlay.x = clamped.x;
			overlay.y = clamped.y;
			changed = true;
		}
	}

	if (changed) {
		textRects.value = renderPreview({
			canvas: canvasRef.value,
			image: image.value,
			overlays: overlays.value,
			size: previewSize,
			activeOverlayIndex: activeOverlayIndex.value,
		});
	}

	const activeRect = textRects.value[activeOverlayIndex.value] ?? { x: 0, y: 0, width: 1, height: 1 };
	const handleRect = getResizeHandleRect(activeRect);
	resizeHandleRect.x = handleRect.x;
	resizeHandleRect.y = handleRect.y;
	resizeHandleRect.width = handleRect.width;
	resizeHandleRect.height = handleRect.height;
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
		y: event.clientY - rect.top,
	};
}

function updateCanvasCursor(point: { x: number; y: number } | null) {
	const canvas = canvasRef.value;

	if (!canvas) {
		return;
	}

	if (!point || !image.value) {
		canvas.style.cursor = image.value ? "grab" : "default";
		return;
	}

	for (let index = overlays.value.length - 1; index >= 0; index -= 1) {
		const rect = textRects.value[index];

		if (!rect) {
			continue;
		}

		if (pointHitsResizeHandle(point.x, point.y, getResizeHandleRect(rect))) {
			canvas.style.cursor = "nwse-resize";
			return;
		}

		if (pointHitsRect(point.x, point.y, rect, 10)) {
			canvas.style.cursor = "grab";
			return;
		}
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
		setError("請選擇有效的圖片檔案。");
		target.value = "";
		return;
	}

	if (file.size > 12 * 1024 * 1024) {
		setError("圖片大小必須小於 12MB。");
		target.value = "";
		return;
	}

	busy.value = true;

	try {
		image.value = await loadImageFromFile(file);
		await cacheSourceImageFromBlob(file);
		await nextTick();

		if (!hasRestoredOverlayState.value) {
			initializeOverlayPositions();
		}

		redraw();
		setStatus("圖片已載入");
	} catch {
		setError("載入圖片失敗，請再試一次。");
	} finally {
		busy.value = false;
	}
}

async function importImageFromClipboard() {
	clearMessages();

	if (!navigator.clipboard || typeof navigator.clipboard.read !== "function") {
		setError("此瀏覽器不支援從剪貼簿匯入圖片。");
		return;
	}

	busy.value = true;

	try {
		const items = await navigator.clipboard.read();
		let imageBlob: Blob | null = null;

		for (const item of items) {
			const imageType = item.types.find(type => type.startsWith("image/"));

			if (!imageType) {
				continue;
			}

			imageBlob = await item.getType(imageType);
			break;
		}

		if (!imageBlob) {
			setError("剪貼簿中沒有圖片內容。");
			return;
		}

		if (imageBlob.size > 12 * 1024 * 1024) {
			setError("圖片大小必須小於 12MB。");
			return;
		}

		const type = imageBlob.type || "image/png";
		const extension = type.includes("/") ? type.split("/")[1] : "png";
		const file = new File([imageBlob], `clipboard-image.${extension}`, { type });

		image.value = await loadImageFromFile(file);
		await cacheSourceImageFromBlob(imageBlob);
		await nextTick();

		if (!hasRestoredOverlayState.value) {
			initializeOverlayPositions();
		}

		redraw();
		setStatus("貼上完成");
	} catch {
		setError("讀取剪貼簿圖片失敗，請檢查權限設定。");
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

	let hitIndex = -1;
	let hitMode: "move" | "resize" = "move";

	for (let index = overlays.value.length - 1; index >= 0; index -= 1) {
		const rect = textRects.value[index];

		if (!rect) {
			continue;
		}

		if (pointHitsResizeHandle(point.x, point.y, getResizeHandleRect(rect))) {
			hitIndex = index;
			hitMode = "resize";
			break;
		}

		if (pointHitsRect(point.x, point.y, rect, 10)) {
			hitIndex = index;
			hitMode = "move";
			break;
		}
	}

	if (hitIndex < 0) {
		return;
	}

	setActiveOverlay(hitIndex);
	const overlay = overlays.value[hitIndex];

	if (!overlay) {
		return;
	}

	drag.active = true;
	drag.mode = hitMode;
	drag.overlayIndex = hitIndex;
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

	const overlay = overlays.value[drag.overlayIndex];

	if (!overlay) {
		return;
	}

	if (drag.mode === "resize") {
		const delta = Math.max(point.x - drag.startX, point.y - drag.startY);
		overlay.fontSize = Math.max(14, Math.min(260, drag.startFontSize + delta));
	} else {
		overlay.x = point.x - drag.offsetX;
		overlay.y = point.y - drag.offsetY;

		const rect = textRects.value[drag.overlayIndex] ?? {
			x: overlay.x,
			y: overlay.y,
			width: 1,
			height: Math.max(1, overlay.fontSize * 1.25),
		};
		const clamped = clampOverlayPosition(overlay, previewSize, rect);
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
	persistOverlayState();
}

function onCanvasDoubleClick(event: MouseEvent) {
	if (!image.value) {
		return;
	}

	const canvas = canvasRef.value;

	if (!canvas) {
		return;
	}

	const rect = canvas.getBoundingClientRect();

	if (rect.width <= 0 || rect.height <= 0) {
		return;
	}

	const pointX = event.clientX - rect.left;
	const pointY = event.clientY - rect.top;

	for (let index = overlays.value.length - 1; index >= 0; index -= 1) {
		const hitRect = textRects.value[index];

		if (!hitRect || !pointHitsRect(pointX, pointY, hitRect, 10)) {
			continue;
		}

		setActiveOverlay(index);
		const input = textInputRefs.value[index];

		if (!input) {
			return;
		}

		input.focus();
		const textLength = input.value.length;
		input.setSelectionRange(textLength, textLength);
		return;
	}
}

function formatDownloadName() {
	const now = new Date();
	const pad = (value: number) => value.toString().padStart(2, "0");
	const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	return `圖上字-${stamp}.png`;
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
			overlays: overlays.value,
			previewSize,
			mimeType: "image/png",
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = formatDownloadName();
		a.click();
		URL.revokeObjectURL(url);
		setStatus("PNG 圖片下載完成。");
	} catch {
		setError("產生下載圖片失敗。");
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
		setError("此瀏覽器不支援複製圖片到剪貼簿。");
		return;
	}

	busy.value = true;

	try {
		const blob = await exportCompositionBlob({
			image: image.value,
			overlays: overlays.value,
			previewSize,
			mimeType: "image/png",
		});

		await navigator.clipboard.write([
			new ClipboardItem({
				"image/png": blob,
			}),
		]);

		setStatus("圖片已複製到剪貼簿。");
	} catch {
		setError("複製到剪貼簿失敗，瀏覽器可能需要 HTTPS 或權限設定。");
	} finally {
		busy.value = false;
	}
}

watch(
	overlays,
	() => {
		if (image.value) {
			redraw();
		}

		if (!drag.active) {
			persistOverlayState();
		}
	},
	{ deep: true },
);

watch(cacheImageInBrowser, enabled => {
	persistCacheImageOptionState();

	if (!enabled) {
		clearCachedImage();
		return;
	}

	if (imageSourceDataUrl.value) {
		cacheSourceImageToLocalStorage(imageSourceDataUrl.value);
	}
});

watch(activeOverlayIndex, () => {
	if (image.value) {
		redraw();
	}

	persistOverlayState();
});

onMounted(() => {
	restoreOverlayState();
	restoreCacheImageOptionState();
	void restoreCachedImage();
	templateClockTimer = setInterval(() => {
		templateTick.value = Date.now();
	}, 30 * 1000);

	if (typeof window !== "undefined") {
		window.addEventListener("pointerdown", onGlobalPointerDown);
	}

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
	if (typeof window !== "undefined") {
		window.removeEventListener("pointerdown", onGlobalPointerDown);
	}

	if (templateClockTimer) {
		clearInterval(templateClockTimer);
		templateClockTimer = null;
	}

	resizeObserver?.disconnect();
	resizeObserver = null;
});
</script>
