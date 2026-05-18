import { useEffect, useRef } from 'react';

import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import { useAppStore } from '@/store/useAppStore';

export default function ImageGallery() {
	const results = useAppStore((s) => s.results);
	const query = useAppStore((s) => s.query);
	const status = useAppStore((s) => s.status);
	const isGridPreviewReady = useAppStore((s) => s.isGridPreviewReady);
	const setIsGridPreviewReady = useAppStore((s) => s.setIsGridPreviewReady);
	const searchError = useAppStore((s) => (s.status === 'error' && s.error ? s.error : undefined));
	const loadedPreviewImageIds = useRef(new Set<number>());

	useEffect(() => {
		const loadedPreviewImages = loadedPreviewImageIds.current;

		if (results.length <= 0) {
			loadedPreviewImages.clear();
			setIsGridPreviewReady(false);
			return;
		}

		const resultIds = new Set<number>(results.map((r) => r.id));

		for (const id of loadedPreviewImages) {
			if (!resultIds.has(id)) {
				loadedPreviewImages.delete(id);
			}
		}

		setIsGridPreviewReady(false);
	}, [results, setIsGridPreviewReady]);

	const handlePreviewImageLoad = (imageId: number) => {
		if (results.length <= 0) return;

		const loadedPreviewImages = loadedPreviewImageIds.current;
		loadedPreviewImages.add(imageId);

		if (results.length === loadedPreviewImages.size) {
			setIsGridPreviewReady(true);
		}
	};

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
					/>
				))}
			</MasonryGrid>
		</div>
	);
}
