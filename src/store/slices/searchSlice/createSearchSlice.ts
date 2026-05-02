import { searchProvider } from '@/services/providers/searchProvider';
import { SearchProviderError } from '@/services/providers/searchProvider.errors';
import { AppCommand, type NormalizedSearchResult } from '@/services/providers/searchProvider.types';
import type { AppStateCreator } from '@/store/appStore.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';
import type { ParsedSearchInput } from '@/utils/parseSearchInput';
import { parseSearchInput } from '@/utils/parseSearchInput';

/**
 * This slice is responsible for orchestrating the main search workflow. It handles
 * the parsing of raw user input into valid commands and queries, and manages the
 * asynchronous fetching of search results via the {@link searchProvider}.
 *
 * @param set - The Zustand setter function for updating state.
 * @param get - The Zustand getter function for reading current state.
 * @returns The initial state and actions for executing searches.
 */
export const createSearchSlice: AppStateCreator<SearchSlice> = (set, get) =>
	({
		rawInput: '',
		resolvedCommand: AppCommand.Meme,
		query: '',
		results: [],
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
				set({ results: [], status: 'idle', selectedGridCell: null });
				return;
			}

			// Capture a unique ID for this specific search request and freeze it in this function's closure.
			// Each async runSearch call gets its own independent nextId snapshot that persists through the
			// entire fetch lifecycle, even as the global requestId in the store changes due to new searches.
			const nextId = requestId + 1;
			set({ requestId: nextId, status: 'loading', selectedGridCell: null });

			try {
				const data: NormalizedSearchResult[] = await searchProvider.search(
					resolvedCommand,
					query,
				);

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
	}) satisfies SearchSlice;
