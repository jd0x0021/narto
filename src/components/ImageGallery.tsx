import GridImage from '@/components/GridImage';
import MasonryGrid from '@/components/MasonryGrid';
import ResultsFallbackState from '@/components/ResultsFallbackState';
import { useSearchStore } from '@/store/useSearchStore';

export default function ImageGallery() {
	const results = useSearchStore((s) => s.results);
	const query = useSearchStore((s) => s.query);
	const status = useSearchStore((s) => s.status);
	const searchError = useSearchStore((s) =>
		s.status === 'error' && s.error ? s.error : undefined,
	);

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
		<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2.5'>
			<MasonryGrid columnCount={3} gap={12}>
				{results.map((item, i) => (
					<GridImage key={item.id} item={item} index={i} />
				))}
			</MasonryGrid>
		</div>
	);
}
