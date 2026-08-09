import { GridImage } from '@/components/GridImage';
import { MasonryGrid } from '@/components/MasonryGrid';
import { ResultsFallbackState } from '@/components/ResultsFallbackState';
import { MASONRY_GRID_COLUMN_COUNT, MASONRY_GRID_GAP } from '@/constants/masonryGrid.constants';
import { useGridDisplayLoadState } from '@/hooks/useGridDisplayLoadState';
import { useGridPreviewLoadState } from '@/hooks/useGridPreviewLoadState';
import { useAppStore } from '@/store/useAppStore';

export function ImageGallery() {
	const results = useAppStore((s) => s.results);
	const query = useAppStore((s) => s.query);
	const status = useAppStore((s) => s.status);
	const isGridPreviewReady = useAppStore((s) => s.isGridPreviewReady);
	const searchError = useAppStore((s) => (s.status === 'error' && s.error ? s.error : undefined));
	const allImagesFailedToLoad = useAppStore(
		(s) => s.failedDisplayImageIds.length === s.results.length,
	);

	const handlePreviewImageLoad = useGridPreviewLoadState();
	const handleDisplayImageLoad = useGridDisplayLoadState();

	if (!query && results.length === 0) {
		return <div></div>;
	}

	// Show the full-page error when there is a search-related error and none of the display images loaded
	// successfully. If at least one image loaded, keep the MasonryGrid visible (i.e., do not render the full-page
	// error state) so users can still view the successfully loaded results and per-image error states.
	if (searchError && allImagesFailedToLoad) {
		return (
			<ResultsFallbackState fallbackState='error' message={searchError.message} addColoredMask />
		);
	}

	if (results.length === 0 && status === 'success') {
		return <ResultsFallbackState fallbackState='empty' message={query} />;
	}

	// Render the MasonryGrid as long as one or more display images loaded successfully.
	// Images that failed to load are still rendered and shows their per-image error state.
	return (
		<div
			className={`flex-1 overflow-x-hidden scrollbar-hidden relative 
				${
					// Keep the top margin stable and avoid layout shifts when preview images are loading
					// (this is the spacing between the SearchInput, and the ImageGallery components)
					isGridPreviewReady ? 'mt-2.5' : ''
				}`}
		>
			<MasonryGrid columnCount={MASONRY_GRID_COLUMN_COUNT} gap={MASONRY_GRID_GAP}>
				{results.map((image, i) => (
					<GridImage
						key={image.id}
						image={image}
						index={i}
						handlePreviewImageLoad={handlePreviewImageLoad}
						handleDisplayImageLoad={handleDisplayImageLoad}
					/>
				))}
			</MasonryGrid>
		</div>
	);
}
