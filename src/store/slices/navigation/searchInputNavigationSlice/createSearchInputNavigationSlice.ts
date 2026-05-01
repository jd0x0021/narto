import type { KeyboardEvent } from 'react';

import { AppCommand, type AppCommandType } from '@/services/providers/searchProvider.types';
import type { AppStateCreator } from '@/store/appStore.types';
import type { SearchInputNavigationSlice } from '@/store/slices/navigation/searchInputNavigationSlice/searchInputNavigationSlice.types';

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

export const createSearchInputNavigationSlice: AppStateCreator<SearchInputNavigationSlice> = (
	set,
	get,
) =>
	({
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
						const selectedCommandIndex = get().selectedCommandIndex;
						set({
							selectedCommandIndex:
								selectedCommandIndex < commandOptions.length - 1
									? selectedCommandIndex + 1
									: 0,
						});
						return;
					}

					if (get().results.length > 0) {
						get().setSelectedGridCell(0);
					}
				},
				ArrowUp: () => {
					if (showCommandMenu) {
						const selectedCommandIndex = get().selectedCommandIndex;
						set({
							selectedCommandIndex:
								selectedCommandIndex > 0
									? selectedCommandIndex - 1
									: commandOptions.length - 1,
						});
						return;
					}

					if (get().results.length > 0) {
						get().setSelectedGridCell(get().results.length - 1);
					}
				},
				Tab: () => {
					if (showCommandMenu) {
						const selectedCommandIndex = get().selectedCommandIndex;
						set({
							selectedCommandIndex:
								selectedCommandIndex < commandOptions.length - 1
									? selectedCommandIndex + 1
									: 0,
						});
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
	}) satisfies SearchInputNavigationSlice;
