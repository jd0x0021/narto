import type { KeyboardEvent } from 'react';
import type { StateCreator } from 'zustand';
import { create } from 'zustand';

import { searchProvider } from '@/services/providers/searchProvider';
import { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedSearchResult,
} from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { parseCommand } from '@/utils/parseCommand';

export const UNKNOWN_ERROR_MESSAGE = 'An unknown error occurred while fetching results.';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
type GridNavigation = 'up' | 'down' | 'left' | 'right';

const SPACE = ' ' as const;
const commandKeyboardKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Enter', SPACE] as const;
const searchInputKeys = ['Escape', 'ArrowDown', 'ArrowUp'] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type CommandKeyboardKey = (typeof commandKeyboardKeys)[number];
type SearchInputKey = (typeof searchInputKeys)[number];

type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedSearchResult[];
	selectedIndex: number | null;
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
	// this is the currently selected GridImage in the MasonryGrid. It can be null if no GridImage is selected.
	setSelectedIndex: (index: number | null) => void;
	moveSelection: (direction: GridNavigation, columns: number) => void;
};

type CommandMenuSlice = {
	selectedCommandIndex: number;
	setSelectedCommandIndex: (index: number) => void;
	chooseCommand: (command: AppCommandType) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	handleCommandMenuKeyDown: (e: KeyboardEvent<HTMLElement>, index?: number) => void;
};

type SearchState = SearchSlice & CommandMenuSlice;

const searchSlice: StateCreator<SearchSlice> = (set, get) => ({
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

			const error =
				err instanceof SearchProviderError
					? err
					: new SearchProviderError('unknown', UNKNOWN_ERROR_MESSAGE);

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

const commandMenuSlice: StateCreator<SearchState, [], [], CommandMenuSlice> = (set, get) => ({
	selectedCommandIndex: 0,

	setSelectedCommandIndex: (index: number) => {
		set({ selectedCommandIndex: index });
	},

	chooseCommand: (command: AppCommandType) => {
		const commandValue = `/${command} `;
		get().setInput(commandValue);
	},

	handleKeyDown: (e: KeyboardEvent<HTMLElement>) => {
		const showCommandMenu = get().rawInput === '/';

		if (showCommandMenu) {
			get().handleCommandMenuKeyDown(e);
		} else {
			get().handleSearchInputKeyDown(e);
		}
	},

	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => {
		if (!searchInputKeys.includes(e.key as SearchInputKey)) return;

		const keyEventHandlers: Record<SearchInputKey, () => void> = {
			Escape: () => {
				window.close();
			},
			ArrowDown: () => {
				if (get().results.length > 0) {
					get().setSelectedIndex(0);
				}
			},
			ArrowUp: () => {
				if (get().results.length > 0) {
					get().setSelectedIndex(get().results.length - 1);
				}
			},
		};

		e.preventDefault();
		keyEventHandlers[e.key as SearchInputKey]();
	},

	handleCommandMenuKeyDown: (e: KeyboardEvent<HTMLElement>, index?: number) => {
		if (!commandKeyboardKeys.includes(e.key as CommandKeyboardKey)) return;

		const keyEventHandlers: Record<CommandKeyboardKey, () => void> = {
			Escape: () => {
				get().setInput('');
			},
			ArrowDown: () => {
				set((state: SearchState) => ({
					selectedCommandIndex:
						state.selectedCommandIndex < commandOptions.length - 1
							? state.selectedCommandIndex + 1
							: 0,
				}));
			},
			ArrowUp: () => {
				set((state: SearchState) => ({
					selectedCommandIndex:
						state.selectedCommandIndex > 0
							? state.selectedCommandIndex - 1
							: commandOptions.length - 1,
				}));
			},
			Enter: () => {
				const selectedIndex = index ?? get().selectedCommandIndex;
				get().chooseCommand(commandOptions[selectedIndex]);
			},
			[SPACE]: () => {
				const selectedIndex = index ?? get().selectedCommandIndex;
				get().chooseCommand(commandOptions[selectedIndex]);
			},
		};

		e.preventDefault();
		keyEventHandlers[e.key as CommandKeyboardKey]();
	},
});

export const useSearchStore = create<SearchState>((...a) => ({
	...searchSlice(...a),
	...commandMenuSlice(...a),
}));
