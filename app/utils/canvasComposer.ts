export interface TextOverlay {
	text: string;
	x: number;
	y: number;
	fontSize: number;
	color: string;
	fontFamily: string;
	fontWeight: string;
}

export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface Size {
	width: number;
	height: number;
}

interface RenderPreviewOptions {
	canvas: HTMLCanvasElement;
	image: HTMLImageElement;
	overlays: TextOverlay[];
	size: Size;
	dpr?: number;
	showOverlayGuides?: boolean;
	activeOverlayIndex?: number;
}

interface ExportOptions {
	image: HTMLImageElement;
	overlays: TextOverlay[];
	previewSize: Size;
	mimeType?: string;
	quality?: number;
}

export function fitWithin(sourceWidth: number, sourceHeight: number, maxWidth: number, maxHeight: number): Size {
	if (sourceWidth <= 0 || sourceHeight <= 0 || maxWidth <= 0 || maxHeight <= 0) {
		return { width: 0, height: 0 };
	}

	const scale = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);

	return {
		width: Math.max(1, Math.floor(sourceWidth * scale)),
		height: Math.max(1, Math.floor(sourceHeight * scale)),
	};
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
	return await new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Unable to load image"));
		};

		img.src = url;
	});
}

export function renderPreview(options: RenderPreviewOptions): Rect[] {
	const { canvas, image, overlays, size } = options;
	const dpr = Math.max(1, options.dpr ?? (typeof window !== "undefined" ? window.devicePixelRatio : 1));
	const showOverlayGuides = options.showOverlayGuides ?? true;
	const activeOverlayIndex = options.activeOverlayIndex ?? -1;
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas 2D context is unavailable");
	}

	canvas.width = Math.max(1, Math.floor(size.width * dpr));
	canvas.height = Math.max(1, Math.floor(size.height * dpr));
	canvas.style.width = `${size.width}px`;
	canvas.style.height = `${size.height}px`;

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, size.width, size.height);

	ctx.drawImage(image, 0, 0, size.width, size.height);

	const textRects: Rect[] = [];

	for (const overlay of overlays) {
		const text = overlay.text || "";
		ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
		ctx.textBaseline = "top";
		ctx.fillStyle = overlay.color;
		ctx.fillText(text, overlay.x, overlay.y);

		const metrics = ctx.measureText(text);
		const textWidth = Math.max(0, metrics.width);
		const textHeight = Math.max(1, overlay.fontSize * 1.25);
		textRects.push({
			x: overlay.x,
			y: overlay.y,
			width: textWidth,
			height: textHeight,
		});
	}

	if (showOverlayGuides && activeOverlayIndex >= 0 && activeOverlayIndex < textRects.length) {
		const activeOverlay = overlays[activeOverlayIndex];
		const activeRect = textRects[activeOverlayIndex];
		const activeTextLength = activeOverlay?.text?.length ?? 0;

		if (activeTextLength > 0 && activeRect) {
			ctx.save();
			ctx.strokeStyle = "#fffdf8";
			ctx.lineWidth = 1;
			ctx.strokeRect(activeRect.x - 2, activeRect.y - 2, activeRect.width + 4, activeRect.height + 4);
			ctx.restore();

			const handleRect = getResizeHandleRect(activeRect);
			drawResizeHandle(ctx, handleRect);
		}
	}

	return textRects;
}

function drawResizeHandle(ctx: CanvasRenderingContext2D, handleRect: Rect) {
	ctx.fillStyle = "#fffdf8";
	ctx.strokeStyle = "#2f2a25";
	ctx.lineWidth = 1;
	ctx.fillRect(handleRect.x, handleRect.y, handleRect.width, handleRect.height);
	ctx.strokeRect(handleRect.x, handleRect.y, handleRect.width, handleRect.height);

	// Diagonal marks hinting drag-to-resize.
	ctx.beginPath();
	ctx.moveTo(handleRect.x + 4, handleRect.y + handleRect.height - 6);
	ctx.lineTo(handleRect.x + handleRect.width - 6, handleRect.y + 4);
	ctx.moveTo(handleRect.x + 7, handleRect.y + handleRect.height - 3);
	ctx.lineTo(handleRect.x + handleRect.width - 3, handleRect.y + 7);
	ctx.stroke();
}

export function getResizeHandleRect(rect: Rect, size = 16): Rect {
	return {
		x: rect.x + rect.width - size / 2,
		y: rect.y + rect.height - size / 2,
		width: size,
		height: size,
	};
}

export function pointHitsResizeHandle(pointX: number, pointY: number, handleRect: Rect, padding = 8): boolean {
	return pointX >= handleRect.x - padding && pointX <= handleRect.x + handleRect.width + padding && pointY >= handleRect.y - padding && pointY <= handleRect.y + handleRect.height + padding;
}

export function pointHitsRect(pointX: number, pointY: number, rect: Rect, padding = 10): boolean {
	return pointX >= rect.x - padding && pointX <= rect.x + rect.width + padding && pointY >= rect.y - padding && pointY <= rect.y + rect.height + padding;
}

export function clampOverlayPosition(overlay: TextOverlay, bounds: Size, textRect: Rect): TextOverlay {
	const maxX = Math.max(0, bounds.width - textRect.width);
	const maxY = Math.max(0, bounds.height - textRect.height);

	return {
		...overlay,
		x: Math.min(maxX, Math.max(0, overlay.x)),
		y: Math.min(maxY, Math.max(0, overlay.y)),
	};
}

export async function exportCompositionBlob(options: ExportOptions): Promise<Blob> {
	const { image, overlays, previewSize } = options;
	const mimeType = options.mimeType ?? "image/png";
	const quality = options.quality ?? 0.92;

	if (previewSize.width <= 0 || previewSize.height <= 0) {
		throw new Error("Invalid preview size for export");
	}

	const exportCanvas = document.createElement("canvas");
	exportCanvas.width = image.naturalWidth;
	exportCanvas.height = image.naturalHeight;

	const ctx = exportCanvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas 2D context is unavailable");
	}

	ctx.drawImage(image, 0, 0, exportCanvas.width, exportCanvas.height);

	const scale = exportCanvas.width / previewSize.width;

	for (const overlay of overlays) {
		const exportOverlay = {
			...overlay,
			x: overlay.x * scale,
			y: overlay.y * scale,
			fontSize: overlay.fontSize * scale,
		};

		ctx.font = `${exportOverlay.fontWeight} ${exportOverlay.fontSize}px ${exportOverlay.fontFamily}`;
		ctx.textBaseline = "top";
		ctx.fillStyle = exportOverlay.color;
		ctx.fillText(exportOverlay.text, exportOverlay.x, exportOverlay.y);
	}

	const blob = await new Promise<Blob | null>(resolve => {
		exportCanvas.toBlob(resolve, mimeType, quality);
	});

	if (!blob) {
		throw new Error("Failed to export image blob");
	}

	return blob;
}
