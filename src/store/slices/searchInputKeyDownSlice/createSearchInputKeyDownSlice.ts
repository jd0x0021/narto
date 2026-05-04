import type { KeyboardEvent } from 'react';

import { AppCommand, type AppCommandType } from '@/services/providers/searchProvider.types';
import type { AppStateCreator, AppStoreApi } from '@/store/appStore.types';
import type { SearchInputKeyDownSlice } from '@/store/slices/searchInputKeyDownSlice/searchInputKeyDownSlice.types';

const SPACE = ' ' as const;
const searchModeKeys = ['Escape', 'ArrowDown', 'ArrowUp'] as const;
const commandMenuModeKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Tab', 'Enter', SPACE] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type SearchModeKey = (typeof searchModeKeys)[number];
type CommandMenuModeKey = (typeof commandMenuModeKeys)[number];

/**
 * This slice manages the keyboard keydown logic specifically tailored for the global
 * search input component. It acts as an orchestrator, to interact with either the
 * command menu dropdown or the image grid, depending on the current search input mode.
 *
 * @param set - The Zustand setter function for updating state.
 * @param get - The Zustand getter function for reading current state.
 * @returns The initial state and actions for search input navigation.
 */
export const createSearchInputKeyDownSlice: AppStateCreator<SearchInputKeyDownSlice> = (set, get) =>
	({
		handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => {
			const showCommandMenu = get().rawInput === '/';

			if (showCommandMenu) {
				executeCommandMenuModeKeyAction(e, { get, set });
			} else {
				executeSearchModeKeyAction(e, { get });
			}
		},
	}) satisfies SearchInputKeyDownSlice;

/**
 * Narrow the runtime `key` parameter to keys handled when the global
 * search bar is in **search mode**, meaning the command menu is inactive.
 *
 * When `true`, `key` is one of the keys listed in {@link searchModeKeys}.
 *
 * @param key - keyboard event key.
 */
const isSearchModeKeyboardKey = (key: string): key is SearchModeKey => {
	return searchModeKeys.some((k) => k === key);
};

/**
 * Narrow the runtime `key` parameter to keys handled when the command menu is open/active.
 *
 * When `true`, `key` is one of the keys listed in {@link commandMenuModeKeys}.
 *
 * @param key - keyboard event key.
 */
const isCommandMenuModeKeyboardKey = (key: string): key is CommandMenuModeKey => {
	return commandMenuModeKeys.some((k) => k === key);
};

/**
 * Handle a keydown event when the command menu is open/active.
 *
 * These are the only supported keys: {@link commandMenuModeKeys}.
 *
 * @param e - Keyboard event from the search input.
 * @param appStore - Zustand APIs used to read and update app state.
 */
function executeCommandMenuModeKeyAction(
	e: KeyboardEvent<HTMLElement>,
	appStore: AppStoreApi,
): void {
	if (!isCommandMenuModeKeyboardKey(e.key)) return;

	const keyEventHandlers: Record<CommandMenuModeKey, () => void> = {
		Escape: () => {
			appStore.get().setInput('');
			appStore.set({ selectedCommandIndex: 0 });
		},
		ArrowDown: () => {
			const selectedCommandIndex = appStore.get().selectedCommandIndex;
			appStore.set({
				selectedCommandIndex:
					selectedCommandIndex < commandOptions.length - 1 ? selectedCommandIndex + 1 : 0,
			});
		},
		ArrowUp: () => {
			const selectedCommandIndex = appStore.get().selectedCommandIndex;
			appStore.set({
				selectedCommandIndex:
					selectedCommandIndex > 0 ? selectedCommandIndex - 1 : commandOptions.length - 1,
			});
		},
		Tab: () => {
			const selectedCommandIndex = appStore.get().selectedCommandIndex;
			appStore.set({
				selectedCommandIndex:
					selectedCommandIndex < commandOptions.length - 1 ? selectedCommandIndex + 1 : 0,
			});
		},
		Enter: () => {
			appStore.get().chooseCommand(appStore.get().selectedCommandIndex);
		},
		[SPACE]: () => {
			appStore.get().chooseCommand(appStore.get().selectedCommandIndex);
		},
	};

	e.preventDefault();
	keyEventHandlers[e.key]();
}

/**
 * Handle a keydown event when the global search bar is in **search mode**.
 *
 * These are the only supported keys: {@link searchModeKeys}.
 *
 * @param e - Keyboard event from the search input.
 * @param get - Zustand getter for the combined app state.
 */
function executeSearchModeKeyAction(
	e: KeyboardEvent<HTMLElement>,
	appStore: Pick<AppStoreApi, 'get'>,
): void {
	if (!isSearchModeKeyboardKey(e.key)) return;

	const keyEventHandlers: Record<SearchModeKey, () => void> = {
		Escape: () => {
			window.close();
		},
		ArrowDown: () => {
			if (appStore.get().results.length > 0) {
				appStore.get().setSelectedGridCell(0);
			}
		},
		ArrowUp: () => {
			if (appStore.get().results.length > 0) {
				appStore.get().setSelectedGridCell(appStore.get().results.length - 1);
			}
		},
	};

	e.preventDefault();
	keyEventHandlers[e.key]();
}
