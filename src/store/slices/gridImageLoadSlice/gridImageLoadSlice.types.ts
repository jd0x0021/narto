export type GridImageLoadSlice = {
	/**
	 * Indicates whether the grid preview layer is ready for display.
	 *
	 * This becomes true when all preview images (lower-resolution placeholders) for the latest result
	 * set have finished loading. The grid preview is shown while the final/full display images are
	 * still loading to avoid a blank/empty grid and provide a faster visual feedback to the user.
	 */
	isGridPreviewReady: boolean;

	/**
	 * Indicates whether the grid display layer has finished loading all final/full display images.
	 *
	 * This becomes true when all final/full display images for the latest result set have finished loading.
	 * This is used to track the loading state of the grid display layer.
	 */
	isGridDisplayReady: boolean;

	/**
	 * Tracks the IDs of display images that have failed to load after all the retry attempts.
	 */
	failedDisplayImageIds: number[];

	setIsGridPreviewReady: (isGridPreviewReady: boolean) => void;
	setIsGridDisplayReady: (isGridDisplayReady: boolean) => void;
	markDisplayImageFailed: (imageId: number) => void;
};
