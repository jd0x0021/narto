/**
 * Copies an image from a remote URL to the system clipboard, normalizing the data
 * to a format that is broadly supported across browsers and target applications.
 *
 * This function fetches the image, converts it to a PNG {@link Blob} when necessary,
 * and writes it to the clipboard using the Async Clipboard API. This ensures reliable
 * paste behavior in apps like Messenger, which often reject or
 * transform unsupported formats (e.g. `image/webp`).
 *
 * GIFs are intentionally handled as URLs instead of binary data to preserve animation,
 * since clipboard image writes do not reliably support animated formats.
 *
 * @param url - The source URL of the image to copy
 * @param mimeType - The original image format identifier (e.g. "webp", "gif")
 *
 * @returns A promise that resolves once the copy operation completes
 *
 * @throws An Error to propagate unexpected failures from fetch, decoding, or clipboard APIs
 *
 * @remarks
 * - Clipboard image writes are effectively limited to `image/png` in many environments
 * - Non-PNG formats (e.g. WebP, JPEG) are converted via {@link blobToPng} for compatibility
 * - Metadata (EXIF, ICC profiles) is not preserved during conversion
 * - Animated images (GIFs) are copied as URLs to avoid losing animation frames
 * - Requires a secure context (HTTPS or extension environment) and user interaction
 */
export async function copyImageFromUrl(url: string, mimeType: string): Promise<void> {
	try {
		// Copying GIFs as URLs since clipboard image writes do not reliably support animated formats
		if (mimeType === 'gif') {
			await navigator.clipboard.writeText(url);
			return;
		}

		const res: Response = await fetch(url);
		let blob: Blob = await res.blob();

		// Normalize to PNG because Clipboard.write has limited MIME support.
		// Converting here guarantees consistent paste behavior across apps.
		// Dragging an image prefers WEBP, copying to Clipboard prefers PNG.
		if (blob.type !== 'image/png') {
			blob = await blobToPng(blob);
		}

		// Write binary image data to clipboard when supported.
		// The actual copying of the image to clipboard.
		if (typeof ClipboardItem !== 'undefined') {
			await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
			return;
		}

		// Fallback: copy the image URL if binary clipboard is unavailable
		await navigator.clipboard.writeText(url);
	} catch (err) {
		console.error('Copy failed, falling back to URL copy', err);

		// Final fallback: attempt to copy URL even after failure
		await navigator.clipboard.writeText(url).catch((e: unknown) => {
			console.error('Fallback URL copy failed', e);
		});
	}
}

/**
 * Converts an arbitrary image {@link Blob} (e.g. WebP, JPEG) into a PNG {@link Blob}
 * suitable for Clipboard API writes.
 *
 * This is primarily used to normalize image formats because browser clipboard
 * implementations (especially in Chromium and extension contexts) only reliably
 * support `image/png` for `ClipboardItem.write`. Attempting to write unsupported
 * types like `image/webp` will throw a `NotAllowedError`.
 *
 * Internally, this function decodes the source image into an {@link ImageBitmap},
 * draws it onto an {@link OffscreenCanvas}, and re-encodes it as a PNG blob.
 *
 * @param blob - Source image blob of any browser-decodable type (e.g. `image/webp`)
 * @returns A promise that resolves to a PNG-encoded {@link Blob} (`image/png`)
 *
 * @throws An Error if the canvas 2D rendering context cannot be created
 *
 * @remarks
 * - This operation is lossy in terms of metadata (EXIF, ICC profiles, etc. are not preserved)
 * - Pixel data fidelity is preserved (no quality degradation for raster content)
 * - Performance cost scales with image dimensions; consider caching results for repeated use
 */
async function blobToPng(blob: Blob): Promise<Blob> {
	const bitmap: ImageBitmap = await createImageBitmap(blob);
	const canvas: OffscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const canvasContext: OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d');

	if (!canvasContext) throw new Error('Canvas context not available');

	canvasContext.drawImage(bitmap, 0, 0);

	return await canvas.convertToBlob({ type: 'image/png' });
}
