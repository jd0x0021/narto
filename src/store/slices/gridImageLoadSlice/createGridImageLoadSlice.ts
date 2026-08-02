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
			const { results, status, failedDisplayImageIds } = get();

			if (status === 'error' || results.length === 0) return;
			if (failedDisplayImageIds.includes(imageId)) return;

			const nextFailedDisplayImageIds = [...failedDisplayImageIds, imageId];

			if (nextFailedDisplayImageIds.length === results.length) {
				set({
					status: 'error',
					error: new SearchProviderError(
						'network',
						'Unable to load the ALL the requested images.',
					),
				});
			}

			set({ failedDisplayImageIds: nextFailedDisplayImageIds });
		},
	}) satisfies GridImageLoadSlice;
