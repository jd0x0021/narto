import { useCallback, useEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

const RESULTS_PER_PAGE = Number.parseInt(import.meta.env.VITE_KLIPY_RESULTS_PER_PAGE);

/**
 * Tracks the loading state of the display images (the images that we're
 * expecting to see based on the search criteria) in the masonry grid
 * to determine when the grid content is fully loaded.
 *
 * The hook preserves already-loaded image IDs between similar searches so
 * reused grid items do not need to reload or retrigger readiness state.
 *
 * When the result set changes:
 * - image IDs that no longer exist in the latest results are removed
 * - reused image IDs are preserved
 * - grid content readiness is reset until all active display images are loaded
 *
 * @returns a stable callback intended to be attached to each display image's `onLoad` event.
 */
export const useGridDisplayLoadState = () => {
	const results = useAppStore((s) => s.results);
	const setIsGridDisplayReady = useAppStore((s) => s.setIsGridDisplayReady);

	// Stores display image IDs that have completed loading for the latest active result set.
	const loadedDisplayImageIds = useRef(new Set<number>());

	useEffect(() => {
		const loadedDisplayImages = loadedDisplayImageIds.current;

		// Reset if the results are empty
		if (results.length <= 0) {
			loadedDisplayImages.clear();
			setIsGridDisplayReady(false);
			return;
		}

		const resultIds = new Set<number>(results.map((r) => r.id));

		// Remove stale image IDs from previous searches while preserving IDs that still exist
		// in the latest result set (images from previous searches gets reused if the previous
		// and latest search queries are similar). Already-loaded display images should remain
		// tracked because their <img> elements will not trigger another onLoad event after
		// reconciliation, since each grid cell (`GridImage` component) ideally has a stable key.
		for (const id of loadedDisplayImages) {
			if (!resultIds.has(id)) {
				// Remove image IDs that no longer belong to the latest result set.
				loadedDisplayImages.delete(id);
			}
		}

		// Do not reset the grid display readiness if ALL the display image IDs of the latest search result set
		// have already been tracked as loaded (using loadedDisplayImages). This is possible when the
		// latest search request returns the same display image IDs as the previous search request (for
		// example, when the search query and internally resolved command are exactly the same).
		if (RESULTS_PER_PAGE !== loadedDisplayImages.size) {
			// The grid display readiness should only reset when the latest result set
			// contains display images that have not yet been tracked internally.
			setIsGridDisplayReady(false);
		}
	}, [results, setIsGridDisplayReady]);

	/**
	 * Registers a display image as loaded for the latest result set.
	 *
	 * This determines if all display images in the current result set have finished loading.
	 *
	 * @param imageId - The ID of the image whose display image has finished loading.
	 */
	const handleDisplayImageLoad = useCallback(
		(imageId: number) => {
			if (results.length <= 0) return;

			const loadedDisplayImages = loadedDisplayImageIds.current;
			loadedDisplayImages.add(imageId);

			if (results.length === loadedDisplayImages.size) {
				setIsGridDisplayReady(true);
			}
		},
		[results.length, setIsGridDisplayReady],
	);

	return handleDisplayImageLoad;
};
