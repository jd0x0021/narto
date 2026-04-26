import type { KeyboardEvent } from 'react';

import { AppCommand, type AppCommandType } from '@/services/providers/searchProvider.types';
import type { AppState, AppStateCreator } from '@/store/appStore.types';
import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';

const SPACE = ' ' as const;
const commandKeyboardKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Enter', SPACE, 'Tab'] as const;
const searchInputKeys = ['Escape', 'ArrowDown', 'ArrowUp'] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type CommandKeyboardKey = (typeof commandKeyboardKeys)[number];
type SearchInputKey = (typeof searchInputKeys)[number];

export const createCommandMenuSlice: AppStateCreator<CommandMenuSlice> = (set, get) => ({
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
				set((state: AppState) => ({
					selectedCommandIndex:
						state.selectedCommandIndex < commandOptions.length - 1
							? state.selectedCommandIndex + 1
							: 0,
				}));
			},
			ArrowUp: () => {
				set((state: AppState) => ({
					selectedCommandIndex:
						state.selectedCommandIndex > 0
							? state.selectedCommandIndex - 1
							: commandOptions.length - 1,
				}));
			},
			Tab: () => {
				set((state: AppState) => ({
					selectedCommandIndex:
						state.selectedCommandIndex < commandOptions.length - 1
							? state.selectedCommandIndex + 1
							: 0,
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
