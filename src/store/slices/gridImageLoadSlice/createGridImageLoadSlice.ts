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
export const createGridImageLoadSlice: AppStateCreator<GridImageLoadSlice> = (set) =>
	({
		isGridPreviewReady: false,
		isGridDisplayReady: false,

		setIsGridPreviewReady: (isGridPreviewReady: boolean) => {
			set({ isGridPreviewReady });
		},

		setIsGridDisplayReady: (isGridDisplayReady: boolean) => {
			set({ isGridDisplayReady });
		},
	}) satisfies GridImageLoadSlice;
