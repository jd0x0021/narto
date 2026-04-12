import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import { UNKNOWN_ERROR_MESSAGE, useSearchStore } from '@/store/useSearchStore';

export default function ImageGallery() {
	const results = useSearchStore((s) => s.results);
	const query = useSearchStore((s) => s.query);
	const status = useSearchStore((s) => s.status);

	if (!query && results.length === 0) {
		return <div></div>;
	}

	if (status === 'error') {
		const errorMessage = useSearchStore.getState().errorMessage;
		return (
			<ResultsFallbackState
				fallbackState='error'
				message={errorMessage ?? UNKNOWN_ERROR_MESSAGE}
				addColoredMask
			/>
		);
	}

	if (results.length === 0 && status === 'success') {
		return <ResultsFallbackState fallbackState='empty' message={query} />;
	}

	return (
		<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5'>
			<MasonryGrid columnCount={3} gap={12}>
				{results.map((item, i) => (
					<GridImage key={item.id} item={item} index={i} />
				))}
			</MasonryGrid>
		</div>
	);
}
