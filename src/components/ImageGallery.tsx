import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import { useAppStore } from '@/store/useAppStore';

export default function ImageGallery() {
	const results = useAppStore((s) => s.results);
	const query = useAppStore((s) => s.query);
	const status = useAppStore((s) => s.status);
	const gridLayoutCalculationCompleted = useAppStore((s) => s.gridLayoutCalculationCompleted);
	const showLoading =
		status === 'loading' || results.length === 0 || !gridLayoutCalculationCompleted;
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

	// if (results.length === 0) {
	// 	if (status === 'loading') {
	// 		return (
	// 			<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5 flex items-center justify-center'>
	// 				<p className='text-base font-semibold text-narto-muted/75'>Loading</p>
	// 			</div>
	// 		);
	// 	}
	// 	return <div></div>;
	// }

	return (
		<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5'>
			{showLoading && (
				<div className='absolute inset-0 flex items-center justify-center'>
					<p className='text-base font-semibold text-narto-muted/75'>Loading</p>
				</div>
			)}

			<div
				className={[
					'transition-opacity duration-150 ease-out',
					showLoading ? 'opacity-0 pointer-events-none' : 'opacity-100',
				].join(' ')}
			>
				<MasonryGrid columnCount={3} gap={12}>
					{results.map((image, i) => (
						<GridImage key={image.id} image={image} index={i} />
					))}
				</MasonryGrid>
			</div>
		</div>
	);
}
