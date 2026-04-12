import { create } from 'zustand';

import { searchProvider } from '@/services/providers/searchProvider';
import type {
	AppCommandType,
	NormalizedSearchResult,
} from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { parseCommand } from '@/utils/parseCommand';

export const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred while fetching results.';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
type GridNavigation = 'up' | 'down' | 'left' | 'right';

type SearchState = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedSearchResult[];
	selectedIndex: number | null;
	status: SearchStatus;
	errorMessage?: string;
	requestId: number;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
	setSelectedIndex: (index: number | null) => void;
	moveSelection: (direction: GridNavigation, columns: number) => void;
};

export const useSearchStore = create<SearchState>((set, get) => ({
	rawInput: '',
	resolvedCommand: AppCommand.Meme,
	query: '',
	results: [],
	selectedIndex: null,
	status: 'idle',
	requestId: 0,

	setInput: (rawInput: string) => {
		const parsed = parseCommand(rawInput);
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

		const nextId = requestId + 1;
		set({ requestId: nextId, status: 'loading', selectedIndex: null });

		try {
			const data: NormalizedSearchResult[] = await searchProvider.search(resolvedCommand, query);

			if (get().requestId !== nextId) return;

			set({ results: data, status: 'success' });
		} catch (err: unknown) {
			if (get().requestId !== nextId) return;
			const errorMessage = err instanceof Error ? err.message : UNKNOWN_ERROR_MESSAGE;
			set({ status: 'error', errorMessage, results: [] });
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
}));
