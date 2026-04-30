import type { KeyboardEvent } from 'react';

import { AppCommand, type AppCommandType } from '@/services/providers/searchProvider.types';
import type { AppState, AppStateCreator } from '@/store/appStore.types';
import type {
	GridNavigation,
	NavigationSlice,
} from '@/store/slices/navigationSlice/navigationSlice.types';

const SPACE = ' ' as const;
const searchInputKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Enter', SPACE, 'Tab'] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type SearchInputKey = (typeof searchInputKeys)[number];

/**
 * Narrow the runtime key string to search input keys.
 *
 * Returns `true` when the pressed key is one of the supported search input
 * navigation keys, allowing the caller to safely treat `key` as a
 * `SearchInputKey`.
 */
const isSearchInputKeyboardKey = (key: string): key is SearchInputKey => {
	return searchInputKeys.some((k) => k === key);
};

export const createNavigationSlice: AppStateCreator<NavigationSlice> = (set, get) => ({
	selectedGridIndex: null,

	setSelectedGridIndex: (index: number | null) => {
		set({ selectedGridIndex: index });
	},

	moveGridSelection: (direction: GridNavigation, columns: number) => {
		const { results, selectedGridIndex } = get();
		if (results.length === 0) return;

		if (selectedGridIndex === null) {
			set({ selectedGridIndex: 0 });
			return;
		}

		let nextIndex = selectedGridIndex;
		const count = results.length;

		switch (direction) {
			case 'right': {
				nextIndex = selectedGridIndex + 1;
				if (nextIndex >= count) nextIndex = 0;
				break;
			}
			case 'left': {
				nextIndex = selectedGridIndex - 1;
				if (nextIndex < 0) nextIndex = count - 1;
				break;
			}
			case 'down': {
				nextIndex = selectedGridIndex + columns;
				if (nextIndex >= count) {
					// wrap to top of next column if reached end of column visually
					// but row-major order: index 0,1,2 / 3,4,5.
					// Example: down from 5 (if 7 items), could be 5+3=8 >= 7. Next index should be next column?
					// Wait, "wrap to next column correctly".
					nextIndex = (selectedGridIndex % columns) + 1;
					if (nextIndex >= columns) nextIndex = 0;
				}
				break;
			}
			case 'up': {
				nextIndex = selectedGridIndex - columns;
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
			set({ selectedGridIndex: nextIndex });
		}
	},

	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => {
		if (!isSearchInputKeyboardKey(e.key)) return;

		const showCommandMenu = get().rawInput === '/';

		const keyEventHandlers: Record<SearchInputKey, () => void> = {
			Escape: () => {
				if (showCommandMenu) {
					get().setInput('');
					set({ selectedCommandIndex: 0 });
					return;
				}

				window.close();
			},
			ArrowDown: () => {
				if (showCommandMenu) {
					set((state: AppState) => ({
						selectedCommandIndex:
							state.selectedCommandIndex < commandOptions.length - 1
								? state.selectedCommandIndex + 1
								: 0,
					}));
					return;
				}

				if (get().results.length > 0) {
					get().setSelectedGridIndex(0);
				}
			},
			ArrowUp: () => {
				if (showCommandMenu) {
					set((state: AppState) => ({
						selectedCommandIndex:
							state.selectedCommandIndex > 0
								? state.selectedCommandIndex - 1
								: commandOptions.length - 1,
					}));
					return;
				}

				if (get().results.length > 0) {
					get().setSelectedGridIndex(get().results.length - 1);
				}
			},
			Tab: () => {
				if (showCommandMenu) {
					set((state: AppState) => ({
						selectedCommandIndex:
							state.selectedCommandIndex < commandOptions.length - 1
								? state.selectedCommandIndex + 1
								: 0,
					}));
				}
			},
			Enter: () => {
				if (showCommandMenu) {
					get().chooseCommand(get().selectedCommandIndex);
				}
			},
			[SPACE]: () => {
				if (showCommandMenu) {
					get().chooseCommand(get().selectedCommandIndex);
				}
			},
		};

		if (e.key !== SPACE || get().rawInput === '/') {
			e.preventDefault();
		}

		keyEventHandlers[e.key]();
	},
});
