import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import { useGridDisplayLoadState } from '@/hooks/useGridDisplayLoadState';
import { useGridPreviewLoadState } from '@/hooks/useGridPreviewLoadState';
import { useAppStore } from '@/store/useAppStore';

export default function ImageGallery() {
	const results = useAppStore((s) => s.results);
	const query = useAppStore((s) => s.query);
	const status = useAppStore((s) => s.status);
	const isGridPreviewReady = useAppStore((s) => s.isGridPreviewReady);
	const searchError = useAppStore((s) => (s.status === 'error' && s.error ? s.error : undefined));
	const handlePreviewImageLoad = useGridPreviewLoadState();
	const handleDisplayImageLoad = useGridDisplayLoadState();

	if (!query && results.length === 0) {
		return <div></div>;
	}

	if (searchError) {
		return (
			<ResultsFallbackState fallbackState='error' message={searchError.message} addColoredMask />
		);
	}

	if (results.length === 0 && status === 'success') {
		return <ResultsFallbackState fallbackState='empty' message={query} />;
	}

	return (
		<div
			className={
				isGridPreviewReady
					? 'flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5'
					: 'hidden' // to avoid layout shift when preview images are loading
			}
		>
			<MasonryGrid columnCount={3} gap={12}>
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
