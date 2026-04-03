export async function copyImageFromUrl(url: string, mimeType: string): Promise<void> {
	try {
		if (mimeType === 'gif') {
			await navigator.clipboard.writeText(url);
			return;
		}

		const res = await fetch(url);
		const blob = await res.blob();

		// We only copy PNGs via Image API if supported
		// navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
		// Some browsers strictly require image/png for ClipboardItem
		if (blob.type === 'image/png' && typeof ClipboardItem !== 'undefined') {
			await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
			return;
		}

		// Fallback: copy URL
		await navigator.clipboard.writeText(url);
	} catch (err) {
		console.error('Copy failed, falling back to URL copy', err);
		await navigator.clipboard.writeText(url).catch((e: unknown) => {
			console.error('Fallback URL copy failed', e);
		});
	}
}
