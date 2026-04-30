import { searchProvider } from '@/services/providers/searchProvider';
import { SearchProviderError } from '@/services/providers/searchProvider.errors';
import { AppCommand, type NormalizedSearchResult } from '@/services/providers/searchProvider.types';
import type { AppStateCreator } from '@/store/appStore.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';
import type { ParsedSearchInput } from '@/utils/parseCommand';
import { parseSearchInput } from '@/utils/parseCommand';

export const createSearchSlice: AppStateCreator<SearchSlice> = (set, get) => ({
	rawInput: '',
	resolvedCommand: AppCommand.Meme,
	query: '',
	results: [],
	selectedIndex: null,
	status: 'idle',
	requestId: 0,

	setInput: (rawInput: string) => {
		const parsed: ParsedSearchInput = parseSearchInput(rawInput);
		set({
			rawInput: parsed.rawInput,
			resolvedCommand: parsed.resolvedCommand,
			query: parsed.query,
		});
	},

	runSearch: async () => {
		const { query, resolvedCommand, requestId } = get();

		if (!query) {
			set({ results: [], status: 'idle', selectedIndex: null });
			return;
		}

		// Capture a unique ID for this specific search request and freeze it in this function's closure.
		// Each async runSearch call gets its own independent nextId snapshot that persists through the
		// entire fetch lifecycle, even as the global requestId in the store changes due to new searches.
		const nextId = requestId + 1;
		set({ requestId: nextId, status: 'loading', selectedIndex: null });

		try {
			const data: NormalizedSearchResult[] = await searchProvider.search(resolvedCommand, query);

			// Validate that this request is still the latest by comparing the captured snapshot (nextId)
			// against the current store value (get().requestId). If they don't match, a newer search
			// has already been initiated and this stale response should be discarded.
			// This allows newer requests to invalidate older in-flight requests.
			if (get().requestId !== nextId) return;

			set({ results: data, status: 'success' });
		} catch (err: unknown) {
			if (get().requestId !== nextId) return;

			const error =
				err instanceof SearchProviderError
					? err
					: new SearchProviderError(
							'unknown',
							'An unknown error occurred while fetching results.',
						);

			set({ status: 'error', error, results: [] });
		}
	},

	setSelectedIndex: (index) => {
		set({ selectedIndex: index });
	},

	moveSelection: (direction, columns) => {
		const { results, selectedIndex } = get();
		if (results.length === 0) return;

		if (selectedIndex === null) {
			set({ selectedIndex: 0 });
			return;
		}

		let nextIndex = selectedIndex;
		const count = results.length;

		switch (direction) {
			case 'right': {
				nextIndex = selectedIndex + 1;
				if (nextIndex >= count) nextIndex = 0;
				break;
			}
			case 'left': {
				nextIndex = selectedIndex - 1;
				if (nextIndex < 0) nextIndex = count - 1;
				break;
			}
			case 'down': {
				nextIndex = selectedIndex + columns;
				if (nextIndex >= count) {
					// wrap to top of next column if reached end of column visually
					// but row-major order: index 0,1,2 / 3,4,5.
					// Example: down from 5 (if 7 items), could be 5+3=8 >= 7. Next index should be next column?
					// Wait, "wrap to next column correctly".
					nextIndex = (selectedIndex % columns) + 1;
					if (nextIndex >= columns) nextIndex = 0;
				}
				break;
			}
			case 'up': {
				nextIndex = selectedIndex - columns;
				if (nextIndex < 0) {
					// parent component unsets selected index
					return;
				}
				break;
			}
			default: {
				const neverReachedDirection: never = direction;
				throw new Error(`Unhandled direction: ${JSON.stringify(neverReachedDirection)}`);
			}
		}

		if (nextIndex >= 0 && nextIndex < count) {
			set({ selectedIndex: nextIndex });
		}
	},
});
