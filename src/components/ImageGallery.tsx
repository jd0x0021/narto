import { useCallback, useState } from 'react';

import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import type { NormalizedImageData } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';

type GalleryMasonryBlockProps = { results: NormalizedImageData[] };

/** Remount whenever `requestId` changes (see parent `<GalleryMasonryBlock key={requestId} />`) so `layoutReady` resets without syncing in an effect. */
function GalleryMasonryBlock({ results }: GalleryMasonryBlockProps) {
	const [layoutReady, setLayoutReady] = useState(false);

	const handleInitialLayoutComplete = useCallback(() => {
		setLayoutReady(true);
	}, []);

	return (
		<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5'>
			<div
				className={`transition-opacity duration-150 ease-out ${
					layoutReady
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none select-none'
				}`}
				aria-hidden={!layoutReady}
			>
				<MasonryGrid
					columnCount={3}
					gap={12}
					onInitialLayoutComplete={handleInitialLayoutComplete}
				>
					{results.map((image, i) => (
						<GridImage key={image.id} image={image} index={i} />
					))}
				</MasonryGrid>
			</div>
		</div>
	);
}

export default function ImageGallery() {
	const results = useAppStore((s) => s.results);
	const query = useAppStore((s) => s.query);
	const status = useAppStore((s) => s.status);
	const requestId = useAppStore((s) => s.requestId);
	const searchError = useAppStore((s) => (s.status === 'error' && s.error ? s.error : undefined));

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

	if (status === 'loading') {
		return (
			<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5 flex items-center justify-center border border-red-500'>
				<p className='text-base font-semibold text-narto-muted/75'>loading</p>
			</div>
		);
	}

	if (results.length === 0) {
		return <div></div>;
	}

	return <GalleryMasonryBlock key={requestId} results={results} />;
}
