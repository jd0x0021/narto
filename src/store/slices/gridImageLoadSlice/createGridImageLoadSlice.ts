import { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type { AppStateCreator } from '@/store/appStore.types';
import type { GridImageLoadSlice } from '@/store/slices/gridImageLoadSlice/gridImageLoadSlice.types';

/**
 * This slice tracks the loading completion for the
 * dual-layer rendering strategy of the grid display.
 *
 * Manages the loading states for the preview images (low-resolution placeholders) and the
 * display images (high-resolution final renders) that are in the masonry grid. Components
 * use these states to orchestrate a progressive image-rendering loading pattern.
 */
export const createGridImageLoadSlice: AppStateCreator<GridImageLoadSlice> = (set, get) =>
	({
		isGridPreviewReady: false,
		isGridDisplayReady: false,
		failedDisplayImageIds: [],

		setIsGridPreviewReady: (isGridPreviewReady: boolean) => {
			set({ isGridPreviewReady });
		},

		setIsGridDisplayReady: (isGridDisplayReady: boolean) => {
			set({ isGridDisplayReady });
		},

		setDisplayImageAsFailed: (imageId: number) => {
			const { results, failedDisplayImageIds } = get();

			if (failedDisplayImageIds.includes(imageId)) return;

			const nextFailedDisplayImageIds = [...failedDisplayImageIds, imageId];
			const allImagesFailedToLoad = nextFailedDisplayImageIds.length === results.length;

			set({
				status: 'error',
				isGridPreviewReady: false,
				failedDisplayImageIds: nextFailedDisplayImageIds,
				error: new SearchProviderError(
					'network',
					allImagesFailedToLoad
						? 'Unable to load ALL the requested images.'
						: 'Unable to load at least one image.',
				),
			});
		},
	}) satisfies GridImageLoadSlice;
