import { useSearchStore } from '../store/useSearchStore';
import GridImage from './GridImage';
import MasonryGrid from './MasonryGrid';

export default function ImageGallery() {
	const results = useSearchStore((s) => s.results);
	const query = useSearchStore((s) => s.query);
	const status = useSearchStore((s) => s.status);

	if (!query && results.length === 0) {
		{
			/* Intentionally left blank or some subtle visual empty state per design constraint */
		}
		return <div></div>;
	}

	if (status === 'error') {
		const errorMessage = useSearchStore.getState().errorMessage;
		return (
			<div className='flex-1 flex flex-col items-center justify-center p-6 text-red-500 text-sm'>
				Error loading results: {errorMessage}
			</div>
		);
	}

	if (results.length === 0 && status === 'success') {
		return (
			<div className='flex-1 flex flex-col items-center justify-center p-6 text-narto-muted/50 text-sm mt-10'>
				No results found for "{query}"
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-x-hidden scrollbar-hidden relative mt-2'>
			<MasonryGrid columnCount={3} gap={12}>
				{results.map((item, i) => (
					<GridImage key={item.id} item={item} index={i} />
				))}
			</MasonryGrid>
		</div>
	);
}
