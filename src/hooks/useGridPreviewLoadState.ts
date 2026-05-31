import { useCallback, useEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

/**
 * Manages the visual ready state of the masonry grid by tracking loaded preview images.
 *
 * To prevent layout shifts, the grid remains hidden until
 * the preview is ready for the latest search results.
 *
 * The hook preserves already-loaded image IDs between similar searches so
 * reused grid items do not need to reload or retrigger readiness state.
 *
 * When the result set changes:
 * - image IDs that no longer exist in the latest results are removed
 * - reused image IDs are preserved
 * - grid preview readiness is reset until all active preview images are loaded
 *
 * @returns a stable callback intended to be attached to each preview image's `onLoad` event.
 */
export const useGridPreviewLoadState = () => {
	const results = useAppStore((s) => s.results);
	const setIsGridPreviewReady = useAppStore((s) => s.setIsGridPreviewReady);

	// Stores preview image IDs that have completed loading for the latest active result set.
	const loadedPreviewImageIds = useRef(new Set<number>());

	useEffect(() => {
		const loadedPreviewImages = loadedPreviewImageIds.current;

		// Reset if the results are empty
		if (results.length <= 0) {
			loadedPreviewImages.clear();
			setIsGridPreviewReady(false);
			return;
		}

		const resultIds = new Set<number>(results.map((r) => r.id));

		// Remove stale image IDs from previous searches while preserving IDs that still exist
		// in the latest result set (images from previous searches gets reused if the previous
		// and latest search queries are similar). Already-loaded preview images should remain
		// tracked because their <img> elements will not trigger another onLoad event after
		// reconciliation, since each grid cell (`GridImage` component) ideally has a stable key.
		for (const id of loadedPreviewImages) {
			if (!resultIds.has(id)) {
				// Remove image IDs that no longer belong to the latest result set.
				loadedPreviewImages.delete(id);
			}
		}

		// Reset the ready state until the newly fetched preview images are loaded
		setIsGridPreviewReady(false);
	}, [results, setIsGridPreviewReady]);

	/**
	 * Registers a preview image as loaded for the latest result set.
	 *
	 * This determines when the grid preview (for the
	 * `MasonryGrid` component) is ready to be displayed.
	 *
	 * @param imageId - The ID of the image whose preview image has finished loading.
	 */
	const handlePreviewImageLoad = useCallback(
		(imageId: number) => {
			if (results.length <= 0) return;

			const loadedPreviewImages = loadedPreviewImageIds.current;
			loadedPreviewImages.add(imageId);

			if (results.length === loadedPreviewImages.size) {
				setIsGridPreviewReady(true);
			}
		},
		[results.length, setIsGridPreviewReady],
	);

	return handlePreviewImageLoad;
};
